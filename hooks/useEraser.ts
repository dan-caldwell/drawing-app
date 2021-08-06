import { useContext } from 'react';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';
import clone from 'clone';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import useSelection from './useSelection';
import { BoundingBox } from '@types';

const useEraser = () => {
    const { paths, tools } = useContext(DrawingContext);
    const { getPathBoundingBox } = useSelection();

    // NEW function to test if points are inside of a polygon
    // TODO: Sometimes doesn't work
    function pointInPolygon(point: number[], vs: number[][]) {
        var x = point[0], y = point[1];
        
        var inside = false;
        for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
            var xi = vs[i][0], yi = vs[i][1];
            var xj = vs[j][0], yj = vs[j][1];
            
            var intersect = ((yi > y) != (yj > y))
                && (x < (xj - xi) * (y - yi) / (yj - yi) + xi);
            if (intersect) inside = !inside;
        }
        
        return inside;
    };

    const groupPointsByTwo = (splitPoints: any[]): string[][] => {
        return splitPoints.reduce((accumulator, currentValue, currentIndex, array) => {
            const sliced = array.slice(currentIndex, currentIndex + 2);
            if (currentIndex % 2 === 0) {
                if (sliced.length === 1) {
                    // When at the end of a line, there will only be one point in the sliced array
                    // So push the previous point to be able to make the bounding box
                    if (array[currentIndex - 1]) {
                        sliced.push(array[currentIndex - 1]);
                    }
                    accumulator.push(sliced);
                } else {
                    accumulator.push(sliced);
                }
            }
            return accumulator;
        }, [] as any[]);
    }

    const pointGroupToBoundingBox = (eraserSize: number, pointGroup: string[]) => {
        const splitGroup = pointGroup.map(item => item.split(',').map(num => Number(num)));
        
        const x1 = splitGroup[0][0];
        const y1 = splitGroup[0][1];
        const x2 = splitGroup[1][0];
        const y2 = splitGroup[1][1];

        const polygon = [[x1 + 20, y1 - 20], [x1 - 20, y1 + 20], [x2 + 20, y2 - 20], [x2 - 20, y2 + 20]];
        return polygon;
    }

    const eraseClosePoints = (x: number, y: number) => {
        const eraserSize = 10;
        // Get the shapes that are within the bounds of x,y
        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            const pathsWithinBounds = newPaths.filter(path => x >= path.left - eraserSize && x <= path.right + eraserSize && y >= path.top - eraserSize && y <= path.bottom + eraserSize);
            pathsWithinBounds.forEach(path => {
                const splitPoints = path.points.trim().split(' ');

                // If it's a line:
                // Get the bounding boxes for each line point (which should be a rectangle that goes out eraserSize and is rotated according to the line)
                if (path.type === tools.line) {
                    //console.log('line tool', new Date());
                    const groupedPoints = groupPointsByTwo(splitPoints);
                    groupedPoints.forEach(pointGroup => {
                        const polygon = pointGroupToBoundingBox(eraserSize, pointGroup);
                        const inPolygon = pointInPolygon([x, y], polygon);
                        if (inPolygon) {
                            console.log('in polygon', pointGroup, new Date());
                        }
                        //const inPolygon = pointInPolygon(4, xVals, yVals, x, y);
                        // if (inPolygon) {
                        //     console.log('in polygon', pointGroup, new Date());
                        // }
                        //console.log(pointGroup);
                    })
                    return;
                }


                let closePoints: number[] = [];
                splitPoints.forEach((point, index) => {
                    const pointXY = point.split(',');
                    const pointX = Number(pointXY[0]);
                    const pointY = Number(pointXY[1]);

                    // Check if the points on the path are within eraserSize units from the x,y value
                    // Add the index to the close points array if they are
                    if (Math.abs(x - pointX) <= eraserSize && Math.abs(y - pointY) <= eraserSize) {
                        closePoints.push(index);
                    }
                });
                // Slice splitPoints to closePoints indexes, add to new array
                // e.g. closePoints = [50, 51];
                // newArray = [points from 0 - 49, points from 52 - end];
                if (closePoints.length > 0) {
                    const pointChunks = splitPoints.reduceRight((result, value, index) => {
                        result[0] = result[0] || [];
                        if (closePoints.includes(index)) {
                            result.unshift([value]);
                        } else {
                            result[0].unshift(value);
                        }
                        return result;
                    }, [] as any[]).filter(pointList => pointList.length > 0);

                    // Delete the old path
                    const foundPathIndex = newPaths.findIndex(item => item.id === path.id);
                    if (foundPathIndex > -1) {
                        // Create new paths from pointChunks
                        pointChunks.forEach(points => {
                            const pathClone = clone(newPaths[foundPathIndex]);
                            pathClone.id = uuid();
                            pathClone.points = points.join(' ');
                            const { top, bottom, left, right } = getPathBoundingBox(pathClone.points);
                            pathClone.top = top;
                            pathClone.bottom = bottom;
                            pathClone.left = left;
                            pathClone.right = right;
                            newPaths.push(pathClone);
                        });
                        // Delete the old path
                        newPaths.splice(foundPathIndex, 1);
                    }
                    
                }
            });
            return newPaths;
        })
    }

    return { eraseClosePoints }
}

export default useEraser;
import { useContext } from 'react';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';
import clone from 'clone';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import useSelection from './useSelection';
import { BoundingBox, SvgPath } from '@types';

const useEraser = () => {
    const { paths, tools, debugPoints } = useContext(DrawingContext);
    const { getPathBoundingBox } = useSelection();

    // Tests if a point is inside of a polygon
    const pointInPolygon = (point: number[], vs: number[][]) => {
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
    }

    // Groups the points into an array of line coordinates
    const groupPointsByTwo = (splitPoints: any[]): string[][] => {
        const output: string[][] = [];

        splitPoints.forEach((points, index) => {
            if (splitPoints[index + 1]) {
                output.push([points, splitPoints[index + 1]]);
            }
        });

        return output;
    }

    const pointGroupToBoundingBox = (eraserSize: number, pointGroup: string[]) => {
        const splitGroup = pointGroup.map(item => item.split(',').map(num => Number(num)));
        
        const x1 = splitGroup[0][0];
        const y1 = splitGroup[0][1];
        const x2 = splitGroup[1][0];
        const y2 = splitGroup[1][1];

        // Get the line angle in order to determine the correct bounding box to use
        const lineAngle = Math.atan2(y2 - y1, x2 - x1) * 180 / Math.PI;

        // Determine the correct direction of the bounding box points based on the line angle
        // This will make it so the bounding boxes don't have zero width to them at certain angles (such as -45 degrees)
        if ((lineAngle < 0 && lineAngle > -90) || (lineAngle >= 90)) {
            return [
                [x1 - eraserSize, y1 - eraserSize], 
                [x1 + eraserSize, y1 + eraserSize], 
                [x2 + eraserSize, y2 + eraserSize],
                [x2 - eraserSize, y2 - eraserSize], 
            ]
        } else {
            return [
                [x1 + eraserSize, y1 - eraserSize], 
                [x1 - eraserSize, y1 + eraserSize], 
                [x2 - eraserSize, y2 + eraserSize], 
                [x2 + eraserSize, y2 - eraserSize],
            ];
        }
    }

    // Slice splitPoints to closePoints indexes, add to new array
    // e.g. closePoints = [50, 51];
    // newArray = [points from 0 - 49, points from 52 - end];
    // e.g. closePoints = [closePoints.length - 1];
    // newArray = [points from 0 - closePoints.length - 2];
    const splitPathIntoChunks = (splitPoints: string[], closePoints: number[]) => {

        // This does not work
        // If closePoints only contains one point, then return an array with the correct slice of points
        if (closePoints.length === 1) {
            const output: string[][] = [];
            const firstSlice = splitPoints.slice(0, closePoints[0]);
            const secondSlice = splitPoints.slice(closePoints[0]);
            if (firstSlice.length > 0) output.push(firstSlice);
            if (secondSlice.length > 0) output.push(secondSlice);
            return output;
        }

        return splitPoints.reduceRight((result, value, index) => {
            result[0] = result[0] || [];
            if (closePoints.includes(index)) {
                result.unshift([value]);
            } else {
                result[0].unshift(value);
            }
            return result;
        }, [] as any[]).filter(pointList => pointList.length > 0);
    }

    // For a cloned path, adds all necessary new data, such as an ID and a new bounding box
    const clonedPathData = (pathClone: SvgPath, pointData: []) => {
        pathClone.id = uuid();
        pathClone.points = pointData.join(' ');
        const { top, bottom, left, right } = getPathBoundingBox(pathClone.points);
        pathClone.top = top;
        pathClone.bottom = bottom;
        pathClone.left = left;
        pathClone.right = right;
        return pathClone;
    }

    const findClosePoints = (splitPoints: string[], x: number, y: number, eraserSize: number, type: string): number[] => {
        const closePoints: number[] = [];

        switch (type) {
            case tools.line:
                const lines = groupPointsByTwo(splitPoints);
                lines.forEach(pointGroup => {
                    const polygon = pointGroupToBoundingBox(eraserSize, pointGroup);
                    const inPolygon = pointInPolygon([x, y], polygon);
                    if (inPolygon) {
                        // Find the index of the first point from the pointGroup (the line)
                        // If it's found, add it to closePoints
                        const splitPointsFoundIndex = splitPoints.indexOf(pointGroup[0]);
                        if (splitPointsFoundIndex > -1) {
                            closePoints.push(splitPointsFoundIndex);
                        }
                    }
                });
                break;
            case tools.brush:
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
                break;
        }

        // An array of indexes from splitPoints that are the close points
        return closePoints;
    }

    const eraseClosePoints = (x: number, y: number) => {
        const eraserSize = 10;
        // Get the shapes that are within the bounds of x,y

        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            const pathsWithinBounds = newPaths.filter(path => x >= path.left - eraserSize && x <= path.right + eraserSize && y >= path.top - eraserSize && y <= path.bottom + eraserSize);
            pathsWithinBounds.forEach(path => {
                const splitPoints = path.points.trim().split(' ');

                // Get close points
                const closePoints = findClosePoints(splitPoints, x, y, eraserSize, path.type);
                if (closePoints.length > 0) {
                    // Get chunks to separate the path
                    const pointChunks = splitPathIntoChunks(splitPoints, closePoints);
                    // Find the path in newPaths
                    const foundPathIndex = newPaths.findIndex(item => item.id === path.id);
                    if (foundPathIndex > -1) {
                        // Create new paths from pointChunks
                        // If the pointChunks array length = 1, it's possible the eraser is starting at the end point
                        pointChunks.forEach(points => {
                            let pathClone = clone(newPaths[foundPathIndex]);
                            pathClone = clonedPathData(pathClone, points);
                            newPaths.push(pathClone);
                        });
                        // Delete the old path
                        newPaths.splice(foundPathIndex, 1);
                    }
                    console.log({foundPathIndex, closePoints, pointChunksLength: pointChunks.length, newPathsLength: newPaths.length});
                }
            });
            //console.log(newPaths);
            return newPaths;
        });
    }

    return { eraseClosePoints }
}

export default useEraser;
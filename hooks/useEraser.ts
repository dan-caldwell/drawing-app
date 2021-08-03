import { useContext } from 'react';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';
import clone from 'clone';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import useSelection from './useSelection';

const useEraser = () => {
    const { paths, tools } = useContext(DrawingContext);
    const { getPathBoundingBox } = useSelection();

    const eraseClosePoints = (x: number, y: number) => {
        const eraserSize = 10;
        // Get the shapes that are within the bounds of x,y
        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            const pathsWithinBounds = newPaths.filter(path => x >= path.left - eraserSize && x <= path.right + eraserSize && y >= path.top - eraserSize && y <= path.bottom + eraserSize);
            pathsWithinBounds.forEach(path => {
                // If it's a line:
                // Get the bounding boxes for each line point (which should be a rectangle that goes out eraserSize and is rotated according to the line)
                if (path.type === tools.line) {
                    //console.log('line tool', new Date());
                    //console.log(path.points);
                    return;
                }


                const splitPoints = path.points.trim().split(' ');
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
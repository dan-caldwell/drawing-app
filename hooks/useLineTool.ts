import { useContext } from 'react';
import { GestureResponderEvent } from "react-native";
import clone from 'clone';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';
import { StartPoints, SvgPath } from '@types';

interface Move {
    e: GestureResponderEvent,
    paths: SvgPath[],
    x: number,
    y: number,
    startRef: React.MutableRefObject<StartPoints>,
    lineContinuationRef: React.MutableRefObject<number>
}

const useLineTool = () => {
    const { autoJoin } = useContext(DrawingContext);
    
    const lineResponderMove = (args: Move) => {
        const { paths, x, y, startRef, lineContinuationRef } = args; 
        const startX = startRef.current.x;
        const startY = startRef.current.y;
        const lineContinuation = lineContinuationRef.current;
        const newPaths = clone(paths);
        if (lineContinuation === 1) {
            newPaths[newPaths.length - 1].points = newPaths[newPaths.length - 1].points + `${x},${y} `;
            return newPaths;
        } else if (lineContinuation === 2) {
            const lastPath = newPaths[newPaths.length - 1];
            if (lastPath) {
                const lastPathSplit = lastPath.points.trim().split(' ');
    
                // Determine if the shape should be closed
                // Connect the lines if the moving line is close enough to the first line
                const firstPoints = lastPathSplit[0].split(',');
                const firstX = firstPoints[0];
                const firstY = firstPoints[1];
    
                const xDiff = Math.abs(Number(firstX) - x);
                const yDiff = Math.abs(Number(firstY) - y);
    
                if (!autoJoin.get.disabled && (xDiff < autoJoin.get.distance && yDiff < autoJoin.get.distance)) {
                    // The last point of the last path should be the first point of the last path (which closes the gap)
                    lastPathSplit[lastPathSplit.length - 1] = `${firstX},${firstY} `;
                } else {
                    // The last point of the last path should be the regular x and y values
                    lastPathSplit[lastPathSplit.length - 1] = `${x},${y} `;
                }
    
                newPaths[newPaths.length - 1].points = lastPathSplit.join(' ');
            }
            return newPaths;
        }
    
        // If the mode is single line
        newPaths[newPaths.length - 1].points = `${startX},${startY} ${x},${y} `;
        return newPaths;
    }

    const determineIfLineContinuation = (paths: SvgPath[], x: number, y: number, ref: React.MutableRefObject<number>) => {
        const lastPath = paths[paths.length - 1];
        if (lastPath && !ref.current) {
            const lastPathSplit = lastPath.points.trim().split(' ');
            const lastPoints = lastPathSplit[lastPathSplit.length - 1].split(',');
            const lastX = lastPoints[0];
            const lastY = lastPoints[1];
            
            const xDiff = Math.abs(Number(lastX) - x);
            const yDiff = Math.abs(Number(lastY) - y);
            if (xDiff < autoJoin.get.distance && yDiff < autoJoin.get.distance) {
                return 1;
            }
        }
        return 0;
    }


    return { lineResponderMove, determineIfLineContinuation }
}

export default useLineTool;
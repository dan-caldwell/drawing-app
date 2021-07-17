import { useContext } from 'react';
import { GestureResponderEvent } from "react-native";
import clone from 'clone';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';
import { SvgPath } from '@types';

interface Move {
    e: GestureResponderEvent,
    paths: SvgPath[],
    x: number,
    y: number,
    startX: number | null,
    startY: number | null,
    lineContinuation: number,
}

const useLineTool = () => {
    const { autoJoin } = useContext(DrawingContext);
    
    const lineResponderMove = (args: Move) => {
        const { paths, x, y, startX, startY, lineContinuation } = args; 
        const newPaths = clone(paths);
        if (lineContinuation === 1) {
            newPaths[newPaths.length - 1].d = newPaths[newPaths.length - 1].d + ` L${x} ${y}`;
            return newPaths;
        } else if (lineContinuation === 2) {
            const lastPath = newPaths[newPaths.length - 1];
            if (lastPath) {
                const lastPathSplit = lastPath.d.trim().split(' ');
    
                // Determine if the shape should be closed
                // Connect the lines if the moving line is close enough to the first line
                const firstX = lastPathSplit[0].replace('M', '');
                const firstY = lastPathSplit[1];
    
                const xDiff = Math.abs(Number(firstX) - x);
                const yDiff = Math.abs(Number(firstY) - y);
    
                if (!autoJoin.disabled && (xDiff < autoJoin.distance && yDiff < autoJoin.distance)) {
                    lastPathSplit[lastPathSplit.length - 2] = `L${firstX}`;
                    lastPathSplit[lastPathSplit.length - 1] = firstY;
                } else {
                    lastPathSplit[lastPathSplit.length - 2] = `L${x}`;
                    lastPathSplit[lastPathSplit.length - 1] = String(y);
                }
    
                newPaths[newPaths.length - 1].d = lastPathSplit.join(' ');
            }
            return newPaths;
            //console.log(lastPath);
        }
    
        // If the mode is single line
        newPaths[newPaths.length - 1].d = ` M${startX} ${startY} L${x} ${y}`;
        //console.log(newPaths); 
        return newPaths;
    }

    const determineIfLineContinuation = (paths: SvgPath[], x: number, y: number, ref: React.MutableRefObject<number>) => {
        const lastPath = paths[paths.length - 1];
        if (lastPath && !ref.current) {
            const lastPathSplit = lastPath.d.trim().replace(/M/g, '').replace(/L/g, '').split(' ');
            const lastX = lastPathSplit[lastPathSplit.length - 2];
            const lastY = lastPathSplit[lastPathSplit.length - 1];
            
            const xDiff = Math.abs(Number(lastX) - x);
            const yDiff = Math.abs(Number(lastY) - y);
            if (xDiff < autoJoin.distance && yDiff < autoJoin.distance) {
                return 1;
            }
        }
        return 0;
    }


    return { lineResponderMove, determineIfLineContinuation }
}

export default useLineTool;
import { GestureResponderEvent } from "react-native";
import clone from 'clone';

interface Move {
    e: GestureResponderEvent,
    paths: string[],
    x: number,
    y: number,
    startX: number | null,
    startY: number | null,
    lineContinuation: number,
}

export const lineResponderMove = (args: Move) => {
    const { paths, x, y, startX, startY, lineContinuation } = args; 
    const newPaths = clone(paths);
    if (lineContinuation === 1) {
        newPaths[newPaths.length - 1] = newPaths[newPaths.length - 1] + ` L${x} ${y}`;
        return newPaths;
    } else if (lineContinuation === 2) {
        const lastPath = newPaths[newPaths.length - 1];
        if (lastPath) {
            const lastPathSplit = lastPath.trim().split(' ');

            // Determine if the shape should be closed
            // Connect the lines if the moving line is close enough to the first line
            const firstX = lastPathSplit[0].replace('M', '');
            const firstY = lastPathSplit[1];

            const xDiff = Math.abs(Number(firstX) - x);
            const yDiff = Math.abs(Number(firstY) - y);

            if (xDiff < 20 && yDiff < 20) {
                lastPathSplit[lastPathSplit.length - 2] = `L${firstX}`;
                lastPathSplit[lastPathSplit.length - 1] = firstY;
            } else {
                lastPathSplit[lastPathSplit.length - 2] = `L${x}`;
                lastPathSplit[lastPathSplit.length - 1] = String(y);
            }

            newPaths[newPaths.length - 1] = lastPathSplit.join(' ');
        }
        return newPaths;
        //console.log(lastPath);
    }

    // If the mode is single line
    newPaths[newPaths.length - 1] = ` M${startX} ${startY} L${x} ${y}`;
    //console.log(newPaths); 
    return newPaths;
}
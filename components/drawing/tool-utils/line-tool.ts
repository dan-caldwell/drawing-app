import { GestureResponderEvent } from "react-native";
import clone from 'clone';

interface Move {
    e: GestureResponderEvent,
    paths: string[],
    x: number,
    y: number,
    startX: number | null,
    startY: number | null
}

export const lineResponderMove = (args: Move) => {
    const { paths, x, y, startX, startY } = args; 
    const newPaths = clone(paths);
    newPaths[newPaths.length - 1] = ` M${startX} ${startY} L${x} ${y}`;
    return newPaths;
}
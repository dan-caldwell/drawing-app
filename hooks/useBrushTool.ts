import { useContext } from 'react';
import { GestureResponderEvent } from "react-native";
import clone from 'clone';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';

interface Move {
    e: GestureResponderEvent,
    paths: string[],
    x: number,
    y: number
}

const useBrushTool = () => {
    const { autoJoin, setAutoJoin } = useContext(DrawingContext);

    const brushResponderMove = (args: Move) => {
        const { e, paths, x, y } = args; 
        const newPaths = clone(paths);
        const currentPath = newPaths[newPaths.length - 1];
        const separatePoints = currentPath.split('L');
    
        const sliceAt = separatePoints.length < 6 ? 0 : separatePoints.length - 5;
        const lastNPoints = separatePoints.slice(sliceAt).map((item: string) => {
            const splitPoints = item.trim().replace('M', '').split(' ');
            return [Number(splitPoints[0]), Number(splitPoints[1])];
        }).filter((item: any[]) => !isNaN(item[0]) && !isNaN(item[1]));
    
        lastNPoints.push([x, y]);
    
        let totalX: number = 0;
        let totalY: number = 0;
    
        lastNPoints.forEach((point: number[]) => {
            totalX += point[0];
            totalY += point[1];
        });
    
        let xValue: number = totalX / lastNPoints.length;
        let yValue: number = totalY / lastNPoints.length;
    
        if (isNaN(xValue)) xValue = x;
        if (isNaN(yValue)) yValue = y;
    
        // Get the first point for auto-complete
        let newX: number = xValue;
        let newY: number = yValue;
        
        if (!autoJoin.disabled) {
            const firstPoint = separatePoints[0].trim().replace('M', '').split(' ');
            if (firstPoint.length === 2 && separatePoints.length > autoJoin.distance) {
                const firstX = Number(firstPoint[0]);
                const firstY = Number(firstPoint[1]);
                if (Math.abs(xValue - firstX) < autoJoin.distance && Math.abs(yValue - firstY) < autoJoin.distance) {
                    newX = firstX;
                    newY = firstY;
                }
            }
        }
    
        newPaths[newPaths.length - 1] = currentPath + ` L${newX} ${newY}`;
        return newPaths;
    }

    return { brushResponderMove }
}

export default useBrushTool;
import { useContext } from 'react';
import { GestureResponderEvent } from "react-native";
import clone from 'clone';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';
import { SvgPath } from '@types';

interface Move {
    e: GestureResponderEvent,
    paths: SvgPath[],
    x: number,
    y: number
}

const useBrushTool = () => {
    const { autoJoin } = useContext(DrawingContext);

    const brushResponderMove = (args: Move) => {
        const { paths, x, y } = args; 
        const newPaths = clone(paths);
        const currentPath: SvgPath = newPaths[newPaths.length - 1];

        const separatePoints = currentPath.points.split(' ');
    
        const sliceAt = separatePoints.length < 6 ? 0 : separatePoints.length - 5;
        const lastNPoints = separatePoints.slice(sliceAt).map((item: string) => {
            const splitPoints = item.trim().split(',');
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
        
        if (!autoJoin.get.disabled) {
            const firstPoint = separatePoints[0].trim().split(',');
            if (firstPoint.length === 2 && separatePoints.length > autoJoin.get.distance) {
                const firstX = Number(firstPoint[0]);
                const firstY = Number(firstPoint[1]);
                if (Math.abs(xValue - firstX) < autoJoin.get.distance && Math.abs(yValue - firstY) < autoJoin.get.distance) {
                    newX = firstX;
                    newY = firstY;
                }
            }
        }
    
        newPaths[newPaths.length - 1].points = currentPath.points + `${newX},${newY} `;
        return newPaths;
    }

    return { brushResponderMove }
}

export default useBrushTool;
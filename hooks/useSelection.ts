import { DrawingContext } from "drawing-app/components/context/DrawingContext";
import { useContext } from "react";
import clone from 'clone';


const useSelection = () => {
    const { setPaths } = useContext(DrawingContext);

    const setCurrentPathBoundaries = () => {
        setPaths(oldPaths => {
            const newPaths = clone(oldPaths);
            const currentPath = newPaths[newPaths.length - 1];
            // Find the top, bottom, left, and right values of the path
            const pathValues = currentPath.points.trim().split(' ');
            let right: number, bottom: number, left: number, top: number;
            right = bottom = left = top = 0;

            pathValues.forEach((value, index) => {
                const splitXY = value.split(',');
                const numX = Number(splitXY[0]);
                const numY = Number(splitXY[1]);
                if (numX === 0 || numY === 0 || isNaN(numX) || isNaN(numY)) return;
                if (index === 0) {
                    left = right = numX;
                    top = bottom = numY;
                } else {
                    if (numX > right) right = numX;
                    if (numX < left) left = numX;
                    if (numY > bottom) bottom = numY;
                    if (numY < top) top = numY;
                }
            });
            currentPath.left = left;
            currentPath.right = right;
            currentPath.bottom = bottom;
            currentPath.top = top;
            return newPaths;
        });
    }

    return { setCurrentPathBoundaries };

}

export default useSelection;
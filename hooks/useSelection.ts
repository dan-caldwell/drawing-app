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
            const pathDValues = currentPath.d.replace(/M/g, '').replace(/L/g, '').trim().split(' ');
            let right: number, bottom: number, left: number, top: number;
            right = bottom = left = top = 0;
            pathDValues.forEach((value, index) => {
                const numVal = Number(value);
                if (index === 0) {
                    // Start X value
                    left = right = numVal;  
                } else if (index === 1) {
                    // Start Y value
                    top = bottom = numVal;
                } else if (index % 2 === 0) {
                    // X value
                    if (numVal > right) right = numVal;
                    if (numVal < left) left = numVal;
                } else {
                    // Y value
                    if (numVal > bottom) bottom = numVal;
                    if (numVal < top) top = numVal;
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
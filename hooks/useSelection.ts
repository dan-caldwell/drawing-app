import { DrawingContext } from "drawing-app/components/context/DrawingContext";
import { useContext } from "react";
import clone from 'clone';


const useSelection = () => {
    const { setPaths, setSelectedPath, selectedPath } = useContext(DrawingContext);

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

    const updateSelectionAfterRelease = () => {
        if (!selectedPath) return;
        // If the selected path has been translated, update the values of the selected object to the translation
        setPaths(oldPaths => {
            const newPaths = clone(oldPaths);
            const selected = newPaths.find(item => item.id === selectedPath.id);
            if (!selected) return newPaths;
            const splitPoints = selected.points.trim().split(' ');
            let newPointsString = "";
            // Add the transform amount to each X and Y point on the selected polyline
            splitPoints.forEach(points => {
                const pointsXY = points.split(',');
                const xVal = Number(pointsXY[0]) + selected.translateX;
                const yVal = Number(pointsXY[1]) + selected.translateY;
                newPointsString += `${xVal},${yVal} `;
            });
            selected.points = newPointsString;
            
            // Adjust the top/left/right/bottom values
            selected.top = selected.top + selected.translateY;
            selected.bottom = selected.bottom + selected.translateY;
            selected.left = selected.left + selected.translateX;
            selected.right = selected.right + selected.translateX;
            // Reset the translation
            selected.translateX = 0;
            selected.translateY = 0;

            setSelectedPath(selected);
            return newPaths;
        });
    }

    return { setCurrentPathBoundaries, updateSelectionAfterRelease };

}

export default useSelection;
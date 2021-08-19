import { DrawingContext } from "drawing-app/components/context/DrawingContext";
import { useContext } from "react";
import clone from 'clone';
import { CanvasPoint } from "drawing-app/types";
import useHistoryChange from "./useHistoryChange";

const useSelection = () => {
    const { paths, selectedPath } = useContext(DrawingContext);
    const { alterPathsHistoryAfterRelease } = useHistoryChange();

    const translateSelection = (startRef: React.MutableRefObject<CanvasPoint>, x: number, y: number) => {
        if (!selectedPath.get) return;
        // There is a selected path, so translate the path
        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            const selected = newPaths.find(item => item.id === selectedPath.get?.id);
            if (!selected || !startRef.current.x || !startRef.current.y) return newPaths;
            selected.translateX = x - startRef.current.x;
            selected.translateY = y - startRef.current.y;
            selectedPath.set(selected);
            return newPaths;
        });
    }

    const getPathBoundingBox = (path: string) => {
        // Find the top, bottom, left, and right values of the path
        const pathValues = path.trim().split(' ');
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
        return { top, bottom, left, right }
    }

    const setCurrentPathBoundaries = () => {
        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            const currentPath = newPaths[newPaths.length - 1];
            const { top, bottom, left, right } = getPathBoundingBox(currentPath.points);
            currentPath.left = left;
            currentPath.right = right;
            currentPath.bottom = bottom;
            currentPath.top = top;
            return newPaths;
        });
    }

    const updateSelectionTranslateAfterRelease = () => {
        if (!selectedPath.get) return;
        // If the selected path has been translated, update the values of the selected object to the translation
        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            const selected = newPaths.find(item => item.id === selectedPath.get?.id);
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

            selectedPath.set(selected);
            return newPaths;
        });
    }

    const radians = (degrees: number) => degrees * (Math.PI / 180);
    const degrees = (radians: number) => radians * (180 / Math.PI);

    const getTranslatedPoints = (x: number, y: number, rotation: number, originX: number, originY: number) => {
        return {
            x: (((x - originX) * Math.cos(rotation)) - ((y - originY) * Math.sin(rotation))) + originX,
            y: (((x - originX) * Math.sin(rotation)) + ((y - originY) * Math.cos(rotation))) + originY
        }
    }

    const rotateSelection = (x: number, y: number, startRef: React.MutableRefObject<CanvasPoint>) => {
        if (!selectedPath.get) return;
            // There is a selected path, so rotate the path
            paths.set(oldPaths => {
                const newPaths = clone(oldPaths);
                const selected = newPaths.find(item => item.id === selectedPath.get?.id);
                if (!selected || !startRef.current.x || !startRef.current.y) return newPaths;
                // Get the origin point
                const originX = selected.left + ((selected.right - selected.left) / 2);
                const originY = selected.top + ((selected.bottom - selected.top) / 2);
                // Get the angle from the current x,y pointer values
                const angle = Math.atan2(y - originY, x - originX);
                // Get the angle from the start pointer values
                const startAngle = Math.atan2(startRef.current.y - originY, startRef.current.x - originX);
                // Get difference between angles, then convert to degrees
                selected.rotation = degrees(angle - startAngle);
                selectedPath.set(selected);
                return newPaths;
            });
    }

    const updateSelectionRotateAfterRelease = () => {
        if (!selectedPath.get) return;
        const rotation = radians(selectedPath.get.rotation);
        const originX = selectedPath.get.left + ((selectedPath.get.right - selectedPath.get.left) / 2);
        const originY = selectedPath.get.top + ((selectedPath.get.bottom - selectedPath.get.top) / 2);
        // There is a selected path, so translate the points to the new location of the rotation transformation
        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            const selected = newPaths.find(item => item.id === selectedPath.get?.id);
            if (!selected) return newPaths;
            const splitPoints = selected.points.trim().split(' ');
            let newPointsString = "";
            // Add the transform amount to each X and Y point on the selected polyline
            splitPoints.forEach(points => {
                const pointsXY = points.split(',');
                const xVal = Number(pointsXY[0]);
                const yVal = Number(pointsXY[1]);
                const newPoints = getTranslatedPoints(xVal, yVal, rotation, originX, originY);
                newPointsString += `${newPoints.x},${newPoints.y} `;
            });
            selected.points = newPointsString;
            const { top, bottom, left, right } = getPathBoundingBox(selected.points);
            
            // Adjust the top/left/right/bottom values
            selected.top = top;
            selected.bottom = bottom;
            selected.left = left;
            selected.right = right;
            
            // Reset the rotation
            selected.rotation = 0;

            selectedPath.set(selected);
            return newPaths;
        });
    }
    
    // Determine if selection is outside of the selected rectangle area
    const selectedOutside = (x: number, y: number) => {
        if (!selectedPath.get) return false;
        return !(x >= selectedPath.get.left && x <= selectedPath.get.right && y >= selectedPath.get.top && y <= selectedPath.get.bottom);
    }

    const deletePath = () => {
        if (!selectedPath.get) return;
        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            const foundSelectedPathIndex = newPaths.findIndex(item => item.id === selectedPath.get?.id);
            if (foundSelectedPathIndex > -1) newPaths.splice(foundSelectedPathIndex, 1);
            alterPathsHistoryAfterRelease(oldPaths, newPaths);
            return newPaths;
        });
        selectedPath.set(null);
    }

    return { 
        setCurrentPathBoundaries, 
        updateSelectionTranslateAfterRelease, 
        updateSelectionRotateAfterRelease, 
        rotateSelection,
        translateSelection,
        selectedOutside,
        getPathBoundingBox,
        deletePath
    };

}

export default useSelection;
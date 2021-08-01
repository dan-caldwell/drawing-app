import { DrawingContext } from "drawing-app/components/context/DrawingContext";
import { useContext } from "react";
import clone from 'clone';
import { CanvasPoint } from "drawing-app/types";

const useSelection = () => {
    const { paths, selectedPath } = useContext(DrawingContext);

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

    const degreesInRadians = (rotation: number) => {
        return rotation * (Math.PI / 180);
    }

    const getTranslatedPoints = (x: number, y: number, rotation: number, originX: number, originY: number) => {
        return {
            x: (((x - originX) * Math.cos(rotation)) - ((y - originY) * Math.sin(rotation))) + originX,
            y: (((x - originX) * Math.sin(rotation)) + ((y - originY) * Math.cos(rotation))) + originY
        }
    }

    // Will calculate the correct rotation angle given two points
    // Used for rotating the selection around the center point of a shape
    const getRotationAngle = (p0: CanvasPoint, p1: CanvasPoint, centerPoint: CanvasPoint) => {
        if (!p0.x || !p0.y || !p1.x || !p1.y || !centerPoint.x || !centerPoint.y) return 0;
        var p0c = Math.sqrt(Math.pow(centerPoint.x-p0.x,2)+
                            Math.pow(centerPoint.y-p0.y,2)); // p0->centerPoint (b)   
        var p1c = Math.sqrt(Math.pow(centerPoint.x-p1.x,2)+
                            Math.pow(centerPoint.y-p1.y,2)); // p1->centerPoint (a)
        var p0p1 = Math.sqrt(Math.pow(p1.x-p0.x,2)+
                             Math.pow(p1.y-p0.y,2)); // p0->p1 (centerPoint)
        return Math.acos((p1c * p1c + p0c * p0c - p0p1 * p0p1)/(2 * p1c * p0c));
    }

    const rotateSelection = (x: number, y: number, startRef: React.MutableRefObject<CanvasPoint>) => {
        if (!selectedPath.get) return;
            // There is a selected path, so rotate the path
            paths.set(oldPaths => {
                const newPaths = clone(oldPaths);
                const selected = newPaths.find(item => item.id === selectedPath.get?.id);
                if (!selected || !startRef.current.x || !startRef.current.y) return newPaths;
                const originX = selected.left + ((selected.right - selected.left) / 2);
                const originY = selected.top + ((selected.bottom - selected.top) / 2);
                const p0 = {x, y};
                const p1 = {x: startRef.current.x, y: startRef.current.y};
                const c = {x: originX, y: originY};
                const rotation = getRotationAngle(p0, p1, c);
                selected.rotation = selected.rotation + rotation;
                // Problems
                // Rotation speed
                // There is rotation acceleration when the rotation should really be linear
                // Does not rotate based on where x,y is -> it will always rotate in one direction since the new rotation is being added to the old rotation
                selectedPath.set(selected);
                return newPaths;
            });
    }

    const updateSelectionRotateAfterRelease = () => {
        if (!selectedPath.get) return;
        const rotation = degreesInRadians(selectedPath.get.rotation);
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

    return { 
        setCurrentPathBoundaries, 
        updateSelectionTranslateAfterRelease, 
        updateSelectionRotateAfterRelease, 
        rotateSelection,
        translateSelection
    };

}

export default useSelection;
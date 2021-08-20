import { useContext } from 'react';
import { AlteredPaths, SvgPath } from "@types";
import { DrawingContext } from "drawing-app/components/context/DrawingContext";
import clone from 'clone';

const useHistoryChange = () => {
    const { pathsHistory, paths, selectedPath } = useContext(DrawingContext);

    // After responder release, this function is ran to find what paths have been altered/added/removed
    const findAlteredPaths = (newPaths: SvgPath[], oldPaths: SvgPath[]) => {
        // The alteredPaths array is most likely only ever going to have a length of 1, as this function gets ran every time
        // A touch ends on the DrawingCanvas
        let alteredPaths: AlteredPaths[] = [];
        // Get the added and removed paths
        const addedPaths: AlteredPaths[] = newPaths.filter(path => !oldPaths.find(item => item.id === path.id)).map(path => ({
            oldPath: path,
            newPath: path,
            alteredType: 'added'
        }));
        const removedPaths: AlteredPaths[] = oldPaths.filter(path => !newPaths.find(item => item.id === path.id)).map(path => ({
            oldPath: path,
            newPath: path,
            alteredType: 'removed'
        }));

        // Add the added and removed paths to the alteredPaths array
        alteredPaths = alteredPaths.concat(addedPaths, removedPaths);

        // To equality check between old and new paths, first stringify each object to do an initial equality check
        // To prevent every single property inside of each path from being checked
        const newPathsFlat = newPaths.map(path => ({
            string: JSON.stringify(path),
            path
        }));
        const oldPathsFlat = oldPaths.map(path => ({
            string: JSON.stringify(path),
            path
        }));

        newPathsFlat.forEach(pathObj => {
            const foundInOldPaths = oldPathsFlat.find(oldPathObj => pathObj.path.id === oldPathObj.path.id);
            if (foundInOldPaths && pathObj.string !== foundInOldPaths.string) {
                // The altered path has been found, so add it to the alteredPaths array
                alteredPaths.push({
                    oldPath: foundInOldPaths.path,
                    newPath: pathObj.path,
                    alteredType: 'altered'
                });
            }
        });

        // Used for debugging
        //console.log({addedPaths: addedPaths.length, removedPaths: removedPaths.length, alteredPaths: alternatePathsNum});

        return alteredPaths;
    }

    // Set the paths history after the responder release (used on DrawingCanvas in useEffect)
    const alterPathsHistoryAfterRelease = (startPaths: SvgPath[], currentPaths: SvgPath[] = paths.get) => {
        if (!startPaths) return;
        const alteredPaths = findAlteredPaths(currentPaths || paths.get, startPaths);
        pathsHistory.set(oldHistory => {
            const newHistory = clone(oldHistory);
            // Add the altered paths to the pathsHistory array
            newHistory.unshift(alteredPaths);

            // Return the last 20 changes
            return newHistory.slice(0, 19);
        });
    }

    // Remove a path from newPaths
    const removePath = (newPaths: SvgPath[], historyTarget: AlteredPaths) => {
        let pathsHasChanged = false;
        const foundHistoryTargetIndex = newPaths.findIndex(path => path.id === historyTarget.newPath.id);
        if (foundHistoryTargetIndex > -1) {
            newPaths.splice(foundHistoryTargetIndex, 1);
            pathsHasChanged = true;
        }
        return pathsHasChanged;
    }

    // Add a path to newPaths
    const addPath = (newPaths: SvgPath[], historyTarget: AlteredPaths) => {
        let pathsHasChanged = false;
        // Check to make sure the historyTarget isn't already in newPaths
        const foundInNewPaths = newPaths.find(item => item.id === historyTarget.newPath.id);
        // Add the historyTarget
        if (!foundInNewPaths) {
            newPaths.push(historyTarget.newPath);
            pathsHasChanged = true;
        }
        return pathsHasChanged;
    }

    // Alter a path in newPaths
    const alterPath = (newPaths: SvgPath[], historyTarget: AlteredPaths, changeType: 'undo' | 'redo') => {
        let pathsHasChanged = false;
        const targetPathIndex = newPaths.findIndex(path => path.id === historyTarget.newPath.id && historyTarget.alteredType === 'altered');
        if (targetPathIndex > -1) {
            // For altering a path, use newPath to redo, oldPath to undo
            newPaths[targetPathIndex] = changeType === 'redo' ? historyTarget.newPath : historyTarget.oldPath;
            selectedPath.set(newPaths[targetPathIndex]);
            pathsHasChanged = true;
        }
        return pathsHasChanged;
    }

    const handleHistoryChange = (changeType: 'undo' | 'redo') => {

        // Set the paths based on the change
        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            const historyTargets: AlteredPaths[] = changeType === 'undo' ? pathsHistory.get[0] : pathsHistory.get[pathsHistory.get.length - 1];

            // Test whether the paths array has changed
            // This is used to determine if the pathsHistory array should be set
            let pathsHasChanged: boolean = false;

            historyTargets.forEach(historyTarget => {

                let pathsHasChangedIndividual: boolean = false;
                
                if (!historyTarget) return newPaths;
                
                const targetAlteredType = historyTarget.alteredType;

                switch (changeType) {
                    case 'undo':
                        switch (targetAlteredType) {
                            case 'added':
                                // Remove the added path
                                pathsHasChangedIndividual = removePath(newPaths, historyTarget);
                                break;
                            case 'removed':
                                // Add the removed path
                                pathsHasChangedIndividual = addPath(newPaths, historyTarget);
                                break;
                            case 'altered':
                                // Set the altered paths
                                pathsHasChangedIndividual = alterPath(newPaths, historyTarget, changeType);
                                break;
                        }
                        break;
                    case 'redo':
                        switch (targetAlteredType) {
                            case 'added':
                                // Add the added path
                                pathsHasChangedIndividual = addPath(newPaths, historyTarget);
                                break;
                            case 'removed':
                                // Remove the removed path
                                pathsHasChangedIndividual = removePath(newPaths, historyTarget);
                                break;
                            case 'altered':
                                // Set the altered paths
                                pathsHasChangedIndividual = alterPath(newPaths, historyTarget, changeType);
                                break;
                        }
                        break;
                }
                // This is meant to keep pathsHasChanged from changing back to false if it was previously set to true
                if (pathsHasChangedIndividual) pathsHasChanged = true;
            });


            adjustPathsHistoryAfterPress(pathsHasChanged, changeType);

            // Check if selected path still exists
            // If it doesn't, deselect the selected path
            if (selectedPath.get) {
                const selectedPathExists = newPaths.find(item => selectedPath.get && item.id === selectedPath.get.id);
                if (!selectedPathExists) selectedPath.set(null);
            } 

            return newPaths;
        });

    }

    const adjustPathsHistoryAfterPress = (pathsChanged: boolean, changeType: 'undo' | 'redo') => {
        // If the paths array has not been changed, end the function and don't set the pathsHistory array
        if (!pathsChanged) return;

        pathsHistory.set(oldHistory => {
            const newHistory = clone(oldHistory);

            switch (changeType) {
                case 'undo':
                    // Move the first item of the pathsHistory array to the end
                    newHistory.splice(newHistory.length - 1, 0, newHistory.splice(0, 1)[0]);
                    break;
                case 'redo':
                    // Move the last item of the pathsHistory array to the beginning
                    newHistory.splice(0, 0, newHistory.splice(newHistory.length - 1, 1)[0]);
                    break;
            }

            // Used for debugging
            // console.log(newHistory.map(altered => {
            //     return altered.map(paths => {
            //         return {newPathId: paths.newPath.id, oldPathsId: paths.oldPath.id, alteredType: paths.alteredType}
            //     })
            // }));

            return newHistory;
        });
    } 

    return { findAlteredPaths, alterPathsHistoryAfterRelease, adjustPathsHistoryAfterPress, handleHistoryChange }
}

export default useHistoryChange;
import React, { useContext} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import ToolButton from '../components/tools/ToolButton';
import { DrawingContext } from '../components/context/DrawingContext';
import ToolNavMenu from './nav-menus/ToolNavMenu';
import DrawingSettingsNavMenu from './nav-menus/DrawingSettingsNavMenu';
import clone from 'clone';
import { AlteredPaths } from 'drawing-app/types';

const ICON_MARGIN: number = 10;

const ToolNavbar: React.FC = () => {
    const { paths, resetOpenSubmenu, openSubmenu, activeTool, selectedPath, tools, pathsHistory } = useContext(DrawingContext);

    const handlePress = (e: GestureResponderEvent) => {
        if (openSubmenu.get.open) resetOpenSubmenu();
    }

    const handleResetDrawingCanvas = () => {
        paths.set([]);
        selectedPath.set(null);
        pathsHistory.set([]);
    }

    const handleToolPress = (tool: string) => {
        if (activeTool.get !== tool) activeTool.set(tool);
        if (openSubmenu.get.open && openSubmenu.get.target !== tool) resetOpenSubmenu();
    }

    const handleHistoryChange = (changeType: 'undo' | 'redo') => {


        // Set the paths based on the change
        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            const historyTarget: AlteredPaths = changeType === 'undo' ? pathsHistory.get[0] : pathsHistory.get[pathsHistory.get.length - 1];

            // Test whether the paths array has changed
            // This is used to determine if the pathsHistory array should be set
            let pathsHasChanged: boolean = false;
            
            if (!historyTarget) return newPaths;
            
            const targetAlteredType = historyTarget.alteredType;

            switch (changeType) {
                case 'undo':
                    switch (targetAlteredType) {
                        case 'added':
                            // Remove the added path
                            const foundHistoryTargetIndex = newPaths.findIndex(path => path.id === historyTarget.newPath.id);
                            if (foundHistoryTargetIndex > -1) {
                                newPaths.splice(foundHistoryTargetIndex, 1);
                                pathsHasChanged = true;
                            }
                            break;
                        case 'removed':
                            // Check to make sure the historyTarget isn't already in newPaths
                            const foundInNewPaths = newPaths.find(item => item.id === historyTarget.newPath.id);
                            // Add the removed paths
                            if (!foundInNewPaths) {
                                newPaths.push(historyTarget.newPath);
                                pathsHasChanged = true;
                            }
                            break;
                        case 'altered':
                            // Set the altered paths
                            const targetPathIndex = newPaths.findIndex(path => path.id === historyTarget.newPath.id && historyTarget.alteredType === 'altered');
                            if (targetPathIndex > -1) {
                                newPaths[targetPathIndex] = historyTarget.oldPath;
                                selectedPath.set(newPaths[targetPathIndex]);
                                pathsHasChanged = true;
                            }
                            break;
                    }
                    break;
                case 'redo':
                    switch (targetAlteredType) {
                        case 'added':
                            // Check to make sure the historyTarget isn't already in newPaths
                            const foundInNewPaths = newPaths.find(item => item.id === historyTarget.newPath.id);
                            // Add the added path
                            if (!foundInNewPaths) {
                                newPaths.push(historyTarget.newPath);
                                pathsHasChanged = true;
                            }
                            break;
                        case 'removed':
                            // Remove the removed path
                            const foundHistoryTargetIndex = newPaths.findIndex(path => path.id === historyTarget.newPath.id);
                            if (foundHistoryTargetIndex > -1) {
                                newPaths.splice(foundHistoryTargetIndex, 1);
                                pathsHasChanged = true;
                            }
                            break;
                        case 'altered':
                            // Set the altered paths
                            const targetPathIndex = newPaths.findIndex(path => path.id === historyTarget.newPath.id && historyTarget.alteredType === 'altered');
                            if (targetPathIndex > -1) {
                                newPaths[targetPathIndex] = historyTarget.oldPath;
                                selectedPath.set(newPaths[targetPathIndex]);
                                pathsHasChanged = true;
                            }
                            break;
                    }
                    break;
            }

            console.log({pathsHasChanged});
            adjustPathsHistory(pathsHasChanged, changeType);

            return newPaths;
        });


    }

    const adjustPathsHistory = (pathsChanged: boolean, changeType: 'undo' | 'redo') => {
        // If the paths array has not been changed, end the function and don't set the pathsHistory array
        if (!pathsChanged) return;
        switch (changeType) {
            case 'undo':
                // Move the first item of the pathsHistory array to the end
                pathsHistory.set(oldHistory => {
                    const newHistory = clone(oldHistory);
                    newHistory.splice(newHistory.length - 1, 0, newHistory.splice(0, 1)[0]);
                    return newHistory;
                });
                break;
            case 'redo':
                // Move the last item of the pathsHistory array to the beginning
                pathsHistory.set(oldHistory => {
                    const newHistory = clone(oldHistory);
                    newHistory.splice(0, 0, newHistory.splice(newHistory.length - 1, 1)[0]);
                    return newHistory;
                });
                break;
        }
    } 

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.container}>
                <ToolButton
                    onPress={() => handleToolPress(tools.move)}
                    icon={tools.move}
                    active={activeTool.get === tools.move}
                />
                <ToolButton 
                    onPress={() => handleToolPress(tools.select)}
                    icon={tools.select}
                    active={activeTool.get === tools.select}
                />
                <ToolNavMenu />
                <ToolButton 
                    active={false} 
                    onPress={handleResetDrawingCanvas} 
                    icon={tools.reset}
                />
                <ToolButton 
                    active={false} 
                    onPress={() => handleHistoryChange('undo')} 
                    icon={tools.undo}
                />
                <ToolButton
                    active={false}
                    onPress={() => handleHistoryChange('redo')}
                    icon={tools.redo}
                />
                <DrawingSettingsNavMenu />
            </View>
        </TouchableWithoutFeedback>
    )
}

export default ToolNavbar;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        justifyContent: 'center',
    },
    toolSubmenu: {
        position: 'absolute',
        bottom: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: ICON_MARGIN,
        marginBottom: ICON_MARGIN,
        padding: ICON_MARGIN,
    },
});
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
    }

    const handleToolPress = (tool: string) => {
        if (activeTool.get !== tool) activeTool.set(tool);
        if (openSubmenu.get.open && openSubmenu.get.target !== tool) resetOpenSubmenu();
    }

    const handleUndo = () => {
        paths.set(oldPaths => {
            let newPaths = clone(oldPaths);
            const historyTarget: AlteredPaths = pathsHistory.get[0];

            if (!historyTarget) return newPaths;

            const targetAlteredType = historyTarget.alteredType;

            switch (targetAlteredType) {
                case 'added':
                    // Set the altered paths
                    const targetPathIndex = newPaths.findIndex(path => path.id === historyTarget.newPath.id && historyTarget.alteredType === 'altered');
                    if (targetPathIndex > -1) {
                        newPaths[targetPathIndex] = historyTarget.oldPath;
                        selectedPath.set(newPaths[targetPathIndex]);
                    }
                    break;
                case 'removed':
                    break;
                case 'altered':
                    break;
            }

            // TODO
            // Add removed paths, and remove added paths
            // The code below works but is commented out to prevent errors

            // // Add the removed paths
            // const removedPaths = pathsHistory.get.filter(path => path.alteredType === 'removed');

            // newPaths.forEach((path, index) => {
            //     const foundInRemovedPaths = removedPaths.find(removed => removed.newPath.id === path.id);
            //     if (foundInRemovedPaths) {
            //         newPaths.splice(index, 1);
            //     }
            // });

            // // Remove the new paths
            // const addedPaths = pathsHistory.get.filter(path => path.alteredType === 'added').map(path => path.newPath);
            // newPaths = newPaths.concat(addedPaths);

            // console.log({removedPaths, addedPaths});

            return newPaths;
        });
        console.log('undo');
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
                    onPress={handleUndo} 
                    icon={tools.undo}
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
import React, { useContext} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import ToolButton from '../components/tools/ToolButton';
import { DrawingContext } from '../components/context/DrawingContext';
import ToolNavMenu from './nav-menus/ToolNavMenu';
import DrawingSettingsNavMenu from './nav-menus/DrawingSettingsNavMenu';

const ICON_MARGIN: number = 10;

const ToolNavbar: React.FC = () => {
    const { paths, resetOpenSubmenu, openSubmenu, activeTool, activeDrawTool, selectedPath, tools } = useContext(DrawingContext);

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
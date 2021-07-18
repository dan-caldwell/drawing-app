import React, { useContext} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import ToolButton from '../components/tools/ToolButton';
import { DrawingContext } from '../components/context/DrawingContext';
import ToolNavMenu from './nav-menus/ToolNavMenu';
import DrawingSettingsNavMenu from './nav-menus/DrawingSettingsNavMenu';

const ICON_MARGIN: number = 10;

const ToolNavbar: React.FC = () => {
    const { setPaths, drawing, setDrawing, resetOpenSubmenu, openSubmenu, activeTool, setActiveTool, setSelectedPath } = useContext(DrawingContext);

    const handlePress = (e: GestureResponderEvent) => {
        if (openSubmenu.open) {
            resetOpenSubmenu();
        }
    }

    const handleSelectionToolPress = (e: GestureResponderEvent) => {
        setActiveTool(activeTool === 'cursor-default' ? 'brush' : 'cursor-default');
    }

    const handleResetDrawingCanvas = () => {
        setPaths([]);
        setSelectedPath(null);
    }

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.container}>
                <ToolButton 
                    onPress={handleSelectionToolPress}
                    icon={"cursor-default"}
                />
                <ToolButton
                    onPress={() => setDrawing(!drawing)}
                    icon={drawing ? "pencil" : "cursor-move"}
                />
                <ToolNavMenu />
                <ToolButton 
                    active={false} 
                    onPress={handleResetDrawingCanvas} 
                    icon="backup-restore"
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
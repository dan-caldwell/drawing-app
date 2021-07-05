import React, { useContext} from 'react';
import { View, StyleSheet, GestureResponderEvent, Dimensions } from 'react-native';
import ToolButton from '../components/tools/ToolButton';
import { DrawingContext } from '../components/context/DrawingContext';
import ActionNavMenu from './nav-menus/ActionNavMenu';
import ToolNavMenu from './nav-menus/ToolNavMenu';

const ICON_MARGIN: number = 10;

const ToolNavbar: React.FC = () => {
    const { setPaths, drawing, setDrawing } = useContext(DrawingContext);

    return (
        <View style={styles.container}>
            <ToolButton
                onPress={() => setDrawing(!drawing)}
                icon={drawing ? "pencil" : "cursor-move"}
            />
            <ToolNavMenu />
            <ToolButton 
                active={false} 
                onPress={() => setPaths([])} 
                icon="backup-restore"
            />
        </View>
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
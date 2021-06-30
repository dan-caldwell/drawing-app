import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import ToolButton from '../components/tools/ToolButton';
import { DrawingContext } from '../components/context/DrawingContext';

const ToolNavbar: React.FC = () => {
    const { setActiveTool, setPaths, setDrawing } = useContext(DrawingContext);
    return (
        <View style={styles.container}>
            <ToolButton text="Draw" onPress={() => setDrawing(true)} />
            <ToolButton text="Move" onPress={() => setDrawing(false)} />
            <ToolButton text="Brush Tool" onPress={() => setActiveTool('brush')} />
            <ToolButton text="Line Tool" onPress={() => setActiveTool('line')} />
            <ToolButton text="Reset" onPress={() => setPaths([])} />
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
        justifyContent: 'center'
    }
});
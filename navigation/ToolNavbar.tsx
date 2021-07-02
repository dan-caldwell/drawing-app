import React, { useContext } from 'react';
import { View, StyleSheet, GestureResponderEvent } from 'react-native';
import ToolButton from '../components/tools/ToolButton';
import { DrawingContext } from '../components/context/DrawingContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ToolNavbar: React.FC = () => {
    const { activeTool, setActiveTool, setPaths, drawing, setDrawing } = useContext(DrawingContext);

    const handlePressCallback = (e: GestureResponderEvent, measurement: object) => {
        console.log(measurement);
    }

    return (
        <View style={styles.container}>
            <View style={styles.toolSubmenu}>
                <ToolButton 
                    style={styles.submenuButton} 
                    active={false} 
                    onPress={() => {}} 
                    text="Draw"
                    icon={<MaterialCommunityIcons name="pencil" size={24} color="black"/>} />
                <ToolButton 
                    style={[styles.submenuButton, styles.lastSubmenuButton]} 
                    active={false} onPress={() => {}} 
                    text="Move"
                    icon={<MaterialCommunityIcons name="cursor-move" size={24} color="black" />}
                />
            </View>
            <ToolButton 
                active={drawing} 
                onPress={handlePressCallback}
                icon={<MaterialCommunityIcons name="cursor-move" size={24} color="black" />}
            />
            <ToolButton 
                active={!drawing} 
                onPress={() => setDrawing(false)}
                icon={<MaterialCommunityIcons name="pencil" size={24} color="black"/>}
            />
            <ToolButton 
                active={activeTool === 'brush'} 
                onPress={() => setActiveTool('brush')} 
                icon={<MaterialCommunityIcons name="brush" size={24} color="black" />}
            />
            <ToolButton 
                active={activeTool === 'line'} 
                onPress={() => setActiveTool('line')}
                icon={<MaterialCommunityIcons name="vector-line" size={24} color="black" />}
            />
            <ToolButton 
                active={false} 
                onPress={() => setPaths([])} 
                icon={<MaterialCommunityIcons name="backup-restore" size={24} color="black" />}
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
        position: 'relative',
    },
    toolSubmenu: {
        position: 'absolute',
        bottom: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        margin: 10,
        padding: 10,
    },
    submenuButton: {
        margin: 0,
        marginVertical: 0,
        marginHorizontal: 0,
        marginBottom: 10,
    },
    lastSubmenuButton: {
        marginBottom: 0
    }
});
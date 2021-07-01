import React, { useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import ToolButton from '../components/tools/ToolButton';
import { DrawingContext } from '../components/context/DrawingContext';
import ToolSubmenu from '../components/tools/ToolSubmenu';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const ToolNavbar: React.FC = () => {
    const { activeTool, setActiveTool, setPaths, drawing, setDrawing } = useContext(DrawingContext);
    return (
        <View style={styles.container}>
            <ToolSubmenu>
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
            </ToolSubmenu>
            <ToolButton 
                active={drawing} 
                onPress={() => setDrawing(true)}
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
import React, { useContext, useRef } from 'react';
import { View, StyleSheet, GestureResponderEvent, Dimensions } from 'react-native';
import ToolButton from '../components/tools/ToolButton';
import { DrawingContext } from '../components/context/DrawingContext';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { Measurement } from '@types';
import { measureComponent } from 'drawing-app/utils';

const { width: windowWidth, height: windowHeight } = Dimensions.get('window');

const ICON_MARGIN: number = 10;

const ToolNavbar: React.FC = () => {
    const { activeTool, setActiveTool, setPaths, drawing, setDrawing, openSubmenu, setOpenSubmenu } = useContext(DrawingContext);
    const submenuRef = useRef<View>(null);

    const handlePressCallback = async (e: GestureResponderEvent, measurement: Measurement, target: string) => {
        if (!submenuRef.current) return;
        if (openSubmenu.open && openSubmenu.target === target) {
            setOpenSubmenu({
                open: false,
                left: 0,
                bottom: 0,
                target: null
            });
            return;
        }
        const submenuMeasurement = await measureComponent(submenuRef.current);
        const submenuWidth = submenuMeasurement.width / 2;
        let leftValue = measurement.x + (measurement.width / 2) - submenuWidth;
        if (leftValue < 0) leftValue = ICON_MARGIN;
        if (leftValue > windowWidth) leftValue = windowWidth;
        setOpenSubmenu({
            open: true,
            left: leftValue,
            bottom: measurement.y + measurement.height,
            target
        });
    }

    return (
        <View style={styles.container}>
            <View ref={submenuRef} style={[styles.toolSubmenu, { left: openSubmenu.left, bottom: openSubmenu.bottom, display: openSubmenu.open ? "flex" : "none" }]}>
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
                onPress={(e, measurement) => { setDrawing(false); handlePressCallback(e, measurement, 'cursor-move')}}
                icon={<MaterialCommunityIcons name="cursor-move" size={24} color="black" />}
            />
            <ToolButton 
                active={!drawing} 
                onPress={(e, measurement) => { setDrawing(true); handlePressCallback(e, measurement, 'pencil') }}
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
        borderRadius: ICON_MARGIN,
        marginBottom: ICON_MARGIN,
        padding: ICON_MARGIN,
    },
    submenuButton: {
        margin: 0,
        marginVertical: 0,
        marginHorizontal: 0,
        marginBottom: ICON_MARGIN,
    },
    lastSubmenuButton: {
        marginBottom: 0
    }
});
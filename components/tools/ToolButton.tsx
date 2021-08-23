import React, { useContext, useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, LayoutChangeEvent, GestureResponderEvent } from "react-native";
import { Measurement } from '@types';
import { measureComponent } from 'drawing-app/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ICON_MARGIN } from 'drawing-app/constants/Layout';
import { DrawingContext } from '../context/DrawingContext';

interface Props {
    text?: string,
    onPress?: (e: GestureResponderEvent, measurement: Measurement, icon: string, submenuPosition: string) => void,
    onLongPress?: (e: GestureResponderEvent, measurement: Measurement, icon: string, submenuPosition: string) => void,
    active?: boolean,
    children?: JSX.Element | React.FC,
    style?: object[] | object,
    icon?: any,
    openSubmenuOnPress?: boolean
    styleType?: 'light' | 'normal' | 'dark',
    submenuPosition?: 'above' | 'below' | 'left' | 'right',
    clearSubmenuOnPress?: boolean
}

const ToolButton: React.FC<Props> = ({text, onPress, active, style, icon, onLongPress, openSubmenuOnPress = false, styleType = 'normal', submenuPosition = 'above', clearSubmenuOnPress = false}) => {
    const buttonRef = useRef<View>(null);
    const { resetOpenSubmenu } = useContext(DrawingContext);

    const handleLongPress = async (e: GestureResponderEvent) => {
        if (!buttonRef.current) return;
        const measurement = await measureComponent(buttonRef.current);
        if (!onLongPress || typeof onLongPress !== 'function') return;
        onLongPress(e, measurement, icon, submenuPosition);
    }

    const handlePress = async (e: GestureResponderEvent) => {
        if (!onPress || typeof onPress !== 'function') return;
        if (openSubmenuOnPress) {
            if (!buttonRef.current) return;
            const measurement = await measureComponent(buttonRef.current);
            onPress(e, measurement, icon, submenuPosition);
            if (clearSubmenuOnPress) resetOpenSubmenu();
            return;
        }
        const measurement = {
            height: 0,
            width: 0,
            pageX: 0,
            pageY: 0,
            x: 0,
            y: 0
        }
        onPress(e, measurement, '', submenuPosition);
        if (clearSubmenuOnPress) resetOpenSubmenu();
    }

    // Set the style type use
    // This does not work with styles[styleType + 'ToolButton']
    // So using a switch/case instead
    let styleTypeUse = styles.normalToolButton;
    switch (styleType) {
        case 'light':
            styleTypeUse = styles.lightToolButton;
            break;
        case 'dark':
            styleTypeUse = styles.darkToolButton;
            break;
    }

    return (
        <View style={styles.container} ref={buttonRef}>
            <TouchableOpacity 
                style={[
                    styles.button, 
                    active ? styles.active : null,
                    !active ? styleTypeUse : null,
                    style || null
                ]}
                onPress={handlePress} 
                onLongPress={handleLongPress} 
            >
                {icon && <MaterialCommunityIcons name={icon} size={24} color="black"/>}
                {text && <Text style={active ? styles.activeText : null}>{text}</Text>}
            </TouchableOpacity>
        </View>
    )
}

export default ToolButton;

const styles = StyleSheet.create({
    container: {
        flexDirection: "row"
    },
    button: {
        backgroundColor: "#ddd",
        padding: ICON_MARGIN,
        borderRadius: ICON_MARGIN,
        marginVertical: ICON_MARGIN,
        marginHorizontal: ICON_MARGIN / 2,
        flexDirection: "row",
        alignItems: "center",
    },
    active: {
        backgroundColor: "royalblue",
    },
    activeText: {
        color: "#fff"
    },
    normalToolButton: {
        backgroundColor: '#ddd'
    },
    darkToolButton: {
        backgroundColor: "#ccc"
    },
    lightToolButton: {
        backgroundColor: '#eee'
    }
});
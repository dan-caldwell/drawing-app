import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, LayoutChangeEvent, GestureResponderEvent } from "react-native";
import { Measurement } from '@types';
import { measureComponent } from 'drawing-app/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ICON_MARGIN } from 'drawing-app/constants/Layout';

interface Props {
    text?: string,
    onPress?: (e: GestureResponderEvent, measurement: Measurement, icon: string) => void,
    onLongPress?: (e: GestureResponderEvent, measurement: Measurement, icon: string) => void,
    active?: boolean,
    children?: JSX.Element | React.FC,
    style?: object[] | object,
    icon?: any,
    openSubmenuOnPress?: boolean
}

const ToolButton: React.FC<Props> = ({text, onPress, active, style, icon, onLongPress, openSubmenuOnPress = false}) => {
    const buttonRef = useRef<View>(null);

    const handleLongPress = async (e: GestureResponderEvent) => {
        if (!buttonRef.current) return;
        const measurement = await measureComponent(buttonRef.current);
        if (!onLongPress || typeof onLongPress !== 'function') return;
        onLongPress(e, measurement, icon);
    }

    const handlePress = async (e: GestureResponderEvent) => {
        if (!onPress || typeof onPress !== 'function') return;
        if (openSubmenuOnPress) {
            if (!buttonRef.current) return;
            const measurement = await measureComponent(buttonRef.current);
            onPress(e, measurement, icon);
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
        onPress(e, measurement, '');
    }

    return (
        <View style={styles.container} ref={buttonRef}>
            <TouchableOpacity 
                style={[styles.button, active ? styles.active : null, style || null]} 
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
});
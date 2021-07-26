import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, LayoutChangeEvent, GestureResponderEvent } from "react-native";
import { Measurement } from '@types';
import { measureComponent } from 'drawing-app/utils';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ICON_MARGIN } from 'drawing-app/constants/Layout';

interface Props {
    text?: string,
    onPress?: () => void,
    onLongPress?: (e: GestureResponderEvent, measurement: Measurement, icon: string) => void,
    active?: boolean,
    children?: JSX.Element | React.FC,
    style?: object[] | object,
    icon?: any
}

const ToolButton: React.FC<Props> = ({text, onPress, active, style, icon, onLongPress}) => {
    const buttonRef = useRef<View>(null);

    const handleLongPress = async (e: GestureResponderEvent) => {
        if (!buttonRef.current) return;
        const measurement = await measureComponent(buttonRef.current);
        if (!onLongPress) return;
        onLongPress(e, measurement, icon);
    }

    return (
        <View style={styles.container} ref={buttonRef}>
            <TouchableOpacity 
                style={[styles.button, active ? styles.active : null, style || null]} 
                onPress={onPress} 
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
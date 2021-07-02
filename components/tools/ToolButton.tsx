import React, { useRef } from 'react';
import { TouchableOpacity, StyleSheet, Text, View, LayoutChangeEvent, GestureResponderEvent } from "react-native";

interface Props {
    text?: string,
    onPress: (e: GestureResponderEvent, measurement: object) => void,
    active: boolean,
    children?: JSX.Element | React.FC,
    style?: object[] | object,
    icon?: JSX.Element | React.FC,
}

const ToolButton: React.FC<Props> = ({text, onPress, active, style, icon}) => {
    const buttonRef = useRef<View>(null);

    const measureComponent = (component: View) => {
        return new Promise<object>((resolve, reject) => {
            component.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
                resolve({x, y, width, height, pageX, pageY});
            });
        });
    }

    const handlePress = async (e: GestureResponderEvent) => {
        if (!buttonRef.current) return;
        const measurement = await measureComponent(buttonRef.current);
        onPress(e, measurement);
    }

    return (
        <View style={styles.container} ref={buttonRef}>
            <TouchableOpacity style={[styles.button, active ? styles.active : null, style || null]} onPress={handlePress}>
                {icon && icon}
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
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 5,
        flexDirection: "row",
        alignItems: "center"
    },
    active: {
        backgroundColor: "royalblue",
    },
    activeText: {
        color: "#fff"
    },
});
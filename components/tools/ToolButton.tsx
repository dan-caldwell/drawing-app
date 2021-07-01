import React from 'react';
import { TouchableOpacity, StyleSheet, Text, View } from "react-native";

interface Props {
    text?: string,
    onPress: () => void,
    active: boolean,
    children?: JSX.Element | React.FC,
    style?: object[] | object,
    icon?: JSX.Element | React.FC
}

const ToolButton: React.FC<Props> = ({text, onPress, active, style, icon}) => {

    const getLayout = (e) => {
        console.log(e.nativeEvent.layout);
    }

    return (
        <View style={styles.container} onLayout={getLayout}>
            <TouchableOpacity style={[styles.button, active ? styles.active : null, style || null]} onPress={onPress}>
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
        marginHorizontal: 2.5,
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
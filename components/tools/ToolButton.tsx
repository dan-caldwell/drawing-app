import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from "react-native"

interface Props {
    text: string,
    onPress: () => void
}

const ToolButton: React.FC<Props> = ({text, onPress}) => {
    return (
        <TouchableOpacity style={[styles.button]} onPress={onPress}>
            <Text>{text}</Text>
        </TouchableOpacity>
    )
}

export default ToolButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#ddd",
        padding: 10,
        borderRadius: 10,
        marginVertical: 10,
        marginHorizontal: 2.5
    },
});
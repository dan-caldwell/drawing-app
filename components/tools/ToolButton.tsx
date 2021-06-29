import React from 'react';
import { TouchableOpacity, StyleSheet, Text } from "react-native"

const ToolButton: React.FC = () => {
    return (
        <TouchableOpacity style={[styles.button]}>
            <Text>Tool Button</Text>
        </TouchableOpacity>
    )
}

export default ToolButton;

const styles = StyleSheet.create({
    button: {
        backgroundColor: "#ddd",
        padding: 10,
        borderRadius: 10,
        zIndex: 2
    },
});
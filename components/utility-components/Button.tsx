import React from 'react';
import { Text, TouchableOpacity, StyleSheet } from 'react-native';

interface Props {
    onPress?: () => void | undefined,
    title: string
}

const Button: React.FC<Props> = ({ onPress, title }) => {
    return (
        <TouchableOpacity
            style={[styles.button, styles.buttonClose]}
            onPress={onPress}
        >
            <Text>{title}</Text>
        </TouchableOpacity>
    )
}

export default Button;

const styles = StyleSheet.create({
    button: {
        borderRadius: 10,
        padding: 10,
        elevation: 2
    },
    buttonClose: {
        backgroundColor: 'orange'
    }
});
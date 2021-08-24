import React from "react";
import { TextInput, StyleSheet } from "react-native";
import { ICON_MARGIN } from 'drawing-app/constants/Layout';

const Input = (props: any) => {
    return (
        <TextInput style={styles.input} {...props} />
    )
}

export default Input;

const styles = StyleSheet.create({
    input: {
        borderColor: "#ddd",
        borderWidth: 1,
        borderRadius: ICON_MARGIN / 2,
        padding: ICON_MARGIN
    }
});
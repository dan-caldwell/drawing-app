import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
    children: JSX.Element | React.FC | JSX.Element[]
}

const Row: React.FC<Props> = ({ children }) => {
    return (
        <View style={styles.row}>{children}</View>
    )
}

export default Row;

const styles = StyleSheet.create({
    row: {
        flexDirection: "row",
        alignItems: "center"
    }
});
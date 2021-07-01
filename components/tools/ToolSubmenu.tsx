import React from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';

const ToolSubmenu: React.FC = ({ children }) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}

export default ToolSubmenu;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: 10,
        margin: 10,
        padding: 10,
    }
});
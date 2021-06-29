import React from 'react';
import { View, StyleSheet } from 'react-native';
import ToolButton from '../components/tools/ToolButton';

const ToolNavbar: React.FC = () => {
    return (
        <View style={styles.container}>
            <ToolButton />
            <ToolButton />
        </View>
    )
}

export default ToolNavbar;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopColor: '#000',
        borderWidth: 1
    }
});
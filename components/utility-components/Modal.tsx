import React from 'react';
import { View, StyleSheet } from 'react-native';

interface Props {
    children: JSX.Element | JSX.Element[],
}

const Modal: React.FC<Props> = ({ children }) => {
    return (
        <View style={styles.container}>
            {children}
        </View>
    )
}

export default Modal;

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'orange'
    }
});
import React from 'react';
import { View, StyleSheet } from 'react-native';
import { windowWidth, windowHeight } from 'drawing-app/constants/Layout';

interface Props {
    children: JSX.Element | JSX.Element[],
    id: string | null,
}

const Modal: React.FC<Props> = ({ children, id = null }) => {
    return (
        <View style={[styles.container, {
            display: !!id ? 'flex' : 'none'
        }]}>
                {children}
        </View>
    )
}

export default Modal;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'orange',
        zIndex: 10,
        top: 100,
        left: 100
    }
});
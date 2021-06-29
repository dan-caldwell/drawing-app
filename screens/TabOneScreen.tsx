import React, { useState } from 'react';
import { StyleSheet } from 'react-native';
//import DrawingProvider from '../components/context/DrawingContext';
import DrawingCanvas from '../components/drawing/DrawingCanvas';

import Gestures from '../components/drawing/Gestures';
import { Text, View } from '../components/Themed';

export default function TabOneScreen() {

    return (
        <View style={styles.container}>
            <Gestures enabled={true}>
                <DrawingCanvas enabled={false} />
            </Gestures>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: "100%",
        height: "100%"
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    separator: {
        marginVertical: 30,
        height: 1,
        width: '80%',
    },
});

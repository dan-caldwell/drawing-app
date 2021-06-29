import React, { useRef, useState } from 'react';
import { GestureResponderEvent, View, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { brushResponderMove } from './brush-tool';
import clone from 'clone';

interface Props {
    enabled: boolean
}

interface StartPoints {
    x: number | null,
    y: number | null
}

const DrawingCanvas: React.FC<Props> = ({ enabled }) => {
    const [activeTool, setActiveTool] = useState('brush');
    const [paths, setPaths] = useState([]);

    const startRef = useRef<StartPoints>({x: null, y: null});

    const handleResponderGrant = (e: GestureResponderEvent) => {
        if (!enabled) return;
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;
        startRef.current = {x, y};
        const start = ` M${x} ${y}`;
        setPaths(oldPaths => {
            const newPaths = clone(oldPaths);
            newPaths.push(start);
            return newPaths;
        });
    }

    const handleResponderMove = (e: GestureResponderEvent) => {
        if (!enabled) return;
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        switch (activeTool) {
            case 'brush':
                const newPaths = brushResponderMove({ e, paths, x, y });
                setPaths(newPaths);
                // For checking if there should be a dot created
                startRef.current = { x: null, y: null };
                break;
        }
    }

    const handleResponderRelease = (e: GestureResponderEvent) => {
        if (!enabled) return;
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        // Brush tool will have null values for startRef x and y
        if (startRef.current.x && startRef.current.y) {
            
        }
    }

    return (
        <Animated.View
            onStartShouldSetResponder={(evt) => true} 
            onResponderGrant={handleResponderGrant}
            onResponderMove={handleResponderMove}
            onResponderRelease={handleResponderRelease}
            style={styles.container}
        >
            <Svg style={styles.svg}>
                {paths.map(path => (
                    <Path key={path} stroke="black" strokeWidth="10" d={path} strokeLinecap="round" strokeLinejoin="round"></Path>
                ))}
            </Svg>
        </Animated.View>
    )
}

export default DrawingCanvas;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#ddd',
    },
    svg: {
        height: "100%",
        width: "100%",
        backgroundColor: '#ddd'
    }
});
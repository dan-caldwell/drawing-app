import React, { useRef, useState, useContext } from 'react';
import { GestureResponderEvent, View, StyleSheet, Animated } from 'react-native';
import Svg, { Path } from 'react-native-svg';
import { DrawingContext } from '../context/DrawingContext';
import clone from 'clone';
import useBrushTool from 'drawing-app/hooks/useBrushTool';
import useLineTool from 'drawing-app/hooks/useLineTool';

interface StartPoints {
    x: number | null,
    y: number | null
}

const DrawingCanvas: React.FC = () => {
    const { drawing, paths, setPaths, activeTool, openSubmenu, setOpenSubmenu, setDrawing } = useContext(DrawingContext);
    const { brushResponderMove } = useBrushTool();
    const { lineResponderMove, determineIfLineContinuation } = useLineTool();

    const startRef = useRef<StartPoints>({x: null, y: null});
    const moveRef = useRef(false);
    const lineContinuationRef = useRef(0);

    const handleResponderGrant = (e: GestureResponderEvent) => {
        if (openSubmenu.open) setOpenSubmenu({
            open: false,
            left: 0,
            bottom: 0,
            target: null,
            reRendering: false
        });
        moveRef.current = false;
        lineContinuationRef.current = 0;
        if (!drawing) return;
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;
        startRef.current = {x, y};


        if (activeTool === "vector-line") {
            lineContinuationRef.current = determineIfLineContinuation(paths, x, y, lineContinuationRef);
            if (lineContinuationRef.current === 1) return;
        }

        const start = ` M${x} ${y}`;
        setPaths(oldPaths => {
            const newPaths = clone(oldPaths);
            newPaths.push(start);
            return newPaths;
        });
    }

    const handleResponderMove = (e: GestureResponderEvent) => {
        if (!drawing) return;
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        // For checking if there should be a dot created (or to prevent artifacts at the end of a line)
        moveRef.current = true;

        let newPaths: string[] = [];
        switch (activeTool) {
            case 'brush':
                newPaths = brushResponderMove({ e, paths, x, y });
                setPaths(newPaths);
                break;
            case 'vector-line':
                newPaths = lineResponderMove({ 
                    e, 
                    paths, 
                    x, 
                    y, 
                    startX: startRef.current.x, 
                    startY: startRef.current.y, 
                    lineContinuation: lineContinuationRef.current,
                });
                setPaths(newPaths);
                if (lineContinuationRef.current === 1) {
                    lineContinuationRef.current = 2;
                }
                break;
        }
    }

    const handleResponderRelease = (e: GestureResponderEvent) => {
        if (!drawing) return;
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        if (!moveRef.current) {
            setPaths(oldPaths => {
                const newPaths = clone(oldPaths);
                const currentPath = newPaths[newPaths.length - 1];
                newPaths[newPaths.length - 1] = currentPath + `L${x} ${y}`;
                return newPaths;
            });
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
                    <Path key={path} stroke="black" fill="red" strokeWidth="10" d={path} strokeLinecap="round" strokeLinejoin="round"></Path>
                ))}
            </Svg>
        </Animated.View>
    )
}

export default DrawingCanvas;

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        zIndex: 1,
    },
    svg: {
        height: "100%",
        width: "100%",
        backgroundColor: '#fff'
    }
});
import React, { useRef, useState, useContext } from 'react';
import { GestureResponderEvent, View, StyleSheet, Animated } from 'react-native';
import Svg, { G, Path, Rect } from 'react-native-svg';
import { DrawingContext } from '../context/DrawingContext';
import clone from 'clone';
import useBrushTool from 'drawing-app/hooks/useBrushTool';
import useLineTool from 'drawing-app/hooks/useLineTool';
import { SvgPath } from 'drawing-app/types';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import useSelection from 'drawing-app/hooks/useSelection';

interface StartPoints {
    x: number | null,
    y: number | null
}

const DrawingCanvas: React.FC = () => {
    const { drawing, paths, setPaths, activeTool, openSubmenu, setOpenSubmenu, strokeWidth, fill, selectedPath, setSelectedPath } = useContext(DrawingContext);
    const { brushResponderMove } = useBrushTool();
    const { lineResponderMove, determineIfLineContinuation } = useLineTool();
    const { setCurrentPathBoundaries } = useSelection();

    const startRef = useRef<StartPoints>({x: null, y: null});
    const moveRef = useRef(false);
    const lineContinuationRef = useRef(0);

    const handleResponderGrant = (e: GestureResponderEvent) => {
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;
        startRef.current = {x, y};

        if (activeTool === "cursor-default") return;

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


        if (activeTool === "vector-line") {
            lineContinuationRef.current = determineIfLineContinuation(paths, x, y, lineContinuationRef);
            if (lineContinuationRef.current === 1) return;
        }

        const pathData: SvgPath = {
            d: ` M${x} ${y}`,
            strokeWidth,
            fill,
            id: uuid(),
            left: x,
            right: x,
            top: y,
            bottom: y,
            translateX: 0,
            translateY: 0
        };
        setPaths(oldPaths => {
            const newPaths = clone(oldPaths);
            newPaths.push(pathData);
            return newPaths;
        });
    }

    const handleResponderMove = (e: GestureResponderEvent) => {
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        const regex = /\d*\.?\d*/g;

        if (selectedPath) {
            // There is a selected path, so translate the path

            setPaths(oldPaths => {
                const newPaths = clone(oldPaths);
                const selected = newPaths.find(item => item.id === selectedPath.id);
                if (!selected || !startRef.current.x || !startRef.current.y) return newPaths;
                // Translate the selected path
                //const translateX = x - startRef.current.x;
                //const translateY = y - startRef.current.y;
                // const digits = selected.d.match(regex)?.filter(digit => digit);
                // digits?.forEach((digit, index) => {
                //     const digitNum = Number(digit);
                //     // if (index % 2 === 0) {
                //     //     // X value
                //     //     selected.d = selected.d.replace(digit, String(digitNum + translateX));
                //     // } else {
                //     //     // Y value
                //     //     selected.d = selected.d.replace(digit, String(digitNum + translateY));
                //     // }
                // })
                //const splitPath = selected.d.replace(/M/g, '').replace(/L/g, '').trim().split(' ');

                selected.translateX = x - startRef.current.x;
                selected.translateY = y - startRef.current.y;
                //setSelectedPath(selected);
                return newPaths;
            });
            return;
        }

        if (!drawing) return;

        // For checking if there should be a dot created (or to prevent artifacts at the end of a line)
        moveRef.current = true;

        let newPaths: SvgPath[] = [];
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
        
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;
        
        if (selectedPath) {
            // If the selected path has been translated, update the d values of the selected object to the translation

            setPaths(oldPaths => {
                const newPaths = clone(oldPaths);
                const selected = newPaths.find(item => item.id === selectedPath.id);
                if (!selected) return newPaths;
                // const digits = selected.d.replace(/M/g, '').replace(/L/g, '').trim().split(' ');
                // digits.forEach((digit, index) => {
                //     const digitNum = Number(digit);
                //     if (index % 2 === 0) {
                //         // X value
                //         selected.d = selected.d.replace(digit, String(digitNum - selected.translateX));
                //     } else {
                //         // Y value
                //         selected.d = selected.d.replace(digit, String(digitNum - selected.translateY));
                //     }
                // });

                selected.translateX = 0;
                selected.translateY = 0;
                return newPaths;
            });
            return;
        }
        
        if (!drawing || activeTool === "cursor-default") return;

        if (!moveRef.current) {
            setPaths(oldPaths => {
                const newPaths = clone(oldPaths);
                const currentPath = newPaths[newPaths.length - 1];
                currentPath.d = currentPath.d + `L${x} ${y}`;
                // Set the bounding box
                currentPath.left = currentPath.right = x;
                currentPath.top = currentPath.bottom = y;
                return newPaths;
            });
        } else {
            // Sets the bounding box on the path
            setCurrentPathBoundaries();
        }
    }

    const handleSelectPath = (e: GestureResponderEvent, path: SvgPath) => {
        setSelectedPath(path);
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
                {selectedPath &&
                    <Rect x={selectedPath.left - 6} y={selectedPath.top - 6} width={selectedPath.right - selectedPath.left + 12} height={selectedPath.bottom - selectedPath.top + 12} stroke="blue" strokeWidth="3"></Rect>
                }
                {paths.map(path => (
                    <G
                        key={path.id}
                        transform={`translate(${path.translateX}, ${path.translateY})`}
                    >
                        <Path onPress={activeTool === "cursor-default" ? (e: GestureResponderEvent) => handleSelectPath(e, path) : undefined} stroke="black" fill={path.fill || undefined} strokeWidth={path.strokeWidth} d={path.d} strokeLinecap="round" strokeLinejoin="round"></Path>
                    </G>
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
import React, { useRef, useContext } from 'react';
import { GestureResponderEvent, StyleSheet, Animated } from 'react-native';
import Svg, { G, Polyline, Rect } from 'react-native-svg';
import { DrawingContext } from '../context/DrawingContext';
import clone from 'clone';
import useBrushTool from 'drawing-app/hooks/useBrushTool';
import useLineTool from 'drawing-app/hooks/useLineTool';
import { StartPoints, SvgPath } from 'drawing-app/types';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import useSelection from 'drawing-app/hooks/useSelection';

const DrawingCanvas: React.FC = () => {
    const { paths, activeTool, openSubmenu, strokeWidth, fill, selectedPath, tools, resetOpenSubmenu } = useContext(DrawingContext);
    const { brushResponderMove } = useBrushTool();
    const { lineResponderMove, determineIfLineContinuation } = useLineTool();
    const { setCurrentPathBoundaries, updateSelectionAfterRelease } = useSelection();

    const startRef = useRef<StartPoints>({x: null, y: null});
    const moveRef = useRef(false);
    const rotationRef = useRef(false);
    const lineContinuationRef = useRef(0);

    const createInitialPoint = (x: number, y: number) => {
        const pathData: SvgPath = {
            points: `${x},${y} `,
            strokeWidth: strokeWidth.get,
            fill: fill.get,
            id: uuid(),
            left: x,
            right: x,
            top: y,
            bottom: y,
            translateX: 0,
            translateY: 0,
            rotation: 0
        };
        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            newPaths.push(pathData);
            return newPaths;
        });
    }

    const createDot = (x: number, y: number) => {
        paths.set(oldPaths => {
            const newPaths = clone(oldPaths);
            const currentPath = newPaths[newPaths.length - 1];
            currentPath.points = currentPath.points + `${x},${y} `;
            // Set the bounding box
            currentPath.left = currentPath.right = x;
            currentPath.top = currentPath.bottom = y;
            return newPaths;
        });
    }

    const handleResponderGrant = (e: GestureResponderEvent) => {
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;
        startRef.current = {x, y};

        moveRef.current = false;
        rotationRef.current = false;
        lineContinuationRef.current = 0;

        switch (activeTool.get) {
            case tools.select:
                if (selectedPath.get) {
                    // Determine if selection is in rotation square
                    if (x >= selectedPath.get.left - 20 && x <= selectedPath.get.left && y >= selectedPath.get.top - 20 && y <= selectedPath.get.top) {
                        console.log('rotation square selected');
                        rotationRef.current = true;
                        return;
                    }

                    // Determine if selection is outside of the selected rectangle area
                    if (!(x >= selectedPath.get.left && x <= selectedPath.get.right && y >= selectedPath.get.top && y <= selectedPath.get.bottom)) {
                        selectedPath.set(null);
                    }
                    return;
                }
                break;
            case tools.brush:
                createInitialPoint(x, y);
                break;
            case tools.line:
                lineContinuationRef.current = determineIfLineContinuation(paths.get, x, y, lineContinuationRef);
                if (lineContinuationRef.current === 1) return;
                createInitialPoint(x, y);
                break;   
        }
        if (openSubmenu.get.open) resetOpenSubmenu();
    }

    const handleResponderMove = (e: GestureResponderEvent) => {
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        if (rotationRef.current) {
            
            if (!selectedPath.get) return;
            // There is a selected path, so rotate the path
            paths.set(oldPaths => {
                const newPaths = clone(oldPaths);
                const selected = newPaths.find(item => item.id === selectedPath.get?.id);
                if (!selected || !startRef.current.x || !startRef.current.y) return newPaths;
                const yDiff = startRef.current.y - y;
                selected.rotation = yDiff;
                selectedPath.set(selected);
                return newPaths;
            });
            return;
        }

        // For checking if there should be a dot created (or to prevent artifacts at the end of a line)
        moveRef.current = true;

        let newPaths: SvgPath[] = [];
        switch (activeTool.get) {
            case tools.brush:
                newPaths = brushResponderMove({ e, paths: paths.get, x, y });
                paths.set(newPaths);
                break;
            case tools.line:
                newPaths = lineResponderMove({ e, paths: paths.get, x, y, startRef, lineContinuationRef });
                paths.set(newPaths);
                if (lineContinuationRef.current === 1) {
                    lineContinuationRef.current = 2;
                }
                break;
            case tools.select:
                if (!selectedPath.get) return;
                // There is a selected path, so translate the path
                paths.set(oldPaths => {
                    const newPaths = clone(oldPaths);
                    const selected = newPaths.find(item => item.id === selectedPath.get?.id);
                    if (!selected || !startRef.current.x || !startRef.current.y) return newPaths;
                    selected.translateX = x - startRef.current.x;
                    selected.translateY = y - startRef.current.y;
                    selectedPath.set(selected);
                    return newPaths;
                });
                return;
        }
    }

    const handleResponderRelease = (e: GestureResponderEvent) => {
        
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        switch (activeTool.get) {
            case tools.select:
                if (selectedPath.get) {
                    updateSelectionAfterRelease();
                    return;
                }
                break;
            case tools.brush:
            case tools.line:
                if (moveRef.current) {
                    // Sets the bounding box on the path
                    setCurrentPathBoundaries();
                } else {
                    // Creates a dot
                    createDot(x, y);
                }
                break;
        }
    }

    const handleSelectPath = (e: GestureResponderEvent, path: SvgPath) => {
        //setSelectedPath(path);
    }

    const handleSelectedResponderGrant = (e: GestureResponderEvent, path: SvgPath) => {
        if (!selectedPath.get || selectedPath.get.id !== path.id) {
            selectedPath.set(path);
        }
    }

    const degreesInRadians = (rotation: number) => {
        return rotation * (Math.PI / 180);
    }

    const selectedPathNewCoords = () => {
        let output = {
            left: 0,
            top: 0,
            right: 0,
            bottom: 0
        }
        if (!selectedPath.get) return output;
        const originX = ((selectedPath.get.right - selectedPath.get.left) / 2);
        const originY = ((selectedPath.get.bottom - selectedPath.get.top) / 2);
        const rotation = degreesInRadians(selectedPath.get.rotation);

        // For some reason, no matter where the shape is, the resulting top/left/right/bottom values are always in the same place

        output.left = ((selectedPath.get.left - originX) * Math.cos(rotation)) - ((selectedPath.get.top - originY) * Math.sin(rotation)) + selectedPath.get.left;
        output.right = ((selectedPath.get.right - originX) * Math.cos(rotation)) - ((selectedPath.get.top - originY) * Math.sin(rotation)) + selectedPath.get.right;
        output.top = ((selectedPath.get.left - originX) * Math.sin(rotation)) + ((selectedPath.get.top - originY) * Math.cos(rotation)) + selectedPath.get.top;
        output.bottom = ((selectedPath.get.left - originX) * Math.sin(rotation)) + ((selectedPath.get.bottom - originY) * Math.cos(rotation)) + selectedPath.get.bottom;

        //console.log({output});
        return output;
    }

    const selectedCoords = selectedPathNewCoords();

    return (
        <Animated.View
            onStartShouldSetResponder={(evt) => true} 
            onResponderGrant={handleResponderGrant}
            onResponderMove={handleResponderMove}
            onResponderRelease={handleResponderRelease}
            style={styles.container}
        >
            <Svg style={styles.svg}>
                {selectedPath.get &&
                    <>
                        <Rect 
                            x={selectedPath.get.left - 20} 
                            y={selectedPath.get.top - 20} 
                            width={20} 
                            height={20} 
                            fill="green"
                            translateX={selectedPath.get.translateX}
                            translateY={selectedPath.get.translateY}
                        ></Rect>
                        <G
                            translateX={selectedPath.get.translateX}
                            translateY={selectedPath.get.translateY}
                        >
                            <Rect 
                                x={selectedCoords.left} 
                                y={selectedCoords.top} 
                                width={selectedCoords.right - selectedCoords.left} 
                                height={selectedCoords.bottom - selectedCoords.top} 
                                stroke="red" 
                                strokeWidth="4"
                            ></Rect>
                        </G>
                        <G 
                            translateX={selectedPath.get.translateX}
                            translateY={selectedPath.get.translateY}
                            rotation={selectedPath.get.rotation}
                            originX={selectedPath.get.left + ((selectedPath.get.right - selectedPath.get.left) / 2)}
                            originY={selectedPath.get.top + ((selectedPath.get.bottom - selectedPath.get.top) / 2)}
                        >
                            <Rect 
                                x={selectedPath.get.left - 2} 
                                y={selectedPath.get.top - 2} 
                                width={selectedPath.get.right - selectedPath.get.left + 4} 
                                height={selectedPath.get.bottom - selectedPath.get.top + 4} 
                                stroke="blue" strokeWidth="4"
                            ></Rect>
                        </G>
                    </>
                }
                {paths.get.map(path => (
                    <G
                        key={path.id}
                        translateX={path.translateX}
                        translateY={path.translateY}
                        rotation={path.rotation}
                        originX={path.left + ((path.right - path.left) / 2)}
                        originY={path.top + ((path.bottom - path.top) / 2)}
                    >
                        <Polyline 
                            onResponderGrant={(e: GestureResponderEvent) => handleSelectedResponderGrant(e, path)}
                            onPress={activeTool.get === tools.select && selectedPath.get?.id !== path.id ? (e: GestureResponderEvent) => handleSelectPath(e, path) : undefined} 
                            stroke="black"
                            fill={path.fill || undefined}
                            strokeWidth={path.strokeWidth} 
                            points={path.points} 
                            strokeLinecap="round" 
                            strokeLinejoin="round"
                        ></Polyline>
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
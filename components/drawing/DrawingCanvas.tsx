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
    const { paths, setPaths, activeTool, openSubmenu, strokeWidth, fill, selectedPath, setSelectedPath, tools, resetOpenSubmenu } = useContext(DrawingContext);
    const { brushResponderMove } = useBrushTool();
    const { lineResponderMove, determineIfLineContinuation } = useLineTool();
    const { setCurrentPathBoundaries, updateSelectionAfterRelease } = useSelection();

    const startRef = useRef<StartPoints>({x: null, y: null});
    const moveRef = useRef(false);
    const lineContinuationRef = useRef(0);

    const createInitialPoint = (x: number, y: number) => {
        const pathData: SvgPath = {
            points: `${x},${y} `,
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

    const createDot = (x: number, y: number) => {
        setPaths(oldPaths => {
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
        lineContinuationRef.current = 0;

        switch (activeTool) {
            case tools.select:
                if (selectedPath) {
                    if (!(x >= selectedPath.left && x <= selectedPath.right && y >= selectedPath.top && y <= selectedPath.bottom)) {
                        setSelectedPath(null);
                    }
                    return;
                }
                break;
            case tools.brush:
                createInitialPoint(x, y);
                break;
            case tools.line:
                lineContinuationRef.current = determineIfLineContinuation(paths, x, y, lineContinuationRef);
                if (lineContinuationRef.current === 1) return;
                createInitialPoint(x, y);
                break;   
        }
        if (openSubmenu.open) resetOpenSubmenu();
    }

    const handleResponderMove = (e: GestureResponderEvent) => {
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        // For checking if there should be a dot created (or to prevent artifacts at the end of a line)
        moveRef.current = true;

        let newPaths: SvgPath[] = [];
        switch (activeTool) {
            case tools.brush:
                newPaths = brushResponderMove({ e, paths, x, y });
                setPaths(newPaths);
                break;
            case tools.line:
                newPaths = lineResponderMove({ e, paths, x, y, startRef, lineContinuationRef });
                setPaths(newPaths);
                if (lineContinuationRef.current === 1) {
                    lineContinuationRef.current = 2;
                }
                break;
            case tools.select:
                if (selectedPath) {
                    // There is a selected path, so translate the path
                    setPaths(oldPaths => {
                        const newPaths = clone(oldPaths);
                        const selected = newPaths.find(item => item.id === selectedPath.id);
                        if (!selected || !startRef.current.x || !startRef.current.y) return newPaths;
                        selected.translateX = x - startRef.current.x;
                        selected.translateY = y - startRef.current.y;
                        setSelectedPath(selected);
                        return newPaths;
                    });
                    return;
                }
                break;
        }
    }

    const handleResponderRelease = (e: GestureResponderEvent) => {
        
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        switch (activeTool) {
            case tools.select:
                if (selectedPath) {
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
        if (!selectedPath || selectedPath.id !== path.id) {
            setSelectedPath(path);
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
                {selectedPath &&
                    <G transform={`translate(${selectedPath.translateX}, ${selectedPath.translateY})`}>
                        <Rect x={selectedPath.left - 2} y={selectedPath.top - 2} width={selectedPath.right - selectedPath.left + 4} height={selectedPath.bottom - selectedPath.top + 4} stroke="blue" strokeWidth="4"></Rect>
                    </G>
                }
                {paths.map(path => (
                    <G
                        key={path.id}
                        transform={`translate(${path.translateX}, ${path.translateY})`}
                    >
                        <Polyline 
                            onResponderGrant={(e: GestureResponderEvent) => handleSelectedResponderGrant(e, path)}
                            onPress={activeTool === tools.select && selectedPath?.id !== path.id ? (e: GestureResponderEvent) => handleSelectPath(e, path) : undefined} 
                            stroke="black"
                            fill="red" 
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
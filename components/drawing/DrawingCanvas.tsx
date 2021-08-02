import React, { useRef, useContext, useMemo } from 'react';
import { GestureResponderEvent, StyleSheet, Animated } from 'react-native';
import Svg, { Circle, G, Polyline, Rect } from 'react-native-svg';
import { DrawingContext } from '../context/DrawingContext';
import clone from 'clone';
import useBrushTool from 'drawing-app/hooks/useBrushTool';
import useLineTool from 'drawing-app/hooks/useLineTool';
import { CanvasPoint, SvgPath } from 'drawing-app/types';
import 'react-native-get-random-values';
import { v4 as uuid } from 'uuid';
import useSelection from 'drawing-app/hooks/useSelection';

const DrawingCanvas: React.FC = () => {
    const { paths, activeTool, openSubmenu, strokeWidth, strokeColor, fill, selectedPath, tools, resetOpenSubmenu } = useContext(DrawingContext);
    const { brushResponderMove } = useBrushTool();
    const { lineResponderMove, determineIfLineContinuation } = useLineTool();
    const { setCurrentPathBoundaries, updateSelectionTranslateAfterRelease, updateSelectionRotateAfterRelease, rotateSelection, translateSelection, selectedOutside } = useSelection();

    const startRef = useRef<CanvasPoint>({x: null, y: null});
    const moveRef = useRef(false);
    const rotationRef = useRef(false);
    const lineContinuationRef = useRef(0);

    const createInitialPoint = (x: number, y: number) => {
        const pathData: SvgPath = {
            points: `${x},${y} `,
            strokeWidth: strokeWidth.get,
            stroke: strokeColor.get,
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
                        rotationRef.current = true;
                        return;
                    }

                    // Determine if selection is outside of the selected rectangle area
                    if (selectedOutside(x, y)) selectedPath.set(null);
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
            case tools.erase:
                //console.log('erase');
                break;
        }
        if (openSubmenu.get.open) resetOpenSubmenu();
    }

    const handleResponderMove = (e: GestureResponderEvent) => {
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        if (rotationRef.current) {
            rotateSelection(x, y, startRef);
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
                translateSelection(startRef, x, y);
                break;
            case tools.erase:
                // Make a useEraser hook for these functions
                // Get the shapes that are within the bounds of x,y
                paths.set(oldPaths => {
                    const newPaths = clone(oldPaths);
                    const pathsWithinBounds = newPaths.filter(path => x >= path.left && x <= path.right && y >= path.top && y <= path.bottom);
                    pathsWithinBounds.forEach(path => {
                        const splitPoints = path.points.trim().split(' ');
                        let closePoints: number[] = [];
                        splitPoints.forEach((point, index) => {
                            const pointXY = point.split(',');
                            const pointX = Number(pointXY[0]);
                            const pointY = Number(pointXY[1]);
                            // Check if the points on the path are within two units from the x,y value
                            // Add the index to the close points array if they are
                            if (Math.abs(x - pointX) <= 2 && Math.abs(y - pointY) <= 2) {
                                closePoints.push(index);
                            }
                        });
                        const filteredPoints = splitPoints.filter((item, index) => !closePoints.includes(index));
                        const newPointsString = filteredPoints.join(' ');
                        // Find the path in newPaths to directly modify the newPaths array
                        const foundPath = newPaths.find(item => item.id === path.id);
                        
                        // This will create a simplified polyline by deleting the points but will not create cross sections/split the path
                        // So probably need to re-do this entire function
                        // Or split the polylines?
                        if (foundPath) {
                            foundPath.points = newPointsString;
                        }
                    });
                    return newPaths;
                })

                //console.log(x, y);
                break;
        }
    }

    const handleResponderRelease = (e: GestureResponderEvent) => {
        
        const x = e.nativeEvent.locationX;
        const y = e.nativeEvent.locationY;

        switch (activeTool.get) {
            case tools.select:
                if (selectedPath.get) {
                    if (moveRef.current) {
                        updateSelectionTranslateAfterRelease();
                    } else if (rotationRef.current) {
                        updateSelectionRotateAfterRelease();
                    }
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

        rotationRef.current = false;
    }

    const handleSelectPath = (e: GestureResponderEvent, path: SvgPath) => {
        //setSelectedPath(path);
    }

    const handleSelectedResponderGrant = (e: GestureResponderEvent, path: SvgPath) => {
        if (!selectedPath.get || selectedPath.get.id !== path.id) {
            selectedPath.set(path);
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
                            stroke={path.stroke}
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
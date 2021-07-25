import React, { useRef, useCallback, useContext }  from 'react';
import { Animated } from 'react-native';
import { HandlerStateChangeEvent, PanGestureHandler, PanGestureHandlerEventPayload, PinchGestureHandler, PinchGestureHandlerEventPayload, State } from "react-native-gesture-handler";
import { DrawingContext } from '../context/DrawingContext';
import { windowHeight, windowWidth } from 'drawing-app/constants/Layout';

interface Props {
    children: JSX.Element | React.FC,
}

interface Offset {
    x: number,
    y: number
}

const Gestures: React.FC<Props> = ({ children }) => {
    const { activeTool, tools } = useContext(DrawingContext);
    const translationXRef = useRef(new Animated.Value(0));
    const translationYRef = useRef(new Animated.Value(0));
    const lastOffset = useRef<Offset>({x: 0, y: 0});

    const handlePanGestureEvent = useCallback(Animated.event(
        [{
            nativeEvent: {
                translationX: translationXRef.current,
                translationY: translationYRef.current
            }
        }],
        { useNativeDriver: true }
    ), []);

    const handlePanHandlerStateChange = (e: HandlerStateChangeEvent<PanGestureHandlerEventPayload>) => {
        if (e.nativeEvent.oldState === State.ACTIVE) {
            lastOffset.current.x += e.nativeEvent.translationX;
            lastOffset.current.y += e.nativeEvent.translationY;
            translationXRef.current.setOffset(lastOffset.current.x);
            translationXRef.current.setValue(0);
            translationYRef.current.setOffset(lastOffset.current.y);
            translationYRef.current.setValue(0);
        }
    }

    const baseScale = useRef(new Animated.Value(1));
    const pinchScale = useRef(new Animated.Value(1));
    const scale = useRef(Animated.multiply(baseScale.current, pinchScale.current));
    const lastScale = useRef(1);

    const handlePinchGestureEvet = useCallback(Animated.event(
        [{
            nativeEvent: { scale: pinchScale.current }
        }],
        { useNativeDriver: true }
    ), []);

    const handlePinchHandlerStateChange = (e: HandlerStateChangeEvent<PinchGestureHandlerEventPayload>) => {
        if (e.nativeEvent.oldState === State.ACTIVE) {
            lastScale.current *= e.nativeEvent.scale;
            baseScale.current.setValue(lastScale.current);
            pinchScale.current.setValue(1);
        }
    }

    const translateInterpolate = (orientationValue: number, ref: React.MutableRefObject<Animated.Value>) => {
        return ref.current.interpolate({
            inputRange: [-orientationValue / 2, orientationValue / 2],
            outputRange: [-orientationValue / 2, orientationValue / 2],
            extrapolate: 'clamp'
        });
    }


    return (
        <PanGestureHandler enabled={activeTool === tools.move} onGestureEvent={handlePanGestureEvent} onHandlerStateChange={handlePanHandlerStateChange}>
            <Animated.View
                style={{
                    transform: [
                        { translateX: translateInterpolate(windowWidth, translationXRef) },
                        { translateY: translateInterpolate(windowHeight, translationYRef) }
                    ]
                }}
            >
                <PinchGestureHandler enabled={activeTool === tools.move} onGestureEvent={handlePinchGestureEvet} onHandlerStateChange={handlePinchHandlerStateChange}>
                    <Animated.View
                        style={{
                            transform: [
                                { scale: scale.current.interpolate({
                                    inputRange: [0.5, 3],
                                    outputRange: [0.5, 3],
                                    extrapolate: 'clamp'
                                })}
                            ]
                        }}
                    >
                        {children}
                    </Animated.View>
                </PinchGestureHandler>
            </Animated.View>
        </PanGestureHandler>
    )
}

export default Gestures;
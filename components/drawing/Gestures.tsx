import React, { useRef, useCallback }  from 'react';
import { Animated, Dimensions } from 'react-native';
import { HandlerStateChangeEvent, PanGestureHandler, PanGestureHandlerEventPayload, PinchGestureHandler, PinchGestureHandlerEventPayload, State } from "react-native-gesture-handler";

interface Props {
    children: JSX.Element | React.FC,
    enabled: boolean
}

interface Offset {
    x: number,
    y: number
}

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;

const Gestures: React.FC<Props> = ({ children, enabled }) => {

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
            inputRange: [-orientationValue, orientationValue],
            outputRange: [-orientationValue, orientationValue],
            extrapolate: 'clamp'
        });
    }


    return (
        <PanGestureHandler enabled={enabled} onGestureEvent={handlePanGestureEvent} onHandlerStateChange={handlePanHandlerStateChange}>
            <Animated.View
                style={{
                    transform: [
                        { translateX: translateInterpolate(windowWidth, translationXRef) },
                        { translateY: translateInterpolate(windowHeight, translationYRef) }
                    ]
                }}
            >
                <PinchGestureHandler enabled={enabled} onGestureEvent={handlePinchGestureEvet} onHandlerStateChange={handlePinchHandlerStateChange}>
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
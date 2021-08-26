import React, { useContext, useState } from "react";
import { View, Text } from "react-native";
import Input from "drawing-app/components/utility-components/Input";
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';
import Row from "../utility-components/Row";
import { CanvasSize } from "@types";

const CanvasSettings = () => {
    const { canvasSize } = useContext(DrawingContext);
    const [canvasNewSize, setCanvasNewSize] = useState<CanvasSize>({
        width: Number(canvasSize.get.width),
        height: Number(canvasSize.get.height)
    });

    return (
        <View>
            <Text>Canvas Size</Text>
            <Row>
                <Text>Width </Text><Input keyboardType="numeric" value={canvasNewSize.width.toString()} onChangeText={(value: string) => setCanvasNewSize({
                    width: Number(value),
                    height: canvasNewSize.height
                })} />
            </Row>
            <Row>
                <Text>Height </Text><Input keyboardType="numeric" value={canvasNewSize.height.toString()} onChangeText={(value: string) => setCanvasNewSize({
                    width: canvasNewSize.width,
                    height: Number(value),
                })} />
            </Row>
            <Row>
                <Text onPress={() => canvasSize.set({
                    width: canvasNewSize.width,
                    height: canvasNewSize.height
                })}>Save</Text>
            </Row>
        </View>
    )
}

export default CanvasSettings;
import View from "react-native-gesture-handler/lib/typescript/GestureHandlerRootView";
import { Measurement } from "@types";

export const measureComponent = (component: View) => {
    return new Promise<Measurement>((resolve, reject) => {
        component.measure((x: number, y: number, width: number, height: number, pageX: number, pageY: number) => {
            resolve({x, y, width, height, pageX, pageY});
        });
    });
}
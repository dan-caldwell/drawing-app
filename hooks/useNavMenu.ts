import React, { useContext } from "react";
import { GestureResponderEvent, View, StyleSheet } from "react-native";
import { DrawingContext } from '../components/context/DrawingContext';
import { Measurement } from "@types";
import { ICON_MARGIN, windowWidth } from 'drawing-app/constants/Layout';
import { measureComponent } from 'drawing-app/utils';

const useNavMenu = (submenuRef: React.RefObject<View>) => {
    const { openSubmenu, setOpenSubmenu, drawing, setDrawing, activeTool, setActiveTool, resetOpenSubmenu } = useContext(DrawingContext);

    const handleNavButtonPress = async (e: GestureResponderEvent, measurement: Measurement, target: string) => {

        if (!submenuRef.current) return;
        if (openSubmenu.open && openSubmenu.target === target) {
            resetOpenSubmenu();
            return;
        }
        const submenuMeasurement = await measureComponent(submenuRef.current);

        // Handle 0 values for width and height
        // This will only run once as it requires openSubmenu.reRendering to be set to false
        if ((submenuMeasurement.width === 0 || submenuMeasurement.height === 0) && !openSubmenu.reRendering) {
            setOpenSubmenu({
                left: 0,
                bottom: measurement.y + measurement.height,
                open: true,
                target,
                reRendering: true
            });
            // Call this function again with the updated state
            handleNavButtonPress(e, measurement, target);
            return;
        }

        const submenuWidth = submenuMeasurement.width / 2;
        let leftValue = measurement.x + (measurement.width / 2) - submenuWidth;
        if (leftValue < 0) leftValue = ICON_MARGIN;
        if (leftValue > windowWidth) leftValue = windowWidth;
        setOpenSubmenu({
            left: leftValue,
            bottom: measurement.y + measurement.height,
            open: true,
            target,
            reRendering: false
        });
    }

    const handleSubmenuButtonPress = (callback: () => void) => {
        resetOpenSubmenu();
        callback();
    }

    return { handleNavButtonPress, styles, drawing, setDrawing, openSubmenu, activeTool, setActiveTool, handleSubmenuButtonPress }
}

export default useNavMenu;

const styles = StyleSheet.create({
    submenuButton: {
        margin: 0,
        marginVertical: 0,
        marginHorizontal: 0,
        marginBottom: ICON_MARGIN,
        flex: 1
    },
    lastSubmenuButton: {
        margin: 0,
        marginVertical: 0,
        marginHorizontal: 0,
        marginBottom: 0,
        flex: 1
    },
    slider: {
        height: 50
    }
})
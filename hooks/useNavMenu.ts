import React, { useContext } from "react";
import { GestureResponderEvent, View, StyleSheet } from "react-native";
import { DrawingContext } from '../components/context/DrawingContext';
import { Measurement } from "@types";
import { ICON_MARGIN, windowWidth } from 'drawing-app/constants/Layout';
import { measureComponent } from 'drawing-app/utils';

const useNavMenu = (submenuRef: React.RefObject<View>) => {
    const { openSubmenu, activeTool, resetOpenSubmenu } = useContext(DrawingContext);

    const handleNavButtonPress = async (e: GestureResponderEvent, measurement: Measurement, target: string, submenuPosition: string) => {

        if (!submenuRef.current) return;
        if (openSubmenu.get.open && openSubmenu.get.target === target) {
            resetOpenSubmenu();
            return;
        }
        const submenuMeasurement = await measureComponent(submenuRef.current);

        const bottom = submenuPosition === 'above' ? measurement.y + measurement.height : "auto";
        const top = submenuPosition === 'above' ? 'auto' : measurement.y + measurement.height;
        
        // Handle 0 values for width and height
        // This will only run once as it requires openSubmenu.get.reRendering to be set to false
        if ((submenuMeasurement.width === 0 || submenuMeasurement.height === 0) && !openSubmenu.get.reRendering) {
            openSubmenu.set({
                left: 0,
                bottom,
                top,
                open: true,
                target,
                reRendering: true,
                submenuPosition,
                caretLeft: 0
            });
            // Call this function again with the updated state
            handleNavButtonPress(e, measurement, target, submenuPosition);
            return;
        }

        const submenuHalfWidth = submenuMeasurement.width / 2;
        let leftValue = measurement.x + (measurement.width / 2) - submenuHalfWidth;
        if (leftValue < 0) leftValue = ICON_MARGIN;
        // If the submenu goes outside of the screen, set it to the right with a margin of ICON_MARGIN
        if (leftValue + submenuMeasurement.width > windowWidth) leftValue = windowWidth - submenuMeasurement.width - ICON_MARGIN;

        openSubmenu.set({
            left: leftValue,
            bottom,
            top,
            open: true,
            target,
            reRendering: false,
            submenuPosition,
            caretLeft: measurement.x + (measurement.width / 2) - leftValue
        });
    }

    const handleSubmenuButtonPress = (callback: () => void) => {
        resetOpenSubmenu();
        callback();
    }

    return { handleNavButtonPress, styles, openSubmenu, activeTool, handleSubmenuButtonPress }
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
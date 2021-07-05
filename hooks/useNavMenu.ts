import React, { useContext } from "react";
import { GestureResponderEvent, View, StyleSheet } from "react-native";
import { DrawingContext } from '../components/context/DrawingContext';
import { Measurement } from "@types";
import { ICON_MARGIN, windowWidth } from 'drawing-app/constants/Layout';
import { measureComponent } from 'drawing-app/utils';

const useNavMenu = (submenuRef: React.RefObject<View>) => {
    const { openSubmenu, setOpenSubmenu, drawing, setDrawing, activeTool, setActiveTool } = useContext(DrawingContext);

    const resetOpenSubmenu = () => {
        setOpenSubmenu({
            bottom: 0,
            left: 0,
            open: false,
            target: null
        });
    }

    const handleNavButtonPress = async (e: GestureResponderEvent, measurement: Measurement, target: string) => {
        if (!submenuRef.current) return;
        if (openSubmenu.open && openSubmenu.target === target) {
            resetOpenSubmenu();
            return;
        }
        const submenuMeasurement = await measureComponent(submenuRef.current);
        const submenuWidth = submenuMeasurement.width / 2;
        let leftValue = measurement.x + (measurement.width / 2) - submenuWidth;
        if (leftValue < 0) leftValue = ICON_MARGIN;
        if (leftValue > windowWidth) leftValue = windowWidth;
        setOpenSubmenu({
            left: leftValue,
            bottom: measurement.y + measurement.height,
            open: true,
            target
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
    }
})
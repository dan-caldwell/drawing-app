import ToolButton from 'drawing-app/components/tools/ToolButton';
import React, { useRef, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TooltipSubmenu from '../TooltipSubmenu';
import useNavMenu from "drawing-app/hooks/useNavMenu";
import Slider from '@react-native-community/slider';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';


const DrawingSettingsNavMenu: React.FC = () => {
    const submenuRef = useRef<View>(null);
    const { autoJoin, setAutoJoin, strokeWidth, setStrokeWidth } = useContext(DrawingContext);
    const { handleNavButtonPress, styles, openSubmenu } = useNavMenu(submenuRef);

    const handleSubmenuPress = () => {
        console.log('submenu press')
    }

    const handleAutoJoinDistanceSlider = (value: number) => {
        setAutoJoin({
            disabled: false,
            distance: value
        });
    }

    const handleBrushStrokeSizeSlider = (value: number) => {
        setStrokeWidth(value);
    }

    return (
        <>
            <TooltipSubmenu ref={submenuRef} open={openSubmenu.open && openSubmenu.target === "cog"}>
                <ToolButton 
                    text="Move"
                    onPress={handleSubmenuPress}
                    icon="cog"
                    style={styles.lastSubmenuButton}
                />
                <Slider 
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={20}
                    onValueChange={handleAutoJoinDistanceSlider}
                    step={1}
                    value={autoJoin.distance}
                />
                <Text style={localStyles.label}>Auto-join Distance: {autoJoin.distance}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={20}
                    onValueChange={handleBrushStrokeSizeSlider}
                    step={1}
                    value={strokeWidth}
                />
                <Text style={localStyles.label}>Stroke Width: {strokeWidth}</Text>
            </TooltipSubmenu>
            <ToolButton 
                active={false}
                onPress={handleNavButtonPress}
                icon="cog"
            />
        </>
    )
}

export default DrawingSettingsNavMenu;

const localStyles = StyleSheet.create({
    label: {
        color: '#fff'
    }
});
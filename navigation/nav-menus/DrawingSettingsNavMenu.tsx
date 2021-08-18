import ToolButton from 'drawing-app/components/tools/ToolButton';
import React, { useRef, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TooltipSubmenu from '../TooltipSubmenu';
import useNavMenu from "drawing-app/hooks/useNavMenu";
import Slider from '@react-native-community/slider';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';


const DrawingSettingsNavMenu: React.FC = () => {
    const submenuRef = useRef<View>(null);
    const { autoJoin, strokeWidth, tools } = useContext(DrawingContext);
    const { handleNavButtonPress, styles, openSubmenu } = useNavMenu(submenuRef);

    const handleSubmenuPress = () => {
        console.log('submenu press')
    }

    const handleAutoJoinDistanceSlider = (value: number) => {
        autoJoin.set({
            disabled: false,
            distance: value
        });
    }

    const handleBrushStrokeSizeSlider = (value: number) => {
        strokeWidth.set(value);
    }

    return (
        <>
            <TooltipSubmenu ref={submenuRef} open={openSubmenu.get.open && openSubmenu.get.target === tools.settings}>
                <ToolButton 
                    text="Move"
                    onPress={handleSubmenuPress}
                    icon={tools.settings}
                    style={styles.lastSubmenuButton}
                />
                <Slider 
                    style={styles.slider}
                    minimumValue={0}
                    maximumValue={20}
                    onValueChange={handleAutoJoinDistanceSlider}
                    step={1}
                    value={autoJoin.get.distance}
                />
                <Text style={localStyles.label}>Auto-join Distance: {autoJoin.get.distance}</Text>
                <Slider
                    style={styles.slider}
                    minimumValue={1}
                    maximumValue={20}
                    onValueChange={handleBrushStrokeSizeSlider}
                    step={1}
                    value={strokeWidth.get}
                />
                <Text style={localStyles.label}>Stroke Width: {strokeWidth.get}</Text>
            </TooltipSubmenu>
            <ToolButton 
                active={false}
                onPress={handleNavButtonPress}
                icon={tools.settings}
                openSubmenuOnPress={true}
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
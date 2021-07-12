import ToolButton from 'drawing-app/components/tools/ToolButton';
import React, { useRef, useContext } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import TooltipSubmenu from '../TooltipSubmenu';
import useNavMenu from "drawing-app/hooks/useNavMenu";
import Slider from '@react-native-community/slider';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';


const DrawingSettingsNavMenu: React.FC = () => {
    const submenuRef = useRef<View>(null);
    const { autoJoin, setAutoJoin } = useContext(DrawingContext);
    const { handleNavButtonPress, styles, openSubmenu, activeTool } = useNavMenu(submenuRef);

    const handleSubmenuPress = () => {
        console.log('submenu press')
    }

    const handleAutoJoinDistanceSlider = (value: number) => {
        setAutoJoin({
            disabled: false,
            distance: value
        });
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
                <Text style={localStyles.autoJoinValue}>Distance: {autoJoin.distance}</Text>
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
    autoJoinValue: {
        color: '#fff'
    }
});
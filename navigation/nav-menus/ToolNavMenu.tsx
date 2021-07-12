import ToolButton from 'drawing-app/components/tools/ToolButton';
import React, { useRef } from 'react';
import { View } from 'react-native';
import TooltipSubmenu from '../TooltipSubmenu';
import useNavMenu from "drawing-app/hooks/useNavMenu";

type Tool = {
    tool: string,
    text: string
}

const tools: Tool[] = [
    {
        tool: "brush",
        text: "Brush"
    },
    {
        tool: "vector-line",
        text: "Line"
    },
    {
        tool: "format-color-fill",
        text: "Fill"
    }
]

const acceptableTargets = tools.map(item => item.tool);

const ToolNavMenu: React.FC = () => {
    const submenuRef = useRef<View>(null);
    const { handleNavButtonPress, styles, openSubmenu, activeTool, setActiveTool, handleSubmenuButtonPress, drawing, setDrawing } = useNavMenu(submenuRef);

    const handlePress = (tool: string) => {
        if (!drawing) setDrawing(true);
        handleSubmenuButtonPress(() => setActiveTool(tool));
    }

    return (
        <>
            <TooltipSubmenu ref={submenuRef} open={openSubmenu.open && acceptableTargets.includes(openSubmenu.target || '')}>
                {tools.map((item, index) => (
                    <ToolButton
                        text={item.text}
                        onPress={() => handlePress(item.tool)}
                        icon={item.tool}
                        style={index === tools.length - 1 ? styles.lastSubmenuButton : styles.submenuButton}
                        key={item.tool}
                    />
                ))}
            </TooltipSubmenu>
            <ToolButton 
                active={false}
                onPress={handleNavButtonPress}
                icon={activeTool}
            />
        </>
    )
}

export default ToolNavMenu;
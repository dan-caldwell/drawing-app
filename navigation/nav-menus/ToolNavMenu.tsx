import ToolButton from 'drawing-app/components/tools/ToolButton';
import React, { useContext, useRef } from 'react';
import { View } from 'react-native';
import TooltipSubmenu from '../TooltipSubmenu';
import useNavMenu from "drawing-app/hooks/useNavMenu";
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';

type Tool = {
    tool: string,
    text: string
}



const ToolNavMenu: React.FC = () => {
    const submenuRef = useRef<View>(null);
    const { tools } = useContext(DrawingContext);
    const { handleNavButtonPress, styles, openSubmenu, activeTool, setActiveTool, handleSubmenuButtonPress } = useNavMenu(submenuRef);

    const handlePress = (tool: string) => {
        handleSubmenuButtonPress(() => setActiveTool(tool));
    }

    const acceptableTools: Tool[] = [
        {
            tool: tools.move,
            text: "Move"
        },
        {
            tool: tools.select,
            text: "Select"
        },
        {
            tool: tools.brush,
            text: "Brush"
        },
        {
            tool: tools.line,
            text: "Line"
        },
    ]

    const acceptableTargets = acceptableTools.map(item => item.tool);

    return (
        <>
            <TooltipSubmenu ref={submenuRef} open={openSubmenu.open && acceptableTargets.includes(openSubmenu.target || '')}>
                {acceptableTools.map((item, index) => (
                    <ToolButton
                        text={item.text}
                        onPress={() => handlePress(item.tool)}
                        icon={item.tool}
                        style={index === acceptableTools.length - 1 ? styles.lastSubmenuButton : styles.submenuButton}
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
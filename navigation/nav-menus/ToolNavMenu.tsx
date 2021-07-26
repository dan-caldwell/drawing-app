import ToolButton from 'drawing-app/components/tools/ToolButton';
import React, { useContext, useRef, useState } from 'react';
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
    const { tools, activeTool, activeDrawTool } = useContext(DrawingContext);
    const { handleNavButtonPress, styles, openSubmenu, handleSubmenuButtonPress } = useNavMenu(submenuRef);

    const handlePress = (tool: string) => {
        handleSubmenuButtonPress(() => activeTool.set(tool));
        activeDrawTool.set(tool);
    }

    const acceptableTools: Tool[] = [
        {
            tool: tools.brush,
            text: "Brush"
        },
        {
            tool: tools.line,
            text: "Line"
        },
    ]

    const acceptableTargets: string[] | null[] = acceptableTools.map(item => item.tool);

    return (
        <>
            <TooltipSubmenu ref={submenuRef} open={openSubmenu.get.open && acceptableTargets.includes(openSubmenu.get.target || '')}>
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
                active={acceptableTargets.includes(activeTool.get || '')}
                onLongPress={handleNavButtonPress}
                onPress={() => activeTool.set(activeDrawTool.get)}
                icon={activeDrawTool.get}
            />
        </>
    )
}

export default ToolNavMenu;
import ToolButton from 'drawing-app/components/tools/ToolButton';
import React, { useRef } from 'react';
import { View } from 'react-native';
import TooltipSubmenu from '../TooltipSubmenu';
import useNavMenu from "drawing-app/hooks/useNavMenu";

const ToolNavMenu: React.FC = () => {
    const submenuRef = useRef<View>(null);
    const { handleNavButtonPress, styles, openSubmenu, activeTool, setActiveTool, handleSubmenuButtonPress, drawing, setDrawing } = useNavMenu(submenuRef);

    const acceptableTargets: (string | null)[] = ["brush", "vector-line"];

    const handlePress = (tool: string) => {
        if (!drawing) setDrawing(true);
        handleSubmenuButtonPress(() => setActiveTool(tool));
    }

    return (
        <>
            <TooltipSubmenu ref={submenuRef} open={openSubmenu.open && acceptableTargets.includes(openSubmenu.target)}>
                <ToolButton 
                    text="Brush"
                    onPress={() => handlePress("brush")}
                    icon="brush"
                    style={styles.submenuButton}
                />
                <ToolButton 
                    text="Line"
                    onPress={() => handlePress("vector-line")}
                    style={styles.lastSubmenuButton}
                    icon="vector-line"
                />
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
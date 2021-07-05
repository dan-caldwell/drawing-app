import ToolButton from 'drawing-app/components/tools/ToolButton';
import React, { useRef } from 'react';
import { View } from 'react-native';
import TooltipSubmenu from '../TooltipSubmenu';
import useNavMenu from "drawing-app/hooks/useNavMenu";

const ActionNavMenu: React.FC = () => {
    const submenuRef = useRef<View>(null);
    const { handleNavButtonPress, styles, drawing, setDrawing, openSubmenu, handleSubmenuButtonPress } = useNavMenu(submenuRef);

    const acceptableTargets: (string | null)[] = ["pencil", "cursor-move"];

    return (
        <>
            <TooltipSubmenu ref={submenuRef} open={openSubmenu.open && acceptableTargets.includes(openSubmenu.target)}>
                <ToolButton 
                    text="Move"
                    onPress={() => handleSubmenuButtonPress(() => setDrawing(false))}
                    icon="cursor-move"
                    style={styles.submenuButton}
                />
                <ToolButton 
                    text="Draw"
                    onPress={() => handleSubmenuButtonPress(() => setDrawing(true))}
                    style={styles.lastSubmenuButton}
                    icon="pencil"
                />
            </TooltipSubmenu>
            <ToolButton 
                active={false} 
                onPress={handleNavButtonPress}
                icon={drawing ? 'pencil' : 'cursor-move'}
            />
        </>
    )
}

export default ActionNavMenu;
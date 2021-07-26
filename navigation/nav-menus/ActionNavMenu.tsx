import ToolButton from 'drawing-app/components/tools/ToolButton';
import React, { useRef } from 'react';
import { View } from 'react-native';
import TooltipSubmenu from '../TooltipSubmenu';
import useNavMenu from "drawing-app/hooks/useNavMenu";

const ActionNavMenu: React.FC = () => {
    const submenuRef = useRef<View>(null);
    const { handleNavButtonPress, styles, openSubmenu } = useNavMenu(submenuRef);

    const acceptableTargets: (string | null)[] = ["pencil", "cursor-move"];

    return (
        <>
            <TooltipSubmenu ref={submenuRef} open={openSubmenu.get.open && acceptableTargets.includes(openSubmenu.get.target)}>
                <ToolButton 
                    text="Move"
                    onPress={() => {}}
                    icon="cursor-move"
                    style={styles.submenuButton}
                />
                <ToolButton 
                    text="Draw"
                    onPress={() => {}}
                    style={styles.lastSubmenuButton}
                    icon="pencil"
                />
            </TooltipSubmenu>
            <ToolButton 
                active={false} 
                onLongPress={handleNavButtonPress}
                icon={'pencil'}
            />
        </>
    )
}

export default ActionNavMenu;
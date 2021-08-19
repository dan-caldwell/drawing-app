import ToolButton from 'drawing-app/components/tools/ToolButton';
import React, { useRef, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import TooltipSubmenu from '../TooltipSubmenu';
import useNavMenu from "drawing-app/hooks/useNavMenu";
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';

const DocumentNavMenu: React.FC = () => {
    const submenuRef = useRef<View>(null);
    const { tools } = useContext(DrawingContext);
    const { handleNavButtonPress, styles, openSubmenu } = useNavMenu(submenuRef);

    const handleSubmenuPress = () => {
        console.log('submenu press')
    }

    return (
        <>
            <TooltipSubmenu ref={submenuRef} open={openSubmenu.get.open && openSubmenu.get.target === tools.document}>
                <ToolButton 
                    text="Placeholder"
                    onPress={handleSubmenuPress}
                    icon={tools.document}
                    style={styles.lastSubmenuButton}
                />
            </TooltipSubmenu>
            <ToolButton 
                active={false}
                onPress={handleNavButtonPress}
                icon={tools.document}
                styleType="light"
                openSubmenuOnPress={true}
                submenuPosition="below"
            />
        </>
    )
}

export default DocumentNavMenu;

const localStyles = StyleSheet.create({
    label: {
        color: '#fff'
    }
});
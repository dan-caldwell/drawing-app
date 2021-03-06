import ToolButton from 'drawing-app/components/tools/ToolButton';
import React, { useRef, useContext } from 'react';
import { View, StyleSheet } from 'react-native';
import TooltipSubmenu from '../TooltipSubmenu';
import useNavMenu from "drawing-app/hooks/useNavMenu";
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';

const DocumentNavMenu: React.FC = () => {
    const submenuRef = useRef<View>(null);
    const { tools, paths, selectedPath, pathsHistory, historyIndex, openModal } = useContext(DrawingContext);
    const { handleNavButtonPress, styles, openSubmenu } = useNavMenu(submenuRef);

    const handleResetDrawingCanvas = () => {
        paths.set([]);
        selectedPath.set(null);
        pathsHistory.set([]);
        historyIndex.set(-1);
    }

    return (
        <>
            <TooltipSubmenu ref={submenuRef} open={openSubmenu.get.open && openSubmenu.get.target === tools.document}>
                <ToolButton
                    text="Canvas Settings"
                    onPress={() => openModal.set('CanvasSettings')}
                    icon={tools.move}
                    style={styles.submenuButton}
                    clearSubmenuOnPress={true}
                />
                <ToolButton 
                    text="Reset Canvas"
                    onPress={handleResetDrawingCanvas}
                    icon={tools.reset}
                    style={styles.lastSubmenuButton}
                    clearSubmenuOnPress={true}
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
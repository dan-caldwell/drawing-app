import React, { useContext} from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import ToolButton from '../components/tools/ToolButton';
import { DrawingContext } from '../components/context/DrawingContext';
import ToolNavMenu from './nav-menus/ToolNavMenu';
import DrawingSettingsNavMenu from './nav-menus/DrawingSettingsNavMenu';

const ToolNavbar: React.FC = () => {
    const { paths, resetOpenSubmenu, openSubmenu, activeTool, tools } = useContext(DrawingContext);

    const handlePress = (e: GestureResponderEvent) => {
        if (openSubmenu.get.open) resetOpenSubmenu();
    }

    const handleToolPress = (tool: string) => {
        if (activeTool.get !== tool) activeTool.set(tool);
        if (openSubmenu.get.open && openSubmenu.get.target !== tool) resetOpenSubmenu();
    }

    return (
        <TouchableWithoutFeedback onPress={handlePress}>
            <View style={styles.container}>
                <ToolButton
                    onPress={() => handleToolPress(tools.move)}
                    icon={tools.move}
                    active={activeTool.get === tools.move}
                />
                <ToolButton 
                    onPress={() => handleToolPress(tools.select)}
                    icon={tools.select}
                    active={activeTool.get === tools.select}
                />
                <ToolNavMenu />
                <DrawingSettingsNavMenu />
            </View>
        </TouchableWithoutFeedback>
    )
}

export default ToolNavbar;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        backgroundColor: '#fff',
        borderTopColor: '#ddd',
        borderTopWidth: 1,
        justifyContent: 'center',
    },
});
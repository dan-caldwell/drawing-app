import React, { useContext } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';
import ToolButton from '../components/tools/ToolButton';
import useHistoryChange from 'drawing-app/hooks/useHistoryChange';
import useSelection from 'drawing-app/hooks/useSelection';
import DocumentNavMenu from './nav-menus/DocumentNavMenu';

const DocumentNavbar: React.FC = () => {
    const { tools, selectedPath } = useContext(DrawingContext);
    const { handleHistoryChange } = useHistoryChange();
    const { deletePath } = useSelection();

    return (
        <TouchableWithoutFeedback>
            <View style={styles.container}>
                {selectedPath.get &&
                    <ToolButton
                        onPress={deletePath}
                        icon={tools.trash}
                        styleType='light'
                    />
                }
                <ToolButton 
                    active={false} 
                    onPress={() => handleHistoryChange('undo')} 
                    icon={tools.undo}
                    styleType='light'
                />
                <ToolButton
                    active={false}
                    onPress={() => handleHistoryChange('redo')}
                    icon={tools.redo}
                    styleType='light'
                />
                <DocumentNavMenu />
            </View>
        </TouchableWithoutFeedback>
    )
}

export default DocumentNavbar;

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flexDirection: 'row',
        justifyContent: 'flex-end',
        position: 'relative',
        zIndex: 100,
        paddingRight: 5
    }
});
import React, { useContext } from 'react';
import { View, StyleSheet, TouchableWithoutFeedback, GestureResponderEvent } from 'react-native';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';
import ToolButton from '../components/tools/ToolButton';
import useHistoryChange from 'drawing-app/hooks/useHistoryChange';

const DocumentNavbar: React.FC = () => {
    const { tools } = useContext(DrawingContext);
    const { handleHistoryChange } = useHistoryChange();

    return (
        <TouchableWithoutFeedback>
            <View style={styles.container}>
                <ToolButton 
                    active={false} 
                    onPress={() => handleHistoryChange('undo')} 
                    icon={tools.undo}
                />
                <ToolButton
                    active={false}
                    onPress={() => handleHistoryChange('redo')}
                    icon={tools.redo}
                />
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
    },
    altToolButton: {
        backgroundColor: '#eee'
    }
});
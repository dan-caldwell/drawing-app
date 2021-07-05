import React, { useContext } from 'react';
import { RefObject } from 'react';
import { View, StyleSheet } from 'react-native';
import { ICON_MARGIN } from 'drawing-app/constants/Layout';
import { DrawingContext } from 'drawing-app/components/context/DrawingContext';

interface Props {
    children: JSX.Element | JSX.Element[],
    open: boolean,
    ref: RefObject<View>
}

const TooltipSubmenu = React.forwardRef<View, Props>((props, ref) => {
    const { openSubmenu } = useContext(DrawingContext);
    const { children, open } = props;

    return (
        <View ref={ref} style={[styles.container, { display: open ? 'flex' : 'none', left: openSubmenu.left, bottom: openSubmenu.bottom}]}>
            {children}
        </View>
    )
});

export default TooltipSubmenu;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: '100%',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: ICON_MARGIN,
        marginBottom: ICON_MARGIN,
        padding: ICON_MARGIN,
    }
});
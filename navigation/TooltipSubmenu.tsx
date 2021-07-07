import React, { useContext } from 'react';
import { RefObject } from 'react';
import { View, StyleSheet} from 'react-native';
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
        <View 
            ref={ref} 
            style={[
                styles.container, 
                { 
                    opacity: openSubmenu.reRendering ? 0 : 1,
                    display: open || openSubmenu.reRendering ? "flex" : "none",
                    left: openSubmenu.left, 
                    bottom: openSubmenu.bottom,
                }
            ]}
        >
            <View style={styles.children}>
                {children}
            </View>
            <View style={styles.caret}></View>
        </View>
    )
});

export default TooltipSubmenu;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: '100%',
        marginBottom: ICON_MARGIN,
        alignItems: 'center'
    },
    children: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: ICON_MARGIN,
        padding: ICON_MARGIN,
    },
    caret: {
        borderTopWidth: ICON_MARGIN / 2,
        borderRightWidth: ICON_MARGIN / 2,
        borderBottomWidth: 0,
        borderLeftWidth: ICON_MARGIN / 2,
        borderTopColor: 'rgba(0, 0, 0, 0.5)',
        borderRightColor: 'transparent',
        borderBottomColor: 'transparent',
        borderLeftColor: 'transparent',
    }
});
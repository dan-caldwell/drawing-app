import React, { useContext, useState } from 'react';
import { RefObject } from 'react';
import { View, StyleSheet, LayoutChangeEvent } from 'react-native';
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
    const [rendered, setRendered] = useState<boolean>(false);

    // display: open ? 'flex' : 'none',
    
    const handleLayout = (e: LayoutChangeEvent) => {
        if (!rendered) {
            console.log(e.nativeEvent.layout, 'NOT RENDERED');
            setRendered(true);
        }
    }

    return (
        <View 
            onLayout={handleLayout}
            ref={ref} 
            style={[
                styles.container, 
                { 
                    display: rendered && !open ? "none" : "flex",
                    opacity: open ? 1 : 0,
                    left: openSubmenu.left, 
                    bottom: openSubmenu.bottom,
                }
            ]}
        >
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
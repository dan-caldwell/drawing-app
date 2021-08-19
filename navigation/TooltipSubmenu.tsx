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

    // Default down caret
    let caretTop: string | number = '100%';
    let caretBottom: string | number = 'auto';
    let caretStyle = styles.caretDown;

    switch (openSubmenu.get.submenuPosition) {
        case 'below':
            caretTop = 'auto';
            caretBottom = '100%';
            caretStyle = styles.caretUp;
            break;
    }


    return (
        <View 
            ref={ref} 
            style={[
                styles.container, 
                { 
                    opacity: openSubmenu.get.reRendering ? 0 : 1,
                    display: open || openSubmenu.get.reRendering ? "flex" : "none",
                    left: openSubmenu.get.left, 
                    bottom: openSubmenu.get.bottom,
                    top: openSubmenu.get.top
                }
            ]}
        >
            <View style={styles.children}>
                {children}
            </View>
            <View 
                style={[
                    styles.caret,
                    caretStyle,
                    {
                        top: caretTop,
                        bottom: caretBottom,
                        left: openSubmenu.get.caretLeft
                    }
                ]}
            ></View>
        </View>
    )
});

export default TooltipSubmenu;

const styles = StyleSheet.create({
    container: {
        position: 'absolute',
        bottom: '100%',
        marginBottom: ICON_MARGIN,
        alignItems: 'center',
    },
    children: {
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        borderRadius: ICON_MARGIN,
        padding: ICON_MARGIN,
    },
    caret: {
        transform: [
            { translateX: -ICON_MARGIN / 2}
        ],
        position: 'absolute',
    },
    caretUp: {
        borderTopWidth: 0,
        borderRightWidth: ICON_MARGIN / 2,
        borderBottomWidth: ICON_MARGIN / 2,
        borderLeftWidth: ICON_MARGIN / 2,
        borderTopColor: 'transparent',
        borderRightColor: 'transparent',
        borderBottomColor: 'rgba(0, 0, 0, 0.5)',
        borderLeftColor: 'transparent'
    },
    caretDown: {
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
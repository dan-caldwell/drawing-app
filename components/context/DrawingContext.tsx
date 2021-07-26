import React, { createContext, useContext, useState } from "react";
import { AutoJoin, OpenSubmenu, SvgPath } from '@types';
import useContextState from 'drawing-app/hooks/useContextState';

type ContextState<T> = {
    get: T,
    set: React.Dispatch<React.SetStateAction<T>>
}

interface ContextProps {
    paths: ContextState<SvgPath[]>,
    activeTool: ContextState<string | null>,
    openSubmenu: ContextState<OpenSubmenu>,
    autoJoin: ContextState<AutoJoin>,
    strokeWidth: ContextState<number>,
    fill: ContextState<string>,
    selectedPath: ContextState<SvgPath | null>,
    resetOpenSubmenu: () => void,
    activeDrawTool: ContextState<string | null>,
    tools: {
        move: string,
        select: string,
        brush: string,
        line: string,
        reset: string
    }
}

const tools = {
    move: "cursor-move",
    select: "cursor-default",
    brush: "brush",
    line: "vector-line",
    reset: "backup-restore"
}

export const DrawingContext = createContext<ContextProps>({} as ContextProps);

const DrawingProvider: React.FC = ({children}) => {
    const paths = useContextState<SvgPath[]>([] as SvgPath[]);
    const activeTool = useContextState<string | null>('brush');
    const openSubmenu = useContextState<OpenSubmenu>({
        open: false,
        left: 0,
        bottom: 0,
        target: null,
        reRendering: false
    });
    const activeDrawTool = useContextState<string | null>('brush');
    const autoJoin = useContextState<AutoJoin>({
        disabled: false,
        distance: 5
    });
    const strokeWidth = useContextState<number>(10);
    const fill = useContextState<string>('');
    const selectedPath = useContextState<SvgPath | null>(null);

    const resetOpenSubmenu = () => {
        openSubmenu.set({
            bottom: 0,
            left: 0,
            open: false,
            target: null,
            reRendering: false
        });
    }
    
    return (
        <DrawingContext.Provider value={{
            paths,
            activeTool,
            openSubmenu,
            resetOpenSubmenu,
            autoJoin,
            strokeWidth,
            fill,
            selectedPath,
            activeDrawTool,
            tools
        }}>
            {children}
        </DrawingContext.Provider>
    )
}

export default DrawingProvider;
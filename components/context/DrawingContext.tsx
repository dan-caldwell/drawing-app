import React, { createContext } from "react";
import { AlteredPaths, AutoJoin, CanvasSize, OpenSubmenu, SvgPath } from '@types';
import { ModalId } from 'drawing-app/components/tools/ModalArea';
import useContextState from 'drawing-app/hooks/useContextState';
import { windowHeight, windowWidth } from "drawing-app/constants/Layout";

type ContextState<T> = {
    get: T,
    set: React.Dispatch<React.SetStateAction<T>>
}

interface ContextProps {
    paths: ContextState<SvgPath[]>,
    activeTool: ContextState<string | null>,
    openSubmenu: ContextState<OpenSubmenu>,
    openModal: ContextState<ModalId | null>
    autoJoin: ContextState<AutoJoin>,
    strokeWidth: ContextState<number>,
    strokeColor: ContextState<string>,
    fill: ContextState<string>,
    selectedPath: ContextState<SvgPath | null>,
    resetOpenSubmenu: () => void,
    activeDrawTool: ContextState<string | null>,
    tools: {
        move: string,
        select: string,
        brush: string,
        line: string,
        reset: string,
        erase: string,
        undo: string,
        redo: string,
        trash: string,
        document: string,
        settings: string
    },
    debugPoints: ContextState<string[]>,
    pathsHistory: ContextState<AlteredPaths[][]>,
    historyIndex: ContextState<number>,
    canvasSize: ContextState<CanvasSize>
}

const tools = {
    move: "cursor-move",
    select: "cursor-default",
    brush: "brush",
    line: "vector-line",
    reset: "backup-restore",
    erase: "eraser",
    undo: "undo",
    redo: "redo",
    trash: "trash-can",
    document: "file-document",
    settings: "cog"
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
    const openModal = useContextState<ModalId | null>(null);
    const activeDrawTool = useContextState<string | null>('brush');
    const autoJoin = useContextState<AutoJoin>({
        disabled: false,
        distance: 5
    });
    const strokeWidth = useContextState<number>(10);
    const fill = useContextState<string>('');
    const strokeColor = useContextState<string>('#000');
    const selectedPath = useContextState<SvgPath | null>(null);
    const debugPoints = useContextState<string[]>([]);
    const pathsHistory = useContextState<AlteredPaths[][]>([] as AlteredPaths[][]);
    const historyIndex = useContextState<number>(-1);
    const canvasSize = useContextState<CanvasSize>({
        width: windowWidth / 2,
        height: windowHeight / 2
    });

    const resetOpenSubmenu = () => {
        openSubmenu.set({
            bottom: 0,
            left: 0,
            top: 0,
            open: false,
            target: null,
            reRendering: false,
            submenuPosition: null,
            caretLeft: 0
        });
    }
    
    return (
        <DrawingContext.Provider value={{
            paths,
            activeTool,
            openSubmenu,
            openModal,
            resetOpenSubmenu,
            autoJoin,
            strokeWidth,
            strokeColor,
            fill,
            selectedPath,
            activeDrawTool,
            tools,
            debugPoints,
            pathsHistory,
            historyIndex,
            canvasSize
        }}>
            {children}
        </DrawingContext.Provider>
    )
}

export default DrawingProvider;
import React, { createContext, useState } from "react";
import { AutoJoin, OpenSubmenu, SvgPath } from '@types';

interface ContextProps {
    drawing: boolean,
    setDrawing: React.Dispatch<React.SetStateAction<boolean>>,
    paths: SvgPath[],
    setPaths: React.Dispatch<React.SetStateAction<SvgPath[]>>,
    activeTool: string,
    setActiveTool: React.Dispatch<React.SetStateAction<string>>
    openSubmenu: OpenSubmenu,
    setOpenSubmenu: React.Dispatch<React.SetStateAction<OpenSubmenu>>,
    resetOpenSubmenu: () => void,
    autoJoin: AutoJoin,
    setAutoJoin: React.Dispatch<React.SetStateAction<AutoJoin>>,
    strokeWidth: number,
    setStrokeWidth: React.Dispatch<React.SetStateAction<number>>,
    fill: string,
    setFill: React.Dispatch<React.SetStateAction<string>>,
    selectedPath: SvgPath | null,
    setSelectedPath: React.Dispatch<React.SetStateAction<SvgPath | null>>
}

export const DrawingContext = createContext<ContextProps>({} as ContextProps);

const DrawingProvider: React.FC = ({children}) => {
    const [drawing, setDrawing] = useState<boolean>(false);
    const [paths, setPaths] = useState([] as SvgPath[]);
    const [activeTool, setActiveTool] = useState<string>('brush');
    const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu>({
        open: false,
        left: 0,
        bottom: 0,
        target: null,
        reRendering: false
    });
    const [autoJoin, setAutoJoin] = useState<AutoJoin>({
        disabled: false,
        distance: 5
    });
    const [strokeWidth, setStrokeWidth] = useState<number>(10);
    const [fill, setFill] = useState<string>('');
    const [selectedPath, setSelectedPath] = useState<SvgPath | null>(null);

    const resetOpenSubmenu = () => {
        setOpenSubmenu({
            bottom: 0,
            left: 0,
            open: false,
            target: null,
            reRendering: false
        });
    }
    
    return (
        <DrawingContext.Provider value={{
            drawing, setDrawing,
            paths, setPaths,
            activeTool, setActiveTool,
            openSubmenu, setOpenSubmenu,
            resetOpenSubmenu,
            autoJoin, setAutoJoin,
            strokeWidth, setStrokeWidth,
            fill, setFill,
            selectedPath, setSelectedPath
        }}>
            {children}
        </DrawingContext.Provider>
    )
}

export default DrawingProvider;
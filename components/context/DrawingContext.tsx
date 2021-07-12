import React, { createContext, useState } from "react";
import { AutoJoin, OpenSubmenu } from '@types';

interface ContextProps {
    drawing: boolean,
    setDrawing: React.Dispatch<React.SetStateAction<boolean>>,
    paths: string[],
    setPaths: React.Dispatch<React.SetStateAction<string[]>>,
    activeTool: string,
    setActiveTool: React.Dispatch<React.SetStateAction<string>>
    openSubmenu: OpenSubmenu,
    setOpenSubmenu: React.Dispatch<React.SetStateAction<OpenSubmenu>>,
    resetOpenSubmenu: () => void,
    autoJoin: AutoJoin,
    setAutoJoin: React.Dispatch<React.SetStateAction<AutoJoin>>
}

export const DrawingContext = createContext<ContextProps>({} as ContextProps);

const DrawingProvider: React.FC = ({children}) => {
    const [drawing, setDrawing] = useState(false);
    const [paths, setPaths] = useState(['']);
    const [activeTool, setActiveTool] = useState('brush');
    const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu>({
        open: false,
        left: 0,
        bottom: 0,
        target: null,
        reRendering: false
    });
    const [autoJoin, setAutoJoin] = useState({
        disabled: false,
        distance: 5
    });

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
            autoJoin, setAutoJoin
        }}>
            {children}
        </DrawingContext.Provider>
    )
}

export default DrawingProvider;
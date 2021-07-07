import React, { createContext, useState } from "react";

interface ContextProps {
    drawing: boolean,
    setDrawing: React.Dispatch<React.SetStateAction<boolean>>,
    paths: string[],
    setPaths: React.Dispatch<React.SetStateAction<string[]>>,
    activeTool: string,
    setActiveTool: React.Dispatch<React.SetStateAction<string>>
    openSubmenu: OpenSubmenu,
    setOpenSubmenu: React.Dispatch<React.SetStateAction<OpenSubmenu>>,
    resetOpenSubmenu: () => void
}

export const DrawingContext = createContext<ContextProps>({
    drawing: true,
    setDrawing: () => {},
    paths: [''],
    setPaths: () => {},
    activeTool: 'brush',
    setActiveTool: () => {},
    openSubmenu: {
        open: false,
        left: 0,
        bottom: 0,
        target: null,
        reRendering: false
    },
    setOpenSubmenu: () => {},
    resetOpenSubmenu: () => {}
});

interface OpenSubmenu {
    open: boolean,
    left: number,
    bottom: number,
    target: string | null,
    reRendering: boolean
}


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
            resetOpenSubmenu
        }}>
            {children}
        </DrawingContext.Provider>
    )
}

export default DrawingProvider;
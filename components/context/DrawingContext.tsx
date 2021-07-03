import React, { createContext, useState } from "react";

interface ContextProps {
    drawing: boolean,
    setDrawing: React.Dispatch<React.SetStateAction<boolean>>,
    paths: string[],
    setPaths: React.Dispatch<React.SetStateAction<string[]>>,
    activeTool: string,
    setActiveTool: React.Dispatch<React.SetStateAction<string>>
    openSubmenu: OpenSubmenu,
    setOpenSubmenu: React.Dispatch<React.SetStateAction<OpenSubmenu>>
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
        target: null
    },
    setOpenSubmenu: () => {}
});

interface OpenSubmenu {
    open: boolean,
    left: number,
    bottom: number,
    target: string | null
}


const DrawingProvider: React.FC = ({children}) => {
    const [drawing, setDrawing] = useState(false);
    const [paths, setPaths] = useState(['']);
    const [activeTool, setActiveTool] = useState('brush');
    const [openSubmenu, setOpenSubmenu] = useState<OpenSubmenu>({
        open: false,
        left: 0,
        bottom: 0,
        target: null
    });
    
    return (
        <DrawingContext.Provider value={{
            drawing, setDrawing,
            paths, setPaths,
            activeTool, setActiveTool,
            openSubmenu, setOpenSubmenu
        }}>
            {children}
        </DrawingContext.Provider>
    )
}

export default DrawingProvider;
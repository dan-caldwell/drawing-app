import React, { createContext, useState } from "react";

interface ContextProps {
    drawing: boolean,
    setDrawing: React.Dispatch<React.SetStateAction<boolean>>,
    paths: string[],
    setPaths: React.Dispatch<React.SetStateAction<string[]>>,
    activeTool: string,
    setActiveTool: React.Dispatch<React.SetStateAction<string>>
}

export const DrawingContext = createContext<ContextProps>({
    drawing: true,
    setDrawing: () => {},
    paths: [''],
    setPaths: () => {},
    activeTool: 'brush',
    setActiveTool: () => {}
});


const DrawingProvider: React.FC = ({children}) => {
    const [drawing, setDrawing] = useState(false);
    const [paths, setPaths] = useState(['']);
    const [activeTool, setActiveTool] = useState('brush');
    
    return (
        <DrawingContext.Provider value={{
            drawing, setDrawing,
            paths, setPaths,
            activeTool, setActiveTool
        }}>
            {children}
        </DrawingContext.Provider>
    )
}

export default DrawingProvider;
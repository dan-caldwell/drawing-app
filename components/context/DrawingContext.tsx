import React, { createContext, useState } from "react";

interface ContextProps {
    drawing: boolean,
    setDrawing: React.Dispatch<React.SetStateAction<boolean>>
}

export const DrawingContext = createContext<Partial<ContextProps>>({});

interface Props {
    children: JSX.Element | React.FC,
}

const DrawingProvider: React.FC<Props> = ({children}) => {
    const [drawing, setDrawing] = useState(true);
    
    return (
        <DrawingContext.Provider value={{
            drawing, setDrawing
        }}>
            {children}
        </DrawingContext.Provider>
    )
}

export default DrawingProvider;
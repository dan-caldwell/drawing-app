import { useState } from 'react';

// Returns a get and set for context state
const useContextState = <T>(defaultValue: any) => {
    const [value, setValue] = useState<T>(defaultValue);
    return {
        get: value,
        set: setValue
    }
}

export default useContextState;
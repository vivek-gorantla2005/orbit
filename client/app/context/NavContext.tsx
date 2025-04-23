'use client'
import { createContext, useState } from "react";

export const NavContext = createContext(null);

export const NavContextProvider = ({ children }) => {
    const [navControls, setNavControls] = useState(true);
    return(
        <NavContext.Provider value={{ navControls, setNavControls }}>
            {children}
        </NavContext.Provider>
    )
 
}

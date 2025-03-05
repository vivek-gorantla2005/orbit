'use client'
import { createContext, useState } from "react";

export const SocketContext = createContext(null);

export const SocketContextProvider = ({ children }) => {
    const [notifications, setNotifications] = useState([]);
    const [messages, setMessages] = useState([]);

    return (
        <SocketContext.Provider value={{ messages, setMessages, notifications, setNotifications }}>
            {children}
        </SocketContext.Provider>
    );
};



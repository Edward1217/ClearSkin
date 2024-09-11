import React, { createContext, useState, useEffect } from 'react';

// Create UserContext
export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [userName, setUserName] = useState(null);

    useEffect(() => {
        // Check if user info is stored in localStorage
        const storedUserName = localStorage.getItem('name');
        if (storedUserName) {
            setUserName(storedUserName);
        }
    }, []);

    return (
        <UserContext.Provider value={{ userName, setUserName }}>
            {children}
        </UserContext.Provider>
    );
};

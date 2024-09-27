import React, { createContext, useContext, useState, useEffect } from 'react';

// Create UserContext
export const UserContext = createContext();

// Custom hook to use the UserContext
export const useUser = () => {
    const context = useContext(UserContext);
    if (!context) {
        throw new Error("useUser must be used within a UserProvider");
    }
    return context;
};

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        if (storedUser) {
            setUser(JSON.parse(storedUser)); // Parse the stored user object
        }
    }, []);

    // Only render children once the user state has been initialized
    if (user === null && localStorage.getItem('user')) {
        return <div>Loading user...</div>; // Optionally show a loading state
    }

    return (
        <UserContext.Provider value={{ user, setUser }}>
            {children}
        </UserContext.Provider>
    );
};




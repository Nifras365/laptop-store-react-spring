import React, { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [token, setToken] = useState(() => localStorage.getItem('token'));
    const [userRole, setUserRole] = useState(() => localStorage.getItem('userRole'));
    const [userID, setUserID] = useState(() => localStorage.getItem('userID'));

    // Sync state with localStorage on mount
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        const storedRole = localStorage.getItem('userRole');
        const storedUserID = localStorage.getItem('userID');
        
        if (storedToken) setToken(storedToken);
        if (storedRole) setUserRole(storedRole);
        if (storedUserID) setUserID(storedUserID);
    }, []);

    const login = ({ token: newToken, userRole: newRole, userID: newUserID }) => {
        localStorage.setItem('token', newToken);
        localStorage.setItem('userRole', newRole);
        if (newUserID) {
            localStorage.setItem('userID', newUserID);
            setUserID(newUserID);
        }
        setToken(newToken);
        setUserRole(newRole);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('userRole');
        localStorage.removeItem('userID');
        setToken(null);
        setUserRole(null);
        setUserID(null);
    };

    const isAuthenticated = !!token;

    const hasRole = (role) => {
        return userRole === role;
    };

    const value = {
        token,
        userRole,
        userID,
        login,
        logout,
        isAuthenticated,
        hasRole,
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};

export default AuthContext;

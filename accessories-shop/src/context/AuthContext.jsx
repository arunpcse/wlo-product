import { createContext, useContext, useState, useEffect } from 'react';

const AuthContext = createContext();

// Admin password — set VITE_ADMIN_PASSWORD in your .env to change it
const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'wlo2025';

export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [authLoading, setAuthLoading] = useState(false);

    // Restore session from localStorage on page load
    useEffect(() => {
        const session = localStorage.getItem('wlo_admin_session');
        if (session === 'true') setIsAdmin(true);
    }, []);

    const login = (password) => {
        if (password === ADMIN_PASSWORD) {
            localStorage.setItem('wlo_admin_session', 'true');
            setIsAdmin(true);
        } else {
            throw new Error('Invalid password');
        }
    };

    const logout = () => {
        localStorage.removeItem('wlo_admin_session');
        setIsAdmin(false);
    };

    return (
        <AuthContext.Provider value={{ isAdmin, authLoading, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

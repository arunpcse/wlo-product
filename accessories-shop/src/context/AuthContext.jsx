import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

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

    const login = async (password) => {
        // 1. Local password check (instant feedback)
        if (password !== ADMIN_PASSWORD) {
            throw new Error('Invalid password');
        }

        setAuthLoading(true);
        try {
            // 2. Get JWT token from backend so product CRUD API calls are authenticated
            const res = await authAPI.login(password);
            const { token } = res.data;
            if (token) {
                localStorage.setItem('adminToken', token);
            }
        } catch (err) {
            // Backend unreachable — continue with local-only session
            console.warn('⚠️  Could not get JWT from backend, running in local mode:', err.message);
        } finally {
            setAuthLoading(false);
        }

        localStorage.setItem('wlo_admin_session', 'true');
        setIsAdmin(true);
    };

    const logout = () => {
        localStorage.removeItem('wlo_admin_session');
        localStorage.removeItem('adminToken');
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

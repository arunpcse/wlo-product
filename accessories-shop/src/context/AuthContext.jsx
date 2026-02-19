import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../utils/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [isAdmin, setIsAdmin] = useState(false);
    const [authLoading, setAuthLoading] = useState(true);

    useEffect(() => {
        const token = localStorage.getItem('wlo_admin_token');
        if (token) {
            authAPI.verify()
                .then(() => setIsAdmin(true))
                .catch(() => {
                    localStorage.removeItem('wlo_admin_token');
                    setIsAdmin(false);
                })
                .finally(() => setAuthLoading(false));
        } else {
            setAuthLoading(false);
        }
    }, []);

    const login = async (password) => {
        const res = await authAPI.login(password);
        localStorage.setItem('wlo_admin_token', res.data.token);
        setIsAdmin(true);
        return res.data;
    };

    const logout = () => {
        localStorage.removeItem('wlo_admin_token');
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

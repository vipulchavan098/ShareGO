import { createContext, useState, useContext, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Check if token exists on load
        const token = localStorage.getItem('token');
        const storedUser = localStorage.getItem('user'); // We might want to store basic user info too

        if (token) {
            // Ideally we would validate the token with an API call here, 
            // e.g., api.get('/users/me')
            // For now, we'll assume it's valid if present or rely on the stored user data
            if (storedUser) {
                setUser(JSON.parse(storedUser));
            } else {
                // Fallback if we have token but no user data (maybe decode JWT in real app)
                setUser({ token });
            }
        }
        setLoading(false);
    }, []);

    const login = (userData, token) => {
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(userData));
        setUser(userData);
    };

    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        setUser(null);
        window.location.href = '/login';
    };

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);

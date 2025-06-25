import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/api';
import { useAppContext } from './Appcontext'; // Import useAppContext to clear user state

const AuthContext = createContext();

export const useAuth = () => {
    return useContext(AuthContext);
};

export const AuthProvider = ({ children }) => {
    const { setUser } = useAppContext(); // Get setUser from AppContext
    const [isAuthenticated, setIsAuthenticated] = useState(false);
    const [isLoading, setIsLoading] = useState(true);
    const [user, setUserState] = useState(null);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const token = localStorage.getItem('token');
                if (!token) {
                    setIsAuthenticated(false);
                    setUserState(null);
                    setUser(null);
                    setIsLoading(false);
                    return;
                }

                // Set loading state
                setIsLoading(true);

                // Verify token with backend
                const response = await authService.verifyToken();

                if (response.data.valid) {
                    setIsAuthenticated(true);
                    setUserState(response.data.user);
                    setUser(response.data.user);
                } else {
                    // Clear invalid token
                    localStorage.removeItem('token');
                    setIsAuthenticated(false);
                    setUserState(null);
                    setUser(null);
                }
            } catch (error) {
                console.error('Auth check failed:', error);
                // Clear invalid token
                localStorage.removeItem('token');
                setIsAuthenticated(false);
                setUserState(null);
                setUser(null);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuth();
    }, [setUser]);

    const login = async (credentials) => {
        try {
            const response = await authService.login(credentials);
            const { token, user } = response.data;

            // Store the token
            localStorage.setItem('token', token);

            // Update auth state
            setIsAuthenticated(true);
            setUserState(user);
            setUser(user);

            return {
                success: true,
                user: user
            };
        } catch (error) {
            console.error('Login failed:', error);
            return {
                success: false,
                error: error.response?.data?.message || 'Login failed'
            };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setIsAuthenticated(false);
        setUserState(null);
        setUser(null);
    };

    const value = {
        isAuthenticated,
        isLoading,
        user,
        login,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    );
}; 
import React, { useEffect } from 'react';
import { useNavigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ requiredRole }) => {
    const { isAuthenticated, isLoading, user } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isLoading && !isAuthenticated) {
            navigate('/login');
        }

        if (requiredRole && user && user.role !== requiredRole) {
            navigate('/home');
        }
    }, [isAuthenticated, isLoading, navigate, requiredRole, user]);

    if (isLoading) {
        return (
            <div className="min-h-screen bg-[#1e1e20] flex items-center justify-center">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return isAuthenticated ? <Outlet /> : null;
};

export default ProtectedRoute; 
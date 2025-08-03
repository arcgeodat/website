import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

interface ProtectedRouteProps {
    children: React.ReactNode;
    allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
    const { isAuthenticated, user, isLoading } = useAuth();
    const location = useLocation();

    console.log("ProtectedRoute check", {
        isAuthenticated,
        isLoading,
        user,
        pathname: location.pathname,
    });


    // While checking authentication status
    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="animate-spin h-10 w-10 border-4 border-blue-500 rounded-full border-t-transparent" />
            </div>
        );
    }

    // Not logged in and not trying to access login page
    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles?.length && user?.role) {
        const userRole = user.role.toLowerCase();
        const isAllowed = allowedRoles.some(role => role.toLowerCase() === userRole);
        if (!isAllowed) {
            return <Navigate to="/" replace />;
        }
    }

    // Otherwise, everything is okay
    return <>{children}</>;
};

export default ProtectedRoute;
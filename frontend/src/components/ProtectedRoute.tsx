import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
  allowedRoles?: string[];
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();
  console.log("ProtectedRoute isLoading:", isLoading);
  console.log("ProtectedRoute isAuthenticated:", isAuthenticated);
  console.log("ProtectedRoute user:", user);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!isAuthenticated) {
    console.warn('User is not authenticated, redirecting to login');
    return <Navigate to="/login" replace />;
  }

  console.log("Allowed roles are", allowedRoles)
  console.log()

  if (allowedRoles && user && !allowedRoles.map(r => r.includes(user.role.toLowerCase()))) {
    console.warn(`User role ${user.role} is not allowed, redirecting to dashboard`);
    return <Navigate to="/dashboard" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
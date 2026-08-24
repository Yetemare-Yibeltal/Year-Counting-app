import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

interface ProtectedRouteProps {
  allowedRoles?: string[];
  requiredRole?: string;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, requiredRole }) => {
  const auth = useAuth() as ReturnType<typeof useAuth> & { loading?: boolean };
  const { user, isAuthenticated, loading = false } = auth;

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-gray-500 font-medium">Loading session...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  const effectiveRoles = allowedRoles || (requiredRole ? [requiredRole] : undefined);

  if (effectiveRoles && user && !effectiveRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
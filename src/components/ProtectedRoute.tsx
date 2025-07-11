import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth, hasAdminPermissions, hasStaffPermissions } from '@/contexts/AuthContext';
import { UserRole } from '@/types';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: UserRole;
  requireAuth?: boolean;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole, 
  requireAuth = true 
}) => {
  const { user, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">
            {!user ? 'Loading...' : !profile ? 'Loading profile...' : 'Checking permissions...'}
          </p>
        </div>
      </div>
    );
  }

  if (requireAuth && !user) {
    return <Navigate to="/login" replace />;
  }

  if (requireAuth && !profile) {
    return <Navigate to="/login" replace />;
  }

  // Check role-specific permissions
  if (requiredRole === 'admin' && !hasAdminPermissions(profile)) {
    return <Navigate to="/" replace />;
  }

  if (requiredRole === 'staff' && !hasStaffPermissions(profile)) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
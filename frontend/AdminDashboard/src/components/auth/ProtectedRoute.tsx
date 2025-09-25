import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSkeleton } from '../ui';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredPermissions?: {
    resource: 'users' | 'videos' | 'analytics' | 'system';
    actions: ('read' | 'write' | 'delete' | 'export')[];
  }[];
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredPermissions = [] 
}) => {
  const { isAuthenticated, isLoading, user } = useAuth();
  const location = useLocation();

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
        <div className="space-y-4 w-full max-w-md">
          <LoadingSkeleton variant="rectangular" height="2rem" />
          <LoadingSkeleton variant="text" lines={3} />
          <LoadingSkeleton variant="rectangular" height="3rem" />
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Check permissions if required
  if (requiredPermissions.length > 0 && user) {
    const hasRequiredPermissions = requiredPermissions.every(required => {
      const userPermission = user.permissions.find(p => p.resource === required.resource);
      if (!userPermission) return false;
      
      return required.actions.every(action => 
        userPermission.actions.includes(action)
      );
    });

    if (!hasRequiredPermissions) {
      return (
        <div className="min-h-screen bg-neutral-50 flex items-center justify-center">
          <div className="text-center">
            <div className="mx-auto w-16 h-16 bg-warning-100 rounded-full flex items-center justify-center mb-4">
              <svg className="w-8 h-8 text-warning-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-neutral-900 mb-2">Access Denied</h2>
            <p className="text-neutral-600">You don't have permission to access this resource.</p>
          </div>
        </div>
      );
    }
  }

  return <>{children}</>;
};
import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext.jsx';
import { Skeleton } from './Skeleton.jsx';

export function ProtectedRoute({ children, role }) {
  const { user, loading, isAuthenticated } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background p-8 flex flex-col gap-4">
        <Skeleton className="h-12 w-full max-w-4xl mx-auto" />
        <Skeleton className="h-64 w-full max-w-4xl mx-auto" />
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (role && user.role !== role) {
    // If a customer tries to access admin routes, or vice versa
    return <Navigate to={user.role === 'admin' ? '/admin/dashboard' : '/dashboard'} replace />;
  }

  return children;
}


// src/utils/withRoleGuard.tsx

import { Navigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { toast } from 'react-toastify';
import { PropsWithChildren } from 'react';

export const TeacherAdminGuard = ({ children }: PropsWithChildren) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || (user.role !== 'teacher' && user.role !== 'admin')) {
    toast.warn('🔒 Only teachers and admins can manage content.');
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};
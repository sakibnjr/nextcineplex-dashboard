import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';
import { Loader2 } from 'lucide-react';

export const ProtectedRoute: React.FC = () => {
  const { session, profile, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen w-full flex flex-col items-center justify-center bg-[#0b0f17] text-white">
        <Loader2 className="w-8 h-8 text-red-500 animate-spin mb-3" />
        <span className="text-xs text-slate-400 font-mono tracking-wider">
          Verifying security credentials...
        </span>
      </div>
    );
  }

  if (!session || profile?.user_role !== 'admin') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

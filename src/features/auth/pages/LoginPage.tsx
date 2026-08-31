import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clapperboard } from 'lucide-react';
import { LoginForm } from '../components/LoginForm';
import { useAuth } from '../hooks/useAuth';

export const LoginPage: React.FC = () => {
  const { session, loading } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading && session) {
      navigate('/dashboard/overview', { replace: true });
    }
  }, [session, loading, navigate]);

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-[#070a0f] px-4 py-8 relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

      <div className="w-full max-w-md bg-slate-950/90 backdrop-blur-xl border border-slate-800/80 rounded-3xl p-8 shadow-2xl relative z-10">
        <div className="flex flex-col items-center text-center mb-8">
          <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 mb-3 shadow-lg shadow-red-600/30 flex items-center justify-center">
            <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
              <Clapperboard className="w-7 h-7 text-red-500" />
            </div>
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white">NextCineplex</h1>
          <p className="text-xs text-slate-400 mt-1">
            Cinema Operations & Box Office Command Center
          </p>
        </div>

        <LoginForm />
      </div>
    </div>
  );
};

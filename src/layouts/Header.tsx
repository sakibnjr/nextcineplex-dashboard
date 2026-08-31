import React from 'react';
import { useNavigate } from 'react-router-dom';
import { LogOut, Bell, ShieldCheck } from 'lucide-react';
import { supabase } from '../lib/supabase';

export const Header: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = async () => {
    localStorage.removeItem('nc_dev_auth');
    await supabase.auth.signOut();
    navigate('/login');
  };

  return (
    <header className="h-16 bg-slate-950/80 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0">
      <div className="flex items-center gap-3">
        <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Workspace</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        <button
          type="button"
          className="p-2 text-slate-400 hover:text-slate-200 hover:bg-slate-900 rounded-lg transition-colors relative cursor-pointer"
          title="Notifications"
        >
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500" />
        </button>

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 p-0.5">
            <img
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=100&q=80"
              alt="Admin avatar"
              className="w-full h-full object-cover rounded-full"
            />
          </div>
          <div className="text-left hidden sm:block">
            <div className="text-xs font-semibold text-slate-200 leading-tight">Sakib Admin</div>
            <div className="text-[10px] text-slate-500 leading-tight">admin@nextcineplex.com</div>
          </div>
        </div>

        <button
          type="button"
          onClick={handleLogout}
          className="p-2 text-slate-400 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors ml-1 cursor-pointer"
          title="Sign Out"
        >
          <LogOut className="w-4 h-4" />
        </button>
      </div>
    </header>
  );
};

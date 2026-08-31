import React from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { LogOut, ShieldCheck, Sun, Moon, User as UserIcon } from 'lucide-react';
import { useTheme } from '../context/useTheme';
import { useAuth } from '../features/auth/hooks/useAuth';
import { NotificationDropdown } from '../features/notifications';

export const Header: React.FC = () => {
  const navigate = useNavigate();
  const { theme, toggleTheme } = useTheme();
  const { user, profile, signOut } = useAuth();

  const handleLogout = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/login');
  };

  const displayName = profile?.full_name || user?.user_metadata?.full_name || 'System Admin';
  const displayEmail = user?.email || 'admin@nextcineplex.com';

  return (
    <header className="relative z-40 h-16 bg-slate-950/90 backdrop-blur-md border-b border-slate-800/80 px-6 flex items-center justify-between shrink-0 transition-colors">
      <div className="flex items-center gap-3">
        <span className="text-xs px-2.5 py-1 rounded-full bg-red-500/10 text-red-400 border border-red-500/20 font-medium flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>Admin Workspace</span>
        </span>
      </div>

      <div className="flex items-center gap-3">
        {/* Theme Toggle Button */}
        <button
          type="button"
          onClick={toggleTheme}
          className="p-2 text-slate-400 hover:text-white hover:bg-slate-900 rounded-xl transition-all cursor-pointer"
          title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          aria-label="Toggle Theme"
        >
          {theme === 'dark' ? (
            <Sun className="w-4 h-4 text-amber-400" />
          ) : (
            <Moon className="w-4 h-4 text-indigo-400" />
          )}
        </button>

        {/* Real-time Notifications Popover */}
        <NotificationDropdown />

        <div className="h-4 w-px bg-slate-800" />

        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-red-600 to-amber-500 p-0.5 shrink-0 flex items-center justify-center">
            {profile?.avatar_url ? (
              <img
                src={profile.avatar_url}
                alt="Admin avatar"
                className="w-full h-full object-cover rounded-full"
              />
            ) : (
              <div className="w-full h-full bg-slate-950 rounded-full flex items-center justify-center text-slate-300">
                <UserIcon className="w-4 h-4 text-slate-300" />
              </div>
            )}
          </div>
          <div className="text-left hidden sm:block max-w-[150px]">
            <div className="text-xs font-semibold text-slate-200 leading-tight truncate">
              {displayName}
            </div>
            <div className="text-[10px] text-slate-500 leading-tight truncate">
              {displayEmail}
            </div>
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

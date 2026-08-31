import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Zap } from 'lucide-react';

export const DevBypassButton: React.FC = () => {
  const navigate = useNavigate();

  const handleDevBypass = () => {
    localStorage.setItem('nc_dev_auth', 'true');
    navigate('/dashboard/overview');
  };

  return (
    <div className="pt-4 border-t border-slate-800">
      <button
        type="button"
        onClick={handleDevBypass}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 rounded-lg text-sm font-semibold transition-colors duration-150 cursor-pointer"
      >
        <Zap className="w-4 h-4 text-amber-400" />
        <span>⚡ Quick Dev Access (Instant Bypass)</span>
      </button>
      <p className="text-center text-xs text-slate-500 mt-2">
        Bypasses auth check for faster local testing
      </p>
    </div>
  );
};

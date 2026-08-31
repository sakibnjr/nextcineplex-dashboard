import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '../../../lib/supabase';
import { LogIn, Lock, Mail, AlertCircle, Eye, EyeOff, Loader2, ShieldAlert } from 'lucide-react';

export const LoginForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<{ title: string; desc: string; isRoleError?: boolean } | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password) {
      setErrorMsg({
        title: 'Missing information',
        desc: 'Please enter both your email address and password.',
      });
      return;
    }

    setLoading(true);
    setErrorMsg(null);

    try {
      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        if (error.message.toLowerCase().includes('invalid login credentials')) {
          throw new Error('Incorrect email or password. Please check your credentials and try again.');
        } else if (error.message.toLowerCase().includes('rate limit') || error.message.toLowerCase().includes('too many')) {
          throw new Error('Too many unsuccessful attempts. Please wait a minute before trying again.');
        }
        throw error;
      }

      if (!authData.user) {
        throw new Error('Could not establish secure session. Please try again.');
      }

      // Check if user has admin role in profiles table
      const { data: profileData, error: profileErr } = await supabase
        .from('profiles')
        .select('user_role')
        .eq('id', authData.user.id)
        .single();

      if (profileErr || !profileData || profileData.user_role !== 'admin') {
        await supabase.auth.signOut();
        const roleMsg = 'Access Denied: This command center is restricted to Cinema Administrators. Your account currently does not have admin permissions.';
        setErrorMsg({
          title: 'Administrator Access Required',
          desc: roleMsg,
          isRoleError: true,
        });
        toast.error('Admin permissions required to enter.', { duration: 4000 });
        return;
      }

      toast.success('Welcome back to NextCineplex!');
      navigate('/dashboard/overview');
    } catch (err: unknown) {
      const error = err as Error;
      const message = error.message || 'Unable to sign in right now. Please try again.';
      setErrorMsg({
        title: 'Sign in unsuccessful',
        desc: message,
      });
      toast.error(message, { duration: 4000 });
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {errorMsg && (
        <div
          className={`p-3.5 rounded-2xl border text-xs flex gap-3 ${
            errorMsg.isRoleError
              ? 'bg-amber-500/10 border-amber-500/30 text-amber-300'
              : 'bg-red-500/10 border-red-500/30 text-red-300'
          }`}
        >
          {errorMsg.isRoleError ? (
            <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          ) : (
            <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
          )}
          <div className="flex-1 space-y-0.5">
            <div className="font-bold">{errorMsg.title}</div>
            <div className="text-[11px] leading-relaxed opacity-90">{errorMsg.desc}</div>
          </div>
        </div>
      )}

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Email Address
        </label>
        <div className="relative">
          <Mail className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            autoComplete="email"
            className="w-full pl-9 pr-4 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-all"
          />
        </div>
      </div>

      <div>
        <label className="block text-xs font-semibold text-slate-300 mb-1.5">
          Password
        </label>
        <div className="relative">
          <Lock className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            autoComplete="current-password"
            className="w-full pl-9 pr-10 py-2.5 bg-slate-900 border border-slate-800 focus:border-red-500 rounded-xl text-xs text-white outline-none transition-all"
          />
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-0.5 cursor-pointer"
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? (
              <EyeOff className="w-4 h-4" />
            ) : (
              <Eye className="w-4 h-4" />
            )}
          </button>
        </div>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="w-full flex items-center justify-center gap-2 py-2.5 px-4 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold transition-all shadow-lg shadow-red-600/20 cursor-pointer active:scale-98"
      >
        {loading ? (
          <>
            <Loader2 className="w-4 h-4 animate-spin" />
            <span>Verifying credentials...</span>
          </>
        ) : (
          <>
            <LogIn className="w-4 h-4" />
            <span>Sign In to NextCineplex</span>
          </>
        )}
      </button>
    </form>
  );
};

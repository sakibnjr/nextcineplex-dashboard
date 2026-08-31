import React, { useEffect, useState } from 'react';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { Profile } from '../types';
import { AuthContext } from './authContextDef';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [session, setSession] = useState<Session | null>(null);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchProfileAndVerifyAdmin = async (userId: string): Promise<Profile | null> => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error || !data || data.user_role !== 'admin') {
        // Non-admin user or missing profile - force logout
        await supabase.auth.signOut();
        setUser(null);
        setSession(null);
        setProfile(null);
        return null;
      }

      setProfile(data);
      return data;
    } catch {
      await supabase.auth.signOut();
      setUser(null);
      setSession(null);
      setProfile(null);
      return null;
    }
  };

  useEffect(() => {
    supabase.auth.getSession().then(async ({ data: { session } }) => {
      if (session?.user) {
        const verifiedProfile = await fetchProfileAndVerifyAdmin(session.user.id);
        if (verifiedProfile) {
          setSession(session);
          setUser(session.user);
        }
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (session?.user) {
        const verifiedProfile = await fetchProfileAndVerifyAdmin(session.user.id);
        if (verifiedProfile) {
          setSession(session);
          setUser(session.user);
        }
      } else {
        setSession(null);
        setUser(null);
        setProfile(null);
      }
      setLoading(false);
    });

    return () => subscription.unsubscribe();
  }, []);

  const signOut = async () => {
    localStorage.removeItem('nc_dev_auth');
    await supabase.auth.signOut();
    setUser(null);
    setSession(null);
    setProfile(null);
  };

  return (
    <AuthContext.Provider
      value={{ user, session, profile, loading, signOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

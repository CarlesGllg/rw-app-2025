import { useEffect, useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/lib/supabase';
import type { UserRole } from '@/types/database';
import { toast } from 'sonner';

export type User = {
  id: string;
  email: string;
  role: UserRole;
  full_name: string | null;
  created_at: string;
  updated_at: string;
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const authCheckedRef = useRef(false);
  
  useEffect(() => {
    let mounted = true;
    
    // Set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth state change:', event, session?.user?.email);
      
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' && session) {
        console.log('User signed in:', session.user.email);
        
        try {
          // Fetch user profile from profiles table
          const { data: profile, error } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .maybeSingle();
            
          if (error) {
            console.error("Error fetching user profile:", error);
          }
          
          if (mounted) {
            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: (profile?.role as UserRole) || 'parent',
              full_name: profile?.full_name || session.user.user_metadata.full_name || null,
              created_at: profile?.created_at || session.user.created_at,
              updated_at: profile?.updated_at || session.user.updated_at || session.user.created_at
            });
            setLoading(false);
          }
        } catch (error) {
          console.error("Error in auth state change:", error);
          if (mounted) {
            setLoading(false);
          }
        }
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('Token refreshed for:', session.user.email);
        // Keep existing user data, just refresh the session
      }
    });
    
    // Check for existing session
    const checkSession = async () => {
      if (authCheckedRef.current) return;
      
      try {
        console.log('Checking existing session...');
        const { data: { session }, error } = await supabase.auth.getSession();
        
        if (error) {
          console.error('Error getting session:', error);
          if (mounted) {
            setLoading(false);
            authCheckedRef.current = true;
          }
          return;
        }
        
        if (!mounted) return;
        
        if (session) {
          console.log('Found existing session for:', session.user.email);
          
          try {
            const { data: profile, error: profileError } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (profileError) {
              console.error("Error fetching user profile:", profileError);
            }

            if (mounted) {
              setUser({
                id: session.user.id,
                email: session.user.email!,
                role: (profile?.role as UserRole) || 'parent',
                full_name: profile?.full_name || session.user.user_metadata.full_name || null,
                created_at: profile?.created_at || session.user.created_at,
                updated_at: profile?.updated_at || session.user.updated_at || session.user.created_at
              });
            }
          } catch (error) {
            console.error("Error fetching profile:", error);
          }
        } else {
          console.log('No existing session found');
        }
        
        if (mounted) {
          setLoading(false);
          authCheckedRef.current = true;
        }
      } catch (error) {
        console.error("Error checking session:", error);
        if (mounted) {
          setLoading(false);
          authCheckedRef.current = true;
        }
      }
    };
    
    checkSession();
    
    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    try {
      console.log('Signing out user...');
      const { error } = await supabase.auth.signOut();
      if (error) {
        console.error('Error signing out:', error);
        toast.error('Error al cerrar sesión');
        return;
      }
      
      setUser(null);
      navigate('/login', { replace: true });
      toast.success('Sesión cerrada exitosamente');
    } catch (error: any) {
      console.error('Error in signOut:', error);
      toast.error('Error al cerrar sesión');
    }
  };

  return { user, loading, signOut };
}

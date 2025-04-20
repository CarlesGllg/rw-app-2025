
import { useEffect, useState, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const authCheckedRef = useRef(false);
  
  // Prevent redirect on auth pages
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/verificar' || 
                     location.pathname === '/';

  useEffect(() => {
    let mounted = true;
    
    // First, set up the auth state change listener
    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      // Only proceed if component is still mounted
      if (!mounted) return;
      
      if (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED') {
        if (session) {
          // Set basic user data immediately from session
          setUser({
            id: session.user.id,
            email: session.user.email!,
            role: 'parent' as UserRole,
            full_name: session.user.user_metadata.full_name,
            created_at: session.user.created_at,
            updated_at: session.user.created_at
          });
          
          // Use setTimeout to safely fetch profile data after the auth state is updated
          setTimeout(async () => {
            try {
              const { data: profile } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', session.user.id)
                .maybeSingle();
                
              if (mounted && profile) {
                setUser(prev => ({
                  ...prev!,
                  role: profile.role as UserRole,
                  full_name: profile.full_name,
                  created_at: profile.created_at,
                  updated_at: profile.updated_at
                }));
              }
            } catch (error) {
              console.error("Error fetching user profile in timeout:", error);
            } finally {
              if (mounted) {
                setLoading(false);
              }
            }
          }, 0);
        }
      } else if (event === 'SIGNED_OUT') {
        if (mounted) {
          setUser(null);
          setLoading(false);
        }
      }
    });
    
    // Then check for existing session
    const checkSession = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        
        // Only proceed if component is still mounted
        if (!mounted) return;
        
        if (session) {
          try {
            // Set basic user data immediately from session
            setUser({
              id: session.user.id,
              email: session.user.email!,
              role: 'parent' as UserRole,
              full_name: session.user.user_metadata.full_name,
              created_at: session.user.created_at,
              updated_at: session.user.created_at
            });
            
            // Then fetch profile data separately
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .maybeSingle();

            if (mounted && profile) {
              setUser(prev => ({
                ...prev!,
                role: profile.role as UserRole,
                full_name: profile.full_name,
                created_at: profile.created_at,
                updated_at: profile.updated_at
              }));
            }
          } catch (error) {
            console.error("Error fetching user profile:", error);
          }
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
  }, [navigate, isAuthPage]);

  const signOut = async () => {
    try {
      await supabase.auth.signOut();
      setUser(null);
      navigate('/login');
      toast.success('Sesión cerrada exitosamente');
    } catch (error: any) {
      toast.error('Error al cerrar sesión');
    }
  };

  return { user, loading, signOut };
}

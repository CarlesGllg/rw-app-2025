
import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { supabase } from '@/lib/supabase'; // Updated import path
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
  
  // Prevent redirect on auth pages
  const isAuthPage = location.pathname === '/login' || 
                     location.pathname === '/verificar' || 
                     location.pathname === '/';

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          role: 'parent' as UserRole, // Cast to UserRole type
          full_name: session.user.user_metadata.full_name,
          created_at: session.user.created_at,
          updated_at: session.user.created_at
        };
        setUser(userData);
      }
      setLoading(false);
    });

    // Listen for changes on auth state
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        // Fetch profile data
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .maybeSingle();

        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          ...(profile ? {
            role: profile.role as UserRole, // Cast string to UserRole type
            full_name: profile.full_name,
            created_at: profile.created_at,
            updated_at: profile.updated_at
          } : {
            role: 'parent' as UserRole, // Cast to UserRole type
            full_name: session.user.user_metadata.full_name,
            created_at: session.user.created_at,
            updated_at: session.user.created_at
          })
        };
        
        setUser(userData);
      } else {
        setUser(null);
        // Only redirect to login if not already on an auth page
        if (!isAuthPage) {
          navigate('/login');
        }
      }
      setLoading(false);
    });

    return () => {
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

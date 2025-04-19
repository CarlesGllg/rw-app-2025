
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
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

  useEffect(() => {
    // Check active sessions and sets the user
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        const userData: User = {
          id: session.user.id,
          email: session.user.email!,
          role: 'parent' as UserRole,
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
          ...(profile ? profile : {
            role: 'parent' as UserRole,
            full_name: session.user.user_metadata.full_name,
            created_at: session.user.created_at,
            updated_at: session.user.created_at
          })
        };
        
        setUser(userData);
      } else {
        setUser(null);
        navigate('/login');
      }
      setLoading(false);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

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

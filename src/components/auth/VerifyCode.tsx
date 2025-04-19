
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

type VerifyCodeProps = {
  email: string;
};

const VerifyCode = ({ email }: VerifyCodeProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    // Listen for auth state changes from magic link
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'SIGNED_IN' && session) {
        // Fetch profile data after sign in
        const { data: profile, error: profileError } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        if (profileError) {
          toast.error("Error al cargar el perfil");
          return;
        }

        toast.success("Acceso exitoso");
        navigate("/dashboard");
      }
    });

    return () => {
      subscription.unsubscribe();
    };
  }, [navigate]);

  useEffect(() => {
    if (timeLeft === 0) return;
    
    const timer = setTimeout(() => {
      setTimeLeft(timeLeft - 1);
    }, 1000);
    
    return () => clearTimeout(timer);
  }, [timeLeft]);

  const resendCode = async () => {
    setIsLoading(true);
    try {
      // Get the current URL for the redirect
      const siteUrl = window.location.origin;
      
      const { error } = await supabase.auth.signInWithOtp({
        email,
        options: {
          emailRedirectTo: `${siteUrl}/verificar`
        }
      });
      
      if (error) throw error;
      
      setTimeLeft(60);
      toast.success("Nuevo enlace enviado a " + email);
    } catch (error: any) {
      toast.error(error.message || "Error al reenviar el enlace");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="space-y-2">
        <div className="text-sm text-center mb-4">
          Hemos enviado un enlace de verificación a 
          <span className="font-medium"> {email}</span>
        </div>
        
        <div className="text-center mt-4">
          <p className="text-sm text-gray-500 mb-2">
            Por favor revisa tu correo y haz clic en el enlace enviado
          </p>
          
          <span className="text-sm text-gray-500">
            {timeLeft > 0 ? (
              <>Reenviar en {timeLeft}s</>
            ) : (
              <button
                type="button" 
                onClick={resendCode}
                className="text-ios-blue hover:underline"
                disabled={isLoading}
              >
                Reenviar enlace
              </button>
            )}
          </span>
        </div>
      </div>
    </div>
  );
};

export default VerifyCode;

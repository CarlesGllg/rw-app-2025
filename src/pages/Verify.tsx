
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VerifyCode from "@/components/auth/VerifyCode";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [isVerifying, setIsVerifying] = useState(false);
  const email = location.state?.email;
  const { t } = useTranslation();
  
  useEffect(() => {
    if (!email && !location.hash) {
      navigate("/");
    }
  }, [email, navigate, location.hash]);

  // Handle verification from email link
  useEffect(() => {
    if (isVerifying) return; // Prevent multiple verification attempts
    
    // Comprueba si hay un token hash en la URL (cuando se regresa desde el correo electrónico)
    const handleEmailRedirect = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      
      if (accessToken && refreshToken) {
        setIsVerifying(true);
        try {
          // Set the session manually from the URL parameters
          const { error } = await supabase.auth.setSession({
            access_token: accessToken,
            refresh_token: refreshToken
          });
          
          if (error) {
            console.error("Error setting session:", error);
            toast.error("Error al verificar tu cuenta");
            return;
          }
          
          toast.success("Verificación exitosa");
          navigate("/dashboard");
        } catch (error) {
          console.error("Error during verification:", error);
          toast.error("Error al verificar tu cuenta");
        }
      }
    };
    
    if (location.hash) {
      handleEmailRedirect();
    }
  }, [location.hash, navigate, isVerifying]);

  return (
    <div className="min-h-screen flex flex-col bg-ios-gray">
      <header className="py-8 px-6">
        <div className="max-w-sm mx-auto flex items-center">
          <Button 
            variant="ghost" 
            size="icon"
            className="mr-2"
            onClick={() => navigate("/")}
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          
          <h1 className="text-xl font-bold text-ios-darkText">
            {t('auth.verification')}
          </h1>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-ios-darkText">
              {t('auth.verification')}
            </h2>
            <p className="text-gray-500 mt-1">
              {t('auth.verificationSubtitle')}
            </p>
          </div>
          
          {email && <VerifyCode email={email} />}
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              {t('auth.verificationHelp')}
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>{t('footer.copyright')}</p>
      </footer>
    </div>
  );
};

export default Verify;

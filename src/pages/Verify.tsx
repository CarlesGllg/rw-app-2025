
import { useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import VerifyCode from "@/components/auth/VerifyCode";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

const Verify = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const email = location.state?.email;
  
  useEffect(() => {
    if (!email) {
      navigate("/");
    }
  }, [email, navigate]);

  // Configuración correcta para aceptar y manejar el código de verificación
  useEffect(() => {
    // Comprueba si hay un token hash en la URL (cuando se regresa desde el correo electrónico)
    const handleEmailRedirect = async () => {
      const hashParams = new URLSearchParams(window.location.hash.substring(1));
      const accessToken = hashParams.get("access_token");
      const refreshToken = hashParams.get("refresh_token");
      
      if (accessToken && refreshToken) {
        navigate("/dashboard");
      }
    };
    
    handleEmailRedirect();
  }, [navigate]);

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
            Verificación
          </h1>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-ios-darkText">
              Verificación en 2 pasos
            </h2>
            <p className="text-gray-500 mt-1">
              Por favor ingresa el código enviado
            </p>
          </div>
          
          {email && <VerifyCode email={email} />}
          
          <div className="mt-6 text-center">
            <p className="text-xs text-gray-500">
              Si no has recibido el código, por favor verifica tu carpeta de spam o contacta a soporte
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>&copy; 2025 Colegio App. Todos los derechos reservados.</p>
      </footer>
    </div>
  );
};

export default Verify;

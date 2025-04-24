import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/useAuth";

const Index = () => {
  const navigate = useNavigate();
  const { user, loading } = useAuth();
  
  useEffect(() => {
    if (!loading && user) {
      navigate("/dashboard", { replace: true });
    }
  }, [user, loading, navigate]);
  
  // No renderizamos nada hasta saber si el usuario está autenticado
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  // Solo mostramos la página de inicio si el usuario no está autenticado
  if (!user) {
    return (
      <div className="min-h-screen bg-ios-gray flex flex-col">
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm mx-auto text-center animate-fade-in">
            {/* Nuevo logo rectángulo */}
            <div className="mb-8">
              <div className="h-24 w-64 mx-auto flex items-center justify-center">
                <img src="/logo_rect.jpg" alt="Logo" className="w-full object-contain" /> {/* Logo rectangular */}
              </div>
            </div>

            <p className="text-gray-600 mb-8">
              Portal de comunicación para padres de familia
            </p>
            
            <Button 
              className="ios-button w-full mb-4"
              onClick={() => navigate("/login")}
            >
              Iniciar Sesión
            </Button>
            
            <p className="text-sm text-gray-500">
              Para obtener acceso, por favor contacta a la administración escolar
            </p>
          </div>
        </main>
        
        <footer className="py-4 text-center text-sm text-gray-500">
          <p>&copy; 2025 Right Way English School. Todos los derechos reservados.</p>
        </footer>
      </div>
    );
  }
  
  return null; // Nunca se renderiza porque redirigimos a los usuarios autenticados
};

export default Index;

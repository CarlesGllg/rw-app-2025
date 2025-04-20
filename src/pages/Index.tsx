
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
  
  // Don't render anything until we know if the user is authenticated
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }
  
  // Only show the landing page if the user is not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-ios-gray flex flex-col">
        <main className="flex-1 flex items-center justify-center p-6">
          <div className="w-full max-w-sm mx-auto text-center animate-fade-in">
            <div className="mb-8">
              <div className="h-24 w-24 bg-ios-blue rounded-3xl mx-auto flex items-center justify-center">
                <span className="text-white text-4xl font-bold">CA</span>
              </div>
            </div>
            
            <h1 className="text-3xl font-bold text-ios-darkText mb-2">
              Colegio App
            </h1>
            
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
          <p>&copy; 2025 Colegio App. Todos los derechos reservados.</p>
        </footer>
      </div>
    );
  }
  
  return null; // This will never render because we redirect authenticated users
};

export default Index;

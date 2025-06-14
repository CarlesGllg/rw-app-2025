
import { Link } from "react-router-dom";
import LoginForm from "@/components/auth/LoginForm";
import { Button } from "@/components/ui/button";

const Login = () => {
  return (
    <div className="min-h-screen flex flex-col bg-ios-gray">
      <header className="py-8 px-6">
        <div className="max-w-sm mx-auto">
          {/* Aquí cambiamos el texto por la imagen */}
          <img
            src="/logo_txt_transp.png" // Asegúrate de que la imagen esté en el directorio raíz
            alt="Right Way English School"
            className="mx-auto" // Esto centra la imagen
          />
          <p className="text-center text-gray-500 mt-1">Portal para Padres</p>
        </div>
      </header>
      
      <main className="flex-1 flex items-center justify-center p-6">
        <div className="w-full max-w-sm bg-white rounded-2xl shadow-sm p-8 animate-fade-in">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-ios-darkText">Bienvenido</h2>
            <p className="text-gray-500 mt-1">
              Inicia sesión para continuar
            </p>
          </div>
          
          <LoginForm />
          
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              ¿No tienes una cuenta? Contacta a la administración escolar
            </p>
          </div>
        </div>
      </main>
      
      <footer className="py-4 text-center text-sm text-gray-500">
        <p>&copy; 2025 Right Way English School. Todos los derechos reservados.</p>
      </footer> 
    </div> 
  ); 
};

export default Login;

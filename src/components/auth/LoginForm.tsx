
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";

const LoginForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fullName, setFullName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const siteUrl = window.location.origin;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (isLogin) {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;

        navigate("/dashboard");
        toast.success("¡Bienvenido de nuevo!");
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${siteUrl}/verificar`,
          },
        });

        if (error) throw error;

        navigate("/verificar", { state: { email } });
        toast.success("Por favor revisa tu correo para verificar tu cuenta");
      }
    } catch (error: any) {
      toast.error(error.message || "Error en la autenticación");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 animate-fade-in">
      <div className="space-y-4">
        {!isLogin && (
          <div className="space-y-2">
            <Label htmlFor="fullName" className="text-sm font-medium text-gray-700">
              Nombre Completo
            </Label>
            <div className="relative flex items-center">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ios-blue text-sm"
                placeholder="Tu nombre completo"
                required={!isLogin}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            Correo Electrónico
          </Label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ios-blue text-sm"
              placeholder="tu@correo.com"
              required
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            Contraseña
          </Label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ios-blue text-sm"
              placeholder="Tu contraseña"
              required
              minLength={6}
            />
          </div>
        </div>
      </div>

      <Button 
        type="submit" 
        className="ios-button w-full flex items-center justify-center gap-2"
        disabled={isLoading}
      >
        {isLoading ? (
          <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
        ) : (
          <>
            <Lock className="h-4 w-4" />
            {isLogin ? "Iniciar Sesión" : "Crear Cuenta"}
          </>
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-ios-blue hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? "¿No tienes cuenta? Regístrate" : "¿Ya tienes cuenta? Inicia sesión"}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;


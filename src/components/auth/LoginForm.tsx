
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { Lock, Mail, User } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useTranslation } from "react-i18next";

const LoginForm = () => {
  const { t } = useTranslation();
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
        console.log('Attempting login for:', email);
        
        const { data, error } = await supabase.auth.signInWithPassword({
          email: email.trim(),
          password,
        });

        if (error) {
          console.error('Login error:', error);
          if (error.message.includes('Invalid login credentials')) {
            toast.error("Credenciales incorrectas. Verifica tu email y contraseña.");
          } else if (error.message.includes('Email not confirmed')) {
            toast.error("Por favor verifica tu correo electrónico antes de iniciar sesión.");
          } else {
            toast.error(error.message || "Error al iniciar sesión");
          }
          return;
        }

        console.log('Login successful for:', data.user?.email);
        navigate("/dashboard");
        toast.success("¡Bienvenido de nuevo!");
      } else {
        // Verificar si el correo está permitido
        const { data, error: fetchError } = await supabase
          .from("allowed_emails")
          .select("email")
          .eq("email", email.trim())
          .single();

        if (fetchError || !data) {
          toast.error("Tu correo no está registrado. Por favor, contacta con la escuela.");
          return;
        }

        // Si el correo está permitido, continuar el registro
        const { error } = await supabase.auth.signUp({
          email: email.trim(),
          password,
          options: {
            data: {
              full_name: fullName,
            },
            emailRedirectTo: `${siteUrl}/verificar`,
          },
        });

        if (error) {
          console.error('Signup error:', error);
          if (error.message.includes('User already registered')) {
            toast.error("Este correo ya está registrado. Intenta iniciar sesión.");
          } else {
            toast.error(error.message || "Error en el registro");
          }
          return;
        }

        navigate("/verificar", { state: { email } });
        toast.success("Por favor revisa tu correo para verificar tu cuenta");
      }
    } catch (error: any) {
      console.error('Auth error:', error);
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
              {t('auth.fullName')}
            </Label>
            <div className="relative flex items-center">
              <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                className="w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ios-blue text-sm"
                placeholder={t('auth.fullNamePlaceholder')}
                required={!isLogin}
              />
            </div>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium text-gray-700">
            {t('auth.email')}
          </Label>
          <div className="relative flex items-center">
            <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ios-blue text-sm"
              placeholder={t('auth.emailPlaceholder')}
              required
              autoComplete="email"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium text-gray-700">
            {t('auth.password')}
          </Label>
          <div className="relative flex items-center">
            <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full pl-10 py-2 pr-4 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-ios-blue text-sm"
              placeholder={t('auth.passwordPlaceholder')}
              required
              minLength={6}
              autoComplete={isLogin ? "current-password" : "new-password"}
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
            {isLogin ? t('auth.login') : t('auth.createAccount')}
          </>
        )}
      </Button>

      <div className="text-center">
        <button
          type="button"
          className="text-sm text-ios-blue hover:underline"
          onClick={() => setIsLogin(!isLogin)}
        >
          {isLogin ? t('auth.noAccountRegister') : t('auth.hasAccountLogin')}
        </button>
      </div>
    </form>
  );
};

export default LoginForm;

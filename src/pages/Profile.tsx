
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Separator } from "@/components/ui/separator";
import { Bell, HelpCircle, Lock, Mail, Settings, User as UserIcon } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";
import { toast } from "sonner";

const Profile = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  useEffect(() => {
    const userData = localStorage.getItem("user");
    if (userData) {
      setUser(JSON.parse(userData));
    } else {
      navigate("/");
    }
  }, [navigate]);

  if (!user) {
    return null;
  }

  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(
      notificationsEnabled 
        ? "Notificaciones desactivadas" 
        : "Notificaciones activadas"
    );
  };

  return (
    <AppLayout title="Perfil">
      <div className="space-y-6">
        {/* Profile Header */}
        <section className="ios-card p-6 flex flex-col items-center text-center">
          <div className="mb-4">
            <UserAvatar name={user.name} role={user.role} size="lg" />
          </div>
          
          <h2 className="text-xl font-bold">{user.name}</h2>
          <p className="text-gray-500">{user.email}</p>
          
          <div className="mt-4">
            <Button className="ios-button">Actualizar Perfil</Button>
          </div>
        </section>

        {/* Settings Section */}
        <section className="ios-card divide-y">
          <div className="p-4">
            <h3 className="font-semibold mb-1">Ajustes</h3>
            <p className="text-sm text-gray-500">Personaliza tu experiencia</p>
          </div>

          {/* Notification Settings */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 flex items-center justify-center bg-ios-blue/10 text-ios-blue rounded-full">
                <Bell className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">Notificaciones</p>
                <p className="text-sm text-gray-500">Recibe alertas importantes</p>
              </div>
            </div>
            
            <Switch 
              checked={notificationsEnabled}
              onCheckedChange={toggleNotifications}
            />
          </div>

          {/* Privacy Settings */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 flex items-center justify-center bg-ios-blue/10 text-ios-blue rounded-full">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">Privacidad y Seguridad</p>
                <p className="text-sm text-gray-500">Contraseña y datos personales</p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </section>

        {/* Support Section */}
        <section className="ios-card">
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 flex items-center justify-center bg-ios-blue/10 text-ios-blue rounded-full">
                <HelpCircle className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">Ayuda y Soporte</p>
                <p className="text-sm text-gray-500">Centro de ayuda y preguntas frecuentes</p>
              </div>
            </div>
            
            <Button variant="ghost" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
          </div>
        </section>
        
        {/* Footer Actions */}
        <div className="py-4">
          <Button 
            variant="outline" 
            className="w-full flex justify-center gap-2 text-red-500 border-red-200 hover:bg-red-50"
            onClick={handleLogout}
          >
            <Lock className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
        
        <div className="text-center text-xs text-gray-500 py-4">
          <p>Versión 1.0.0</p>
          <p>&copy; 2025 Colegio App. Todos los derechos reservados.</p>
        </div>
      </div>
    </AppLayout>
  );
};

export default Profile;

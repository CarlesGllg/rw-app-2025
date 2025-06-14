import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, HelpCircle, Lock, Settings, User as UserIcon } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";
import StudentList from "@/components/dashboard/StudentList";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

type Student = {
  id: string;
  first_name: string;
  last_name1: string;
};

const Profile = () => {
  const navigate = useNavigate();
  const { user, signOut, loading: authLoading } = useAuth();
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const [isPasswordDialogOpen, setIsPasswordDialogOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  const [passwordLoading, setPasswordLoading] = useState(false);

  console.log('Profile - Auth loading:', authLoading, 'User:', user);

  useEffect(() => {
    if (authLoading) {
      console.log('Profile - Still loading auth...');
      return;
    }
    
    if (!user) {
      console.log('Profile - No user, redirecting to login');
      navigate("/login");
      return;
    }
    
    console.log('Profile - User found, fetching students');
    fetchStudents();
  }, [user, authLoading, navigate]);

  const fetchStudents = async () => {
    if (!user) return;
    
    try {
      console.log("Fetching students for parent:", user.id);
      
      const { data: studentsData, error } = await supabase
        .from('student_parent')
        .select(`
          students (
            id,
            first_name,
            last_name1
          )
        `)
        .eq('parent_id', user.id);

      if (error) {
        console.error("Error fetching students:", error);
        toast.error("Error al cargar los estudiantes");
        return;
      }

      console.log("Students data:", studentsData);
      
      const studentsList = studentsData
        ?.map(item => item.students)
        .filter(Boolean)
        .flat() as Student[];

      setStudents(studentsList || []);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast.error("Error al cargar los estudiantes");
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
  };

  const toggleNotifications = () => {
    setNotificationsEnabled(!notificationsEnabled);
    toast.success(
      notificationsEnabled 
        ? "Notificaciones desactivadas" 
        : "Notificaciones activadas"
    );
  };

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error("Las contraseñas no coinciden");
      return;
    }

    if (passwordForm.newPassword.length < 6) {
      toast.error("La contraseña debe tener al menos 6 caracteres");
      return;
    }

    setPasswordLoading(true);

    try {
      const { error } = await supabase.auth.updateUser({
        password: passwordForm.newPassword
      });

      if (error) {
        console.error("Error updating password:", error);
        toast.error("Error al cambiar la contraseña");
        return;
      }

      toast.success("Contraseña actualizada exitosamente");
      setIsPasswordDialogOpen(false);
      setPasswordForm({
        currentPassword: "",
        newPassword: "",
        confirmPassword: ""
      });
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error("Error al cambiar la contraseña");
    } finally {
      setPasswordLoading(false);
    }
  };

  // Show loading while auth is still loading
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (!user) {
    return null;
  }

  if (loading) {
    return (
      <AppLayout title="Perfil">
        <div className="flex justify-center items-center h-64">
          <div className="text-gray-500">Cargando perfil...</div>
        </div>
      </AppLayout>
    );
  }

  return (
    <AppLayout title="Perfil">
      <div className="space-y-6">
        {/* Profile Header */}
        <section className="ios-card p-6 flex flex-col items-center text-center">
          <div className="mb-4">
            <UserAvatar name={user.full_name || user.email} role={user.role} size="lg" />
          </div>
          
          <h2 className="text-xl font-bold">{user.full_name || "Usuario"}</h2>
          <p className="text-gray-500">{user.email}</p>
          <p className="text-sm text-gray-400 capitalize">{user.role}</p>
        </section>

        {/* Students Section */}
        <section className="ios-card p-6">
          <h3 className="font-semibold mb-4 flex items-center gap-2">
            <UserIcon className="h-5 w-5" />
            Estudiantes Asociados
          </h3>
          <StudentList students={students} />
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

          {/* Password Change */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 flex items-center justify-center bg-ios-blue/10 text-ios-blue rounded-full">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">Cambiar Contraseña</p>
                <p className="text-sm text-gray-500">Actualiza tu contraseña de acceso</p>
              </div>
            </div>
            
            <Dialog open={isPasswordDialogOpen} onOpenChange={setIsPasswordDialogOpen}>
              <DialogTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-4 w-4" />
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Cambiar Contraseña</DialogTitle>
                </DialogHeader>
                <form onSubmit={handlePasswordChange} className="space-y-4">
                  <div>
                    <Label htmlFor="newPassword">Nueva Contraseña</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, newPassword: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword">Confirmar Nueva Contraseña</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={passwordForm.confirmPassword}
                      onChange={(e) => setPasswordForm(prev => ({ ...prev, confirmPassword: e.target.value }))}
                      required
                      minLength={6}
                    />
                  </div>
                  <div className="flex gap-2 pt-4">
                    <Button
                      type="button"
                      variant="outline"
                      className="flex-1"
                      onClick={() => setIsPasswordDialogOpen(false)}
                    >
                      Cancelar
                    </Button>
                    <Button
                      type="submit"
                      className="flex-1"
                      disabled={passwordLoading}
                    >
                      {passwordLoading ? "Actualizando..." : "Actualizar"}
                    </Button>
                  </div>
                </form>
              </DialogContent>
            </Dialog>
          </div>

          {/* Privacy Settings */}
          <div className="p-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span className="h-9 w-9 flex items-center justify-center bg-ios-blue/10 text-ios-blue rounded-full">
                <Lock className="h-5 w-5" />
              </span>
              <div>
                <p className="font-medium">Privacidad y Seguridad</p>
                <p className="text-sm text-gray-500">Configuración de privacidad</p>
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

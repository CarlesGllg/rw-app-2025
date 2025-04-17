
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, FileText } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";

const Dashboard = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<any>(null);
  
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
  
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM yyyy", { locale: es });
  
  // Capitalize first letter
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);
  
  return (
    <AppLayout title="Inicio">
      <div className="space-y-6">
        {/* Welcome Section */}
        <section className="ios-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-ios-darkText">
                Hola, {user.name.split(" ")[0]}
              </h2>
              <p className="text-gray-500 mt-1">{capitalizedDate}</p>
            </div>
            
            <UserAvatar 
              name={user.name} 
              role={user.role} 
              showRole={true} 
            />
          </div>
          
          {user.children && user.children.length > 0 && (
            <div className="mt-6">
              <h3 className="font-medium text-gray-700 mb-3">Estudiantes:</h3>
              <div className="space-y-2">
                {user.children.map((child: any, index: number) => (
                  <div key={index} className="flex justify-between bg-gray-50 p-3 rounded-lg">
                    <span>{child.name}</span>
                    <span className="text-gray-500">{child.grade}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </section>
        
        {/* Quick Actions */}
        <section>
          <h3 className="font-medium text-gray-700 mb-3">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              onClick={() => navigate("/mensajes")}
            >
              <Bell className="h-6 w-6 text-ios-blue" />
              <span>Mensajes</span>
            </Button>
            
            <Button
              variant="outline" 
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              onClick={() => navigate("/documentos")}
            >
              <FileText className="h-6 w-6 text-ios-blue" />
              <span>Documentos</span>
            </Button>
          </div>
        </section>
        
        {/* Recent Messages */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Mensajes Recientes</h3>
            <Button 
              variant="ghost"
              size="sm"
              className="text-ios-blue"
              onClick={() => navigate("/mensajes")}
            >
              Ver Todos
            </Button>
          </div>
          
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-base">
                Suspensión de clases - 20 Abril
              </CardTitle>
              <CardDescription className="text-xs">
                Dirección Académica • 16 de abril, 2025
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-sm line-clamp-2">
                Estimados padres, les informamos que este viernes 20 de abril se suspenderán las clases debido a una jornada de capacitación docente...
              </p>
              <div className="mt-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-ios-blue hover:text-ios-blue hover:bg-ios-blue/10"
                  onClick={() => navigate("/mensajes")}
                >
                  Leer más
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>
        
        {/* School Calendar Preview */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Próximos Eventos</h3>
          </div>
          
          <div className="space-y-2">
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
              <div className="h-12 w-12 flex flex-col items-center justify-center bg-ios-blue/10 text-ios-blue rounded-lg">
                <span className="text-xs">ABR</span>
                <span className="font-bold">20</span>
              </div>
              <div>
                <h4 className="font-medium">Suspensión de clases</h4>
                <p className="text-xs text-gray-500">Jornada de capacitación docente</p>
              </div>
            </div>
            
            <div className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
              <div className="h-12 w-12 flex flex-col items-center justify-center bg-ios-blue/10 text-ios-blue rounded-lg">
                <span className="text-xs">MAY</span>
                <span className="font-bold">10</span>
              </div>
              <div>
                <h4 className="font-medium">Día de las Madres</h4>
                <p className="text-xs text-gray-500">Programa especial - 10:00 AM</p>
              </div>
            </div>
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, Calendar, FileText } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]); // Aquí almacenamos los estudiantes vinculados

  // Formatear la fecha actual en español
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM yyyy", { locale: es });

  // Capitalizar la primera letra
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  useEffect(() => {
    const fetchStudents = async () => {
      if (user) {
        // Hacer una consulta a la tabla student_parent para obtener los estudiantes vinculados al padre
        const { data, error } = await supabase
          .from("student_parent")
          .select("student_id") // Seleccionamos los IDs de los estudiantes asociados
          .eq("parent_id", user.id); // Filtramos por el parent_id del usuario autenticado

        if (error) {
          console.error("Error fetching student-parent data:", error.message);
        } else {
          // Obtener los estudiantes basados en los IDs de la consulta anterior
          const studentIds = data.map((row: any) => row.student_id);

          if (studentIds.length > 0) {
            const { data: studentData, error: studentError } = await supabase
              .from("students")
              .select("id, first_name") // Seleccionamos el nombre de los estudiantes
              .in("id", studentIds); // Filtramos por los IDs de los estudiantes

            if (studentError) {
              console.error("Error fetching students:", studentError.message);
            } else {
              setStudents(studentData); // Asignamos los estudiantes a la variable de estado
            }
          } else {
            setStudents([]); // Si no hay estudiantes, vaciamos el estado
          }
        }
      }
    };

    fetchStudents();
  }, [user]);

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  return (
    <AppLayout title="Inicio">
      <div className="space-y-6">
        {/* Sección de Bienvenida */}
        <section className="ios-card p-6">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div>
              <h2 className="text-2xl font-bold text-ios-darkText">
                Hola, {user.full_name?.split(" ")[0] || 'Usuario'}
              </h2>
              <p className="text-gray-500 mt-1">{capitalizedDate}</p>
            </div>

            <UserAvatar
              name={user.full_name || 'Usuario'}
              role={user.role || 'parent'}
              showRole={true}
            />
          </div>

          {/* Mostrar los estudiantes vinculados */}
          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3">Estudiantes:</h3>
            {students.length > 0 ? (
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                    {student.first_name} {/* Mostrar el nombre del estudiante */}
                  </div>
                ))}
              </div>
            ) : (
              <div className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                No hay estudiantes vinculados a este perfil
              </div>
            )}
          </div>
        </section>

        {/* Acciones rápidas */}
        <section>
          <h3 className="font-medium text-gray-700 mb-3">Acciones Rápidas</h3>
          <div className="grid grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              onClick={() => navigate("/messages")}
            >
              <Bell className="h-6 w-6 text-ios-blue" />
              <span>Mensajes</span>
            </Button>

            <Button
              variant="outline"
              className="h-auto py-4 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl hover:bg-gray-50"
              onClick={() => navigate("/documents")}
            >
              <FileText className="h-6 w-6 text-ios-blue" />
              <span>Documentos</span>
            </Button>
          </div>
        </section>

        {/* Mensajes recientes */}
        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Mensajes Recientes</h3>
            <Button
              variant="ghost"
              size="sm"
              className="text-ios-blue"
              onClick={() => navigate("/messages")}
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
                  onClick={() => navigate("/messages")}
                >
                  Leer más
                </Button>
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Vista previa del calendario escolar */}
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

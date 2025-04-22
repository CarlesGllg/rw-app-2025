import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Bell, FileText } from "lucide-react";
import UserAvatar from "@/components/ui/UserAvatar";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { useAuth } from "@/hooks/useAuth";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import MessageCard from "@/components/messages/MessageCard";
import { Event } from "@/types/database";

type RecentMessage = {
  id: string;
  title: string;
  content: string;
  date: string;
  sender: string;
  priority: "low" | "medium" | "high";
  student_id: string;
  student_first_name: string;
  student_last_name1: string;
  read: boolean;
};

const Dashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM yyyy", { locale: es });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  useEffect(() => {
    const fetchRecentMessages = async () => {
      if (!user) return;

      try {
        const { data: studentData } = await supabase
          .from("student_parent")
          .select("student_id")
          .eq("parent_id", user.id);

        if (!studentData?.length) return;

        const studentIds = studentData.map(row => row.student_id);

        const { data: messageLinks } = await supabase
          .from("message_student")
          .select(`
            message_id,
            read,
            student_id,
            students!inner (
              first_name,
              last_name1
            )
          `)
          .in("student_id", studentIds)
          .order("created_at", { ascending: false })
          .limit(3);

        if (!messageLinks?.length) return;

        const messageIds = messageLinks.map(link => link.message_id);

        const { data: messages } = await supabase
          .from("messages")
          .select("*")
          .in("id", messageIds)
          .order("date", { ascending: false });

        if (messages) {
          const formattedMessages = messages.map(message => {
            const messageLink = messageLinks.find(link => link.message_id === message.id);
            return {
              ...message,
              student_id: messageLink?.student_id || "",
              student_first_name: messageLink?.students.first_name || "",
              student_last_name1: messageLink?.students.last_name1 || "",
              read: messageLink?.read || false,
            };
          });
          setRecentMessages(formattedMessages);
        }
      } catch (error) {
        console.error("Error fetching recent messages:", error);
      }
    };

    fetchRecentMessages();
  }, [user]);

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const { data: events, error } = await supabase
          .from("events")
          .select("*")
          .order("start_date", { ascending: true })
          .limit(3);

        if (error) throw error;
        if (events) setEvents(events);
      } catch (error) {
        console.error("Error fetching events:", error);
      }
    };

    fetchEvents();
  }, []);

  useEffect(() => {
    const fetchStudents = async () => {
      if (user) {
        const { data, error } = await supabase
          .from("student_parent")
          .select("student_id")
          .eq("parent_id", user.id);

        if (error) {
          console.error("Error fetching student-parent data:", error.message);
        } else {
          const studentIds = data.map((row: any) => row.student_id);

          if (studentIds.length > 0) {
            const { data: studentData, error: studentError } = await supabase
              .from("students")
              .select("id, first_name, last_name1")
              .in("id", studentIds);

            if (studentError) {
              console.error("Error fetching students:", studentError.message);
            } else {
              setStudents(studentData);
            }
          } else {
            setStudents([]);
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

  const handleMarkAsRead = async (messageId: string, studentId: string) => {
    try {
      await supabase
        .from("message_student")
        .update({ read: true })
        .eq("message_id", messageId)
        .eq("student_id", studentId);

      setRecentMessages(prevMessages =>
        prevMessages.map(msg =>
          msg.id === messageId ? { ...msg, read: true } : msg
        )
      );
    } catch (error) {
      console.error("Error marking message as read:", error);
    }
  };

  return (
    <AppLayout title="Inicio">
      <div className="space-y-6">
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

          <div className="mt-6">
            <h3 className="font-medium text-gray-700 mb-3">Estudiantes:</h3>
            {students.length > 0 ? (
              <div className="space-y-2">
                {students.map((student) => (
                  <div key={student.id} className="p-4 bg-gray-50 rounded-lg text-center text-gray-500">
                    {student.first_name} {student.last_name1}
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

          {recentMessages.length > 0 ? (
            <div className="space-y-4">
              {recentMessages.map((message) => (
                <MessageCard
                  key={message.id}
                  message={message}
                  onMarkAsRead={handleMarkAsRead}
                />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="py-6 text-center text-gray-500">
                No hay mensajes recientes
              </CardContent>
            </Card>
          )}
        </section>

        <section>
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-medium text-gray-700">Próximos Eventos</h3>
          </div>

          <div className="space-y-2">
            {events.length > 0 ? (
              events.map((event) => (
                <div key={event.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
                  <div className="h-12 w-12 flex flex-col items-center justify-center bg-ios-blue/10 text-ios-blue rounded-lg">
                    <span className="text-xs">{format(new Date(event.start_date), "MMM", { locale: es }).toUpperCase()}</span>
                    <span className="font-bold">{format(new Date(event.start_date), "d")}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{event.title}</h4>
                    <p className="text-xs text-gray-500">{event.description}</p>
                  </div>
                </div>
              ))
            ) : (
              <Card>
                <CardContent className="py-6 text-center text-gray-500">
                  No hay eventos próximos
                </CardContent>
              </Card>
            )}
          </div>
        </section>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

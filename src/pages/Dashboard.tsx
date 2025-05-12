import React, { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentMessages from "@/components/dashboard/RecentMessages";
import StudentList from "@/components/dashboard/StudentList";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import AppLayout from "@/components/layout/AppLayout";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Event } from "@/types/database";

const Dashboard = () => {
  const { user } = useAuth();
  const [messages, setMessages] = useState([]);
  const [students, setStudents] = useState([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(new Event("resize"));
    }
  }, []);

  useEffect(() => {
    const fetchDashboardData = async () => {
      if (!user) return;

      setLoading(true);
      try {
        const { data: studentParentData, error: studentParentError } = await supabase
          .from("student_parent")
          .select("student_id")
          .eq("parent_id", user.id);

        if (studentParentError) {
          console.error("Error obteniendo relaciones padre-estudiante:", studentParentError);
          return;
        }

        if (studentParentData?.length) {
          const studentIds = studentParentData.map(sp => sp.student_id);

          const { data: studentsData, error: studentsError } = await supabase
            .from("students")
            .select("*")
            .in("id", studentIds);

          if (studentsError) {
            console.error("Error obteniendo estudiantes:", studentsError);
          } else {
            setStudents(studentsData || []);
          }

          const { data: messagesData, error: messagesError } = await supabase
            .from("message_student")
            .select(`
              id,
              message_id,
              student_id,
              read,
              messages:message_id(id, title, content, date, priority, sender),
              students:student_id(
                id,
                first_name,
                last_name1,
                student_course(
                  courses(name)
                )
              )
            `)
            .in("student_id", studentIds)
            .order("created_at", { ascending: false })
            .limit(5);

          if (messagesError) {
            console.error("Error obteniendo mensajes:", messagesError);
          } else if (messagesData) {
            const formattedMessages = messagesData.map(item => {
              const courseName = item.students?.student_course?.[0]?.courses?.name || null;

              return {
                id: item.id,
                message_id: item.message_id,
                title: item.messages.title,
                content: item.messages.content,
                date: item.messages.date,
                sender: item.messages.sender,
                priority: item.messages.priority,
                student_id: item.student_id,
                student_first_name: item.students.first_name,
                student_last_name1: item.students.last_name1,
                read: item.read,
                course_name: courseName, // Añadido
              };
            });

            setMessages(formattedMessages);
          }
        }

        const today = new Date().toISOString().split("T")[0]; // YYYY-MM-DD

        const { data: eventsData, error: eventsError } = await supabase
          .from("events")
          .select("*")
          .gte("start_date", today)
          .order("start_date", { ascending: true });


        if (eventsError) {
          console.error("Error obteniendo eventos:", eventsError);
        } else {
          const uniqueEvents = eventsData.filter(
            (event, index, self) => index === self.findIndex((e) => e.id === event.id)
          );
          setEvents(uniqueEvents);
        }

      } catch (error) {
        console.error("Error general en dashboard:", error);
        toast.error("Hubo un error al cargar el panel.");
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [user]);

  const handleMarkAsRead = async (messageId: string, studentId: string) => {
    try {
      await supabase
        .from("message_student")
        .update({ read: true })
        .eq("message_id", messageId)
        .eq("student_id", studentId);

      setMessages(prev =>
        prev.map(msg =>
          msg.message_id === messageId && msg.student_id === studentId
            ? { ...msg, read: true }
            : msg
        )
      );

      toast.success("Mensaje marcado como leído");
    } catch (error) {
      console.error("Error al marcar mensaje como leído:", error);
      toast.error("Error al marcar como leído");
    }
  };

  return (
    <AppLayout title="Dashboard">
      <div className="p-6 space-y-6">
        <WelcomeHeader user={user} />
        <StudentList students={students} />
        <div className="space-y-6">
          <QuickActions />
          <RecentMessages
            messages={messages}
            onMarkAsRead={handleMarkAsRead}
          />
          <UpcomingEvents events={events} />
        </div>
      </div>
    </AppLayout>
  );
};

export default Dashboard;

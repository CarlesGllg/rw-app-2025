
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

        console.log("Student parent data:", studentParentData);

        if (studentParentData?.length) {
          const studentIds = studentParentData.map(sp => sp.student_id);
          console.log("Student IDs:", studentIds);

          const { data: studentsData, error: studentsError } = await supabase
            .from("students")
            .select("*")
            .in("id", studentIds);

          if (studentsError) {
            console.error("Error obteniendo estudiantes:", studentsError);
          } else {
            setStudents(studentsData || []);
          }

          // Updated query to properly get course information
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
                last_name1
              )
            `)
            .in("student_id", studentIds)
            .order("created_at", { ascending: false })
            .limit(5);

          if (messagesError) {
            console.error("Error obteniendo mensajes:", messagesError);
          } else if (messagesData) {
            // Get course information separately for each student
            const { data: studentCourseData, error: studentCourseError } = await supabase
              .from("student_course")
              .select(`
                student_id,
                courses:course_id(name)
              `)
              .in("student_id", studentIds);

            if (studentCourseError) {
              console.error("Error obteniendo cursos:", studentCourseError);
            }

            // Obtener adjuntos para los mensajes
            const messageIds = messagesData.map(item => item.message_id);
            const { data: attachmentsData, error: attachmentsError } = await supabase
              .from("message_attachments")
              .select("*")
              .in("message_id", messageIds);

            if (attachmentsError) {
              console.error("Error obteniendo adjuntos:", attachmentsError);
            }

            const formattedMessages = messagesData.map(item => {
              // Get course name for the student
              const studentCourse = studentCourseData?.find(sc => sc.student_id === item.student_id);
              const courseName = studentCourse?.courses?.name || null;
              const messageAttachments = attachmentsData?.filter(att => att.message_id === item.message_id) || [];

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
                course_name: courseName,
                attachments: messageAttachments,
              };
            });

            setMessages(formattedMessages);
          }

          // Fetch events related to the students' schools
          const today = new Date().toISOString().split("T")[0];

          // First, get the courses for the students to identify their schools
          const { data: studentCoursesData, error: studentCoursesError } = await supabase
            .from("student_course")
            .select(`
              course_id,
              courses:course_id(
                id,
                school_id
              )
            `)
            .in("student_id", studentIds);

          console.log("Student courses data:", studentCoursesData);

          if (studentCoursesError) {
            console.error("Error obteniendo cursos de estudiantes:", studentCoursesError);
            setEvents([]);
          } else if (studentCoursesData?.length) {
            // Get unique school IDs from the students' courses
            const schoolIds = [...new Set(
              studentCoursesData
                .map(sc => sc.courses?.school_id)
                .filter(Boolean)
            )];

            console.log("School IDs:", schoolIds);

            if (schoolIds.length > 0) {
              // Get events assigned to these schools
              const { data: eventSchoolData, error: eventSchoolError } = await supabase
                .from("event_school")
                .select(`
                  event_id,
                  events:event_id(
                    id,
                    title,
                    description,
                    start_date,
                    created_at,
                    updated_at
                  )
                `)
                .in("school_id", schoolIds);

              console.log("Event school data:", eventSchoolData);

              if (eventSchoolError) {
                console.error("Error obteniendo eventos de escuelas:", eventSchoolError);
                setEvents([]);
              } else if (eventSchoolData?.length) {
                // Filter events that are upcoming and remove duplicates
                const uniqueEvents = new Map();
                
                eventSchoolData.forEach(es => {
                  if (es.events && new Date(es.events.start_date) >= new Date(today)) {
                    uniqueEvents.set(es.events.id, es.events);
                  }
                });

                const upcomingEvents = Array.from(uniqueEvents.values())
                  .sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());

                console.log("Final upcoming events:", upcomingEvents);
                setEvents(upcomingEvents);
              } else {
                console.log("No event school data found");
                setEvents([]);
              }
            } else {
              console.log("No school IDs found");
              setEvents([]);
            }
          } else {
            console.log("No student courses data found");
            setEvents([]);
          }
        } else {
          console.log("No student parent data found");
          setEvents([]);
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


import { useEffect, useState } from "react";
import AppLayout from "@/components/layout/AppLayout";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import WelcomeHeader from "@/components/dashboard/WelcomeHeader";
import StudentList from "@/components/dashboard/StudentList";
import QuickActions from "@/components/dashboard/QuickActions";
import RecentMessages from "@/components/dashboard/RecentMessages";
import UpcomingEvents from "@/components/dashboard/UpcomingEvents";
import type { Event, MessagePriority } from "@/types/database";

type RecentMessage = {
  id: string;
  title: string;
  content: string;
  date: string;
  sender: string;
  priority: MessagePriority;
  student_id: string;
  student_first_name: string;
  student_last_name1: string;
  read: boolean;
};

const Dashboard = () => {
  const { user } = useAuth();
  const [students, setStudents] = useState<any[]>([]);
  const [recentMessages, setRecentMessages] = useState<RecentMessage[]>([]);
  const [events, setEvents] = useState<Event[]>([]);

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
              priority: (message.priority || "medium") as MessagePriority
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
        <WelcomeHeader user={user} />
        <StudentList students={students} />
        <QuickActions />
        <RecentMessages messages={recentMessages} onMarkAsRead={handleMarkAsRead} />
        <UpcomingEvents events={events} />
      </div>
    </AppLayout>
  );
};

export default Dashboard;

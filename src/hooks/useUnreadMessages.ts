
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export const useUnreadMessages = () => {
  const [unreadCount, setUnreadCount] = useState(0);
  const { user } = useAuth();

  useEffect(() => {
    const fetchUnreadCount = async () => {
      if (!user) return;

      try {
        // Obtener los IDs de los estudiantes vinculados al padre
        const { data: studentData } = await supabase
          .from("student_parent")
          .select("student_id")
          .eq("parent_id", user.id);

        if (!studentData?.length) return;

        const studentIds = studentData.map(row => row.student_id);

        // Contar mensajes no leídos para estos estudiantes
        const { count } = await supabase
          .from("message_student")
          .select("*", { count: 'exact', head: true })
          .in("student_id", studentIds)
          .eq("read", false);

        setUnreadCount(count || 0);
      } catch (error) {
        console.error("Error fetching unread messages count:", error);
      }
    };

    fetchUnreadCount();

    // Suscribirse a cambios en message_student
    const channel = supabase
      .channel('message_student_changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'message_student'
        },
        () => {
          fetchUnreadCount();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [user]);

  return unreadCount;
};

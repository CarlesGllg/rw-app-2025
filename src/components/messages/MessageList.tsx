
import { useEffect, useState } from "react";
import MessageCard from "./MessageCard";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { MessageAttachment } from "@/types/database";

type Message = {
  id: string;
  title: string;
  content: string;
  date: string;
  sender: string;
  priority: "low" | "medium" | "high";
  read: boolean;
  student_id: string;
  student_first_name: string;
  student_last_name1: string;
  course_name: string | null;
  attachments: MessageAttachment[];
};

const MessageList = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(true);
  const [parentId, setParentId] = useState<string | null>(null);

  useEffect(() => {
    const getUser = async () => {
      const { data, error } = await supabase.auth.getUser();
      if (error) {
        console.error("Error al obtener usuario:", error.message);
        return;
      }
      setParentId(data.user.id);
    };

    getUser();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!parentId) return;
      setLoading(true);

      try {
        const { data: studentData, error: studentError } = await supabase
          .from("student_parent")
          .select("student_id")
          .eq("parent_id", parentId);

        if (studentError) {
          console.error("Error al obtener estudiantes:", studentError.message);
          setLoading(false);
          return;
        }

        const studentIds = studentData.map((row) => row.student_id);

        if (studentIds.length === 0) {
          setMessages([]);
          setLoading(false);
          return;
        }

        const { data: messageLinks, error: messageError } = await supabase
          .from("message_student")
          .select(`
            read,
            student_id,
            message_id,
            students (
              first_name,
              last_name1
            )
          `)
          .in("student_id", studentIds)
          .order("message_id", { ascending: false });

        if (messageError) {
          console.error("Error al obtener relaciones mensaje-estudiante:", messageError.message);
          setLoading(false);
          return;
        }

        const messageIds = messageLinks.map((link) => link.message_id);

        const { data: allMessagesData, error: allMessagesError } = await supabase
          .from("messages")
          .select("id, title, content, date, sender, priority");

        if (allMessagesError) {
          console.error("Error al obtener mensajes:", allMessagesError.message);
          setLoading(false);
          return;
        }

        // Get course information for students
        const { data: studentCourseData, error: studentCourseError } = await supabase
          .from("student_course")
          .select(`
            student_id,
            courses:course_id(name)
          `)
          .in("student_id", studentIds);

        if (studentCourseError) {
          console.error("Error al obtener cursos:", studentCourseError.message);
        }

        // Enhanced debugging for attachments
        console.log('Fetching attachments for message IDs:', messageIds);
        
        // Obtener adjuntos para todos los mensajes
        const { data: attachmentsData, error: attachmentsError } = await supabase
          .from("message_attachments")
          .select("*")
          .in("message_id", messageIds);

        if (attachmentsError) {
          console.error("Error al obtener adjuntos:", attachmentsError.message);
        }

        console.log("Raw attachments data from DB:", attachmentsData);

        // Check for specific message
        const specificMessageAttachments = attachmentsData?.filter(att => att.message_id === '5f1a3bc3-2b57-4a46-9305-73ba638b1448');
        console.log('Attachments for message 5f1a3bc3-2b57-4a46-9305-73ba638b1448:', specificMessageAttachments);

        const filteredMessages = allMessagesData?.filter((msg) =>
          messageIds.includes(msg.id)
        );

        const formattedMessages: Message[] = messageLinks
          .map((link) => {
            const message = filteredMessages?.find((msg) => msg.id === link.message_id);
            const studentCourse = studentCourseData?.find(sc => sc.student_id === link.student_id);
            const courseName = studentCourse?.courses?.name || null;
            const messageAttachments = attachmentsData?.filter(att => att.message_id === link.message_id) || [];

            console.log(`Processing message ${link.message_id}, found ${messageAttachments.length} attachments`);

            if (message && link.students) {
              const formattedMessage = {
                id: message.id,
                title: message.title,
                content: message.content,
                date: new Date(message.date).toISOString(),
                sender: message.sender,
                priority: message.priority as "low" | "medium" | "high",
                read: link.read,
                student_id: link.student_id,
                student_first_name: link.students.first_name,
                student_last_name1: link.students.last_name1,
                course_name: courseName,
                attachments: messageAttachments,
              };

              // Debug specific message
              if (message.id === '5f1a3bc3-2b57-4a46-9305-73ba638b1448') {
                console.log('=== FORMATTING SPECIFIC MESSAGE ===');
                console.log('Formatted message:', formattedMessage);
                console.log('messageAttachments:', messageAttachments);
                console.log('=== END FORMATTING ===');
              }

              return formattedMessage;
            }
            return null;
          })
          .filter((msg): msg is Message => msg !== null);

        console.log("Final formatted messages:", formattedMessages);
        setMessages(formattedMessages);
      } catch (error) {
        console.error("Error general al cargar los mensajes:", error);
      }

      setLoading(false);
    };

    fetchMessages();
  }, [parentId]);

  const markAsRead = async (id: string, student_id: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id && msg.student_id === student_id ? { ...msg, read: true } : msg
      )
    );

    const { error } = await supabase
      .from("message_student")
      .update({ read: true })
      .eq("message_id", id)
      .eq("student_id", student_id);

    if (error) {
      console.error("Error al marcar como leído:", error.message);
      toast.error("Error al marcar como leído");
      // Revert optimistic update
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id && msg.student_id === student_id ? { ...msg, read: false } : msg
        )
      );
    } else {
      toast.success("Mensaje marcado como leído");
    }
  };

  const markAsUnread = async (id: string, student_id: string) => {
    setMessages((prev) =>
      prev.map((msg) =>
        msg.id === id && msg.student_id === student_id ? { ...msg, read: false } : msg
      )
    );

    const { error } = await supabase
      .from("message_student")
      .update({ read: false })
      .eq("message_id", id)
      .eq("student_id", student_id);

    if (error) {
      console.error("Error al marcar como no leído:", error.message);
      toast.error("Error al marcar como no leído");
      // Revert optimistic update
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === id && msg.student_id === student_id ? { ...msg, read: true } : msg
        )
      );
    } else {
      toast.success("Mensaje marcado como no leído");
    }
  };

  if (loading) {
    return (
      <div className="min-h-[200px] flex justify-center items-center">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    );
  }

  if (messages.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No hay mensajes disponibles</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {messages.map((message) => (
        <MessageCard
          key={`${message.id}-${message.student_id}`}
          message={message}
          onMarkAsRead={() => markAsRead(message.id, message.student_id)}
          onMarkAsUnread={() => markAsUnread(message.id, message.student_id)}
        />
      ))}
    </div>
  );
};

export default MessageList;

import { useEffect, useState } from "react";
import MessageCard from "./MessageCard";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  title: string;
  content: string;
  date: string;
  sender: string;
  priority: "low" | "medium" | "high";
  read: boolean;
  student_id: string;
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
      console.log("Parent ID:", data.user.id);
      setParentId(data.user.id);
    };

    getUser();
  }, []);

  useEffect(() => {
    const fetchMessages = async () => {
      if (!parentId) return;
      setLoading(true);

      try {
        // Obtener estudiantes del padre
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
        console.log("Estudiantes vinculados:", studentIds);

        if (studentIds.length === 0) {
          setMessages([]);
          setLoading(false);
          return;
        }

        // Obtener relaciones mensaje-estudiante
        const { data: messageLinks, error: messageError } = await supabase
          .from("message_student")
          .select("read, student_id, message_id")
          .in("student_id", studentIds)
          .order("message_id", { ascending: false });

        if (messageError) {
          console.error("Error al obtener relaciones mensaje-estudiante:", messageError.message);
          setLoading(false);
          return;
        }

        console.log("messageLinks:", messageLinks);

        const messageIds = messageLinks.map((link) => link.message_id);
        console.log("IDs de mensajes:", messageIds);
        console.log("Tipos de IDs:", messageIds.map((id) => typeof id)); // ← debug extra

        // ✅ Alternativa: obtener TODOS los mensajes y filtrar localmente
        const { data: allMessagesData, error: allMessagesError } = await supabase
          .from("messages")
          .select("id, title, content, date, sender, priority");

        if (allMessagesError) {
          console.error("Error al obtener mensajes:", allMessagesError.message);
          setLoading(false);
          return;
        }

        console.log("Todos los mensajes:", allMessagesData);

        const filteredMessages = allMessagesData?.filter((msg) =>
          messageIds.includes(msg.id)
        );

        console.log("Mensajes filtrados localmente:", filteredMessages);

        // Combinar con datos de lectura
        const formattedMessages: Message[] = messageLinks
          .map((link) => {
            const message = filteredMessages.find((msg) => msg.id === link.message_id);
            if (message) {
              return {
                id: message.id,
                title: message.title,
                content: message.content,
                date: new Date(message.date).toISOString(),
                sender: message.sender,
                priority: message.priority as "low" | "medium" | "high",
                read: link.read,
                student_id: link.student_id,
              };
            }
            return null;
          })
          .filter((msg): msg is Message => msg !== null);

        console.log("Mensajes formateados:", formattedMessages);

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
        />
      ))}
    </div>
  );
};

export default MessageList;

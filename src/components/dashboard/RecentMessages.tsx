
import React, { useState } from "react";
import { ChevronRight, Mail } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { supabase } from "@/lib/supabase";

type Message = {
  id: string;
  message_id: string;
  title: string;
  content: string;
  date: string;
  sender: string;
  priority: "high" | "medium" | "low";
  read: boolean;
  student_id: string;
  student_first_name: string;
  student_last_name1: string;
  course_name: string | null;
  attachments?: any[];
};

type RecentMessagesProps = {
  messages: Message[];
  onMarkAsRead: (messageId: string, studentId: string) => void;
};

const RecentMessages = ({ messages, onMarkAsRead }: RecentMessagesProps) => {
  const [localMessages, setLocalMessages] = useState(messages);

  // Update local state when props change
  React.useEffect(() => {
    setLocalMessages(messages);
  }, [messages]);

  const handleMarkAsUnread = async (messageId: string, studentId: string) => {
    // Optimistic update
    setLocalMessages(prev =>
      prev.map(msg =>
        msg.message_id === messageId && msg.student_id === studentId
          ? { ...msg, read: false }
          : msg
      )
    );

    try {
      await supabase
        .from("message_student")
        .update({ read: false })
        .eq("message_id", messageId)
        .eq("student_id", studentId);

      toast.success("Mensaje marcado como no leído");
    } catch (error) {
      console.error("Error al marcar mensaje como no leído:", error);
      toast.error("Error al marcar como no leído");
      
      // Revert optimistic update
      setLocalMessages(prev =>
        prev.map(msg =>
          msg.message_id === messageId && msg.student_id === studentId
            ? { ...msg, read: true }
            : msg
        )
      );
    }
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-orange-100 text-orange-800 border-orange-200",
    low: "bg-green-100 text-green-800 border-green-200"
  };

  const priorityLabels = {
    high: "Urgente",
    medium: "Importante",
    low: "Informativo"
  };

  if (localMessages.length === 0) {
    return (
      <div className="ios-card">
        <div className="p-6">
          <h2 className="text-xl font-bold text-ios-darkText mb-4">
            Mensajes Recientes
          </h2>
          <p className="text-gray-500 text-center py-8">
            No hay mensajes recientes
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="ios-card">
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold text-ios-darkText">
            Mensajes Recientes
          </h2>
          <a href="/messages" className="text-ios-blue text-sm font-medium">
            Ver todos
          </a>
        </div>

        <div className="space-y-3">
          {localMessages.slice(0, 5).map((message) => {
            const formattedDate = format(
              new Date(message.date),
              "d MMM",
              { locale: es }
            );

            return (
              <div
                key={`${message.message_id}-${message.student_id}`}
                className={cn(
                  "group p-3 rounded-lg border transition-colors hover:bg-gray-50",
                  !message.read && "border-l-4 border-l-ios-blue bg-blue-50/30"
                )}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {!message.read && (
                        <span className="h-2 w-2 rounded-full bg-ios-blue flex-shrink-0" />
                      )}
                      <h3
                        className={cn(
                          "font-medium text-sm truncate",
                          !message.read ? "text-ios-darkText" : "text-gray-700"
                        )}
                      >
                        ({message.student_first_name} {message.student_last_name1}) {message.title}
                      </h3>
                    </div>

                    <p className="text-xs text-gray-600 mb-2 line-clamp-2">
                      {message.content}
                    </p>

                    <div className="flex items-center gap-2 flex-wrap">
                      <Badge
                        variant="outline"
                        className={cn("text-xs", priorityColors[message.priority])}
                      >
                        {priorityLabels[message.priority]}
                      </Badge>
                      <span className="text-xs text-gray-500">{formattedDate}</span>
                      {message.course_name && (
                        <span className="text-xs text-gray-400">
                          • {message.course_name}
                        </span>
                      )}
                    </div>
                  </div>

                  <div className="flex items-center gap-1 ml-2">
                    {message.read && (
                      <button
                        onClick={() => handleMarkAsUnread(message.message_id, message.student_id)}
                        className="p-1 text-gray-400 hover:text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Marcar como no leído"
                      >
                        <Mail className="h-3 w-3" />
                      </button>
                    )}
                    <ChevronRight className="h-4 w-4 text-gray-400" />
                  </div>
                </div>

                <div className="mt-2 flex gap-2">
                  {!message.read && (
                    <button
                      onClick={() => onMarkAsRead(message.message_id, message.student_id)}
                      className="text-xs text-ios-blue hover:underline"
                    >
                      Marcar como leído
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default RecentMessages;

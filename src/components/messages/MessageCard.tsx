import { useState } from "react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { AlertCircle, ChevronDown, ChevronUp } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type Message = {
  id: string;
  title: string;
  content: string;
  date: string;
  sender: string;
  priority: "high" | "medium" | "low";
  read: boolean;
  student_id: string;
  student_first_name: string;
  student_last_name1: string;
  course_name: string | null; // nuevo campo
};

type MessageCardProps = {
  message: Message;
  onMarkAsRead: (id: string, student_id: string) => void;
};

const MessageCard = ({ message, onMarkAsRead }: MessageCardProps) => {
  const [expanded, setExpanded] = useState(false);

  const handleToggle = () => {
    if (!message.read) {
      onMarkAsRead(message.id, message.student_id);
    }
    setExpanded(!expanded);
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

  const formattedDate = format(new Date(message.date), "d 'de' MMMM, yyyy", { locale: es });

  return (
    <div
      className={cn(
        "ios-card",
        !message.read && "border-l-4 border-l-ios-blue"
      )}
    >
      <div
        className="p-4 cursor-pointer flex justify-between items-start"
        onClick={handleToggle}
      >
        <div className="flex-1">
          <div className="flex items-center gap-2">
            {!message.read && (
              <span className="h-2 w-2 rounded-full bg-ios-blue" />
            )}

            <h3
              className={cn(
                "font-medium text-lg",
                !message.read && "text-ios-darkText",
                message.read && "text-gray-700"
              )}
            >
              ({message.student_first_name} {message.student_last_name1}) {message.title}
            </h3>
          </div>

          {/* Nombre del curso */}
          {message.course_name && (
            <p className="text-sm text-gray-500 mt-1">
              Curso: <span className="font-medium">{message.course_name}</span>
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline" className={priorityColors[message.priority]}>
              {message.priority === "high" && <AlertCircle className="h-3 w-3 mr-1" />}
              {priorityLabels[message.priority]}
            </Badge>

            <span className="text-sm text-gray-500">
              {formattedDate}
            </span>
          </div>
        </div>

        <div>
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 mt-1">
          <div className="text-sm text-gray-500 mb-3">
            <span className="font-medium">De:</span> {message.sender}
          </div>

          <div className="text-gray-700 whitespace-pre-line">
            {message.content}
          </div>
        </div>
      )}
    </div>
  );
};

export default MessageCard;

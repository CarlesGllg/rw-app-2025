
import { useState } from "react";
import { format } from "date-fns";
import { es, ca } from "date-fns/locale";
import { AlertCircle, ChevronDown, ChevronUp, Paperclip, MailOpen, Mail } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import MessageAttachments from "./MessageAttachments";
import { MessageAttachment } from "@/types/database";
import { useTranslation } from "react-i18next";

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
  course_name: string | null;
  attachments?: MessageAttachment[];
};

type MessageCardProps = {
  message: Message;
  onMarkAsRead: (id: string, student_id: string) => void;
  onMarkAsUnread?: (id: string, student_id: string) => void;
};

const MessageCard = ({ message, onMarkAsRead, onMarkAsUnread }: MessageCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const { t, i18n } = useTranslation();

  const handleToggle = () => {
    if (!message.read) {
      onMarkAsRead(message.id, message.student_id);
    }
    setExpanded(!expanded);
  };

  const handleMarkAsUnread = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onMarkAsUnread) {
      onMarkAsUnread(message.id, message.student_id);
    }
  };

  const priorityColors = {
    high: "bg-red-100 text-red-800 border-red-200",
    medium: "bg-orange-100 text-orange-800 border-orange-200",
    low: "bg-green-100 text-green-800 border-green-200"
  };

  // Get the appropriate locale for date formatting
  const locale = i18n.language === 'ca' ? ca : es;
  const formattedDate = format(new Date(message.date), "d 'de' MMMM, yyyy", { locale });
  const hasAttachments = message.attachments && message.attachments.length > 0;

  // Enhanced debugging for specific message
  if (message.id === '5f1a3bc3-2b57-4a46-9305-73ba638b1448') {
    console.log('=== DEBUGGING MESSAGE 5f1a3bc3-2b57-4a46-9305-73ba638b1448 ===');
    console.log('message.attachments:', message.attachments);
    console.log('message.attachments type:', typeof message.attachments);
    console.log('message.attachments is array:', Array.isArray(message.attachments));
    console.log('hasAttachments:', hasAttachments);
    console.log('message full object:', message);
    console.log('=== END DEBUG ===');
  }

  console.log(`Message ${message.id} has ${hasAttachments ? message.attachments!.length : 0} attachments:`, message.attachments);

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
          <div className="flex items-center gap-2 flex-wrap">
            {!message.read && (
              <span className="h-2 w-2 rounded-full bg-ios-blue flex-shrink-0" />
            )}

            <h3
              className={cn(
                "font-medium text-lg flex-1",
                !message.read && "text-ios-darkText",
                message.read && "text-gray-700"
              )}
            >
              ({message.student_first_name} {message.student_last_name1}) {message.title}
            </h3>

            {hasAttachments && (
              <div className="flex items-center gap-1 bg-gray-100 px-2 py-1 rounded-md">
                <Paperclip className="h-4 w-4 text-gray-600" />
                <span className="text-xs text-gray-600">{message.attachments!.length}</span>
              </div>
            )}
          </div>

          {message.course_name && (
            <p className="text-sm text-gray-500 mt-1">
              {t('common.course')}: <span className="font-medium">{message.course_name}</span>
            </p>
          )}

          <div className="flex flex-wrap items-center gap-2 mt-2">
            <Badge variant="outline" className={priorityColors[message.priority]}>
              {message.priority === "high" && <AlertCircle className="h-3 w-3 mr-1" />}
              {t(`priority.${message.priority}`)}
            </Badge>

            <span className="text-sm text-gray-500">
              {formattedDate}
            </span>
          </div>
        </div>

        <div className="flex-shrink-0 ml-2">
          {expanded ? (
            <ChevronUp className="h-5 w-5 text-gray-400" />
          ) : (
            <ChevronDown className="h-5 w-5 text-gray-400" />
          )}
        </div>
      </div>

      {expanded && (
        <div className="px-4 pb-4 pt-1 border-t border-gray-100 mt-1">
          <div className="flex justify-between items-start mb-3">
            <div className="text-sm text-gray-500">
              <span className="font-medium">{t('messages.from')}</span> {message.sender}
            </div>
            
            {message.read && onMarkAsUnread && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleMarkAsUnread}
                className="flex items-center gap-1 text-xs"
              >
                <Mail className="h-3 w-3" />
                {t('messages.markAsUnread')}
              </Button>
            )}
          </div>

          <div className="text-gray-700 whitespace-pre-line">
            {message.content}
          </div>

          {hasAttachments && (
            <MessageAttachments attachments={message.attachments!} />
          )}
        </div>
      )}
    </div>
  );
};

export default MessageCard;

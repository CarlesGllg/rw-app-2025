
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import MessageCard from "@/components/messages/MessageCard";
import { MessagePriority } from "@/types/database";

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

type RecentMessagesProps = {
  messages: RecentMessage[];
  onMarkAsRead: (messageId: string, studentId: string) => void;
};

const RecentMessages = ({ messages, onMarkAsRead }: RecentMessagesProps) => {
  const navigate = useNavigate();

  return (
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

      {messages.length > 0 ? (
        <div className="space-y-4">
          {messages.map((message) => (
            <MessageCard
              key={message.id}
              message={message}
              onMarkAsRead={onMarkAsRead}
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
  );
};

export default RecentMessages;


import AppLayout from "@/components/layout/AppLayout";
import MessageList from "@/components/messages/MessageList";

const Messages = () => {
  return (
    <AppLayout title="Mensajes">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-ios-darkText mb-2">
          Mensajes Escolares
        </h2>
        <p className="text-gray-500">
          Comunicaciones oficiales de la escuela
        </p>
      </div>
      
      <MessageList />
    </AppLayout>
  );
};

export default Messages;

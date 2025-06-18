
import AppLayout from "@/components/layout/AppLayout";
import MessageList from "@/components/messages/MessageList";
import { useTranslation } from "react-i18next";

const Messages = () => {
  const { t } = useTranslation();

  return (
    <AppLayout title={t('navigation.messages')}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-ios-darkText mb-2">
          {t('messages.title')}
        </h2>
        <p className="text-gray-500">
          {t('messages.subtitle')}
        </p>
      </div>
      
      <MessageList />
    </AppLayout>
  );
};

export default Messages;


import { Bell, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

const QuickActions = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  
  return (
    <section>
      <h3 className="font-medium text-gray-700 mb-3">{t('dashboard.quickActions')}</h3>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl hover:bg-gray-50"
          onClick={() => navigate("/messages")}
        >
          <Bell className="h-6 w-6 text-ios-blue" />
          <span>{t('navigation.messages')}</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl hover:bg-gray-50"
          onClick={() => navigate("/documents")}
        >
          <FileText className="h-6 w-6 text-ios-blue" />
          <span>{t('navigation.documents')}</span>
        </Button>
      </div>
    </section>
  );
};

export default QuickActions;

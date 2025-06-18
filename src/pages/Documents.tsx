
import AppLayout from "@/components/layout/AppLayout";
import DocumentList from "@/components/documents/DocumentList";
import { useTranslation } from "react-i18next";

const Documents = () => {
  const { t } = useTranslation();

  return (
    <AppLayout title={t('navigation.documents')}>
      <div className="mb-6">
        <h2 className="text-xl font-bold text-ios-darkText mb-2">
          {t('navigation.documents')}
        </h2>
        <p className="text-gray-500">
          Accede a formularios, circulares y documentos importantes
        </p>
      </div>
      
      <DocumentList />
    </AppLayout>
  );
};

export default Documents;


import AppLayout from "@/components/layout/AppLayout";
import DocumentList from "@/components/documents/DocumentList";

const Documents = () => {
  return (
    <AppLayout title="Documentos">
      <div className="mb-6">
        <h2 className="text-xl font-bold text-ios-darkText mb-2">
          Documentos Escolares
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

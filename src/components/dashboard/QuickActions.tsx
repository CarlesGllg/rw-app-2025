
import { Bell, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";

const QuickActions = () => {
  const navigate = useNavigate();
  
  return (
    <section>
      <h3 className="font-medium text-gray-700 mb-3">Acciones Rápidas</h3>
      <div className="grid grid-cols-2 gap-4">
        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl hover:bg-gray-50"
          onClick={() => navigate("/messages")}
        >
          <Bell className="h-6 w-6 text-ios-blue" />
          <span>Mensajes</span>
        </Button>

        <Button
          variant="outline"
          className="h-auto py-4 flex flex-col items-center justify-center gap-2 border border-gray-200 rounded-xl hover:bg-gray-50"
          onClick={() => navigate("/documents")}
        >
          <FileText className="h-6 w-6 text-ios-blue" />
          <span>Documentos</span>
        </Button>
      </div>
    </section>
  );
};

export default QuickActions;

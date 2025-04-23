
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, Download, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";

type Document = {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "doc" | "xls" | "img" | "other";
  url: string;
  date: string;
  category: string;
  student_name?: string; // Nombre del estudiante si el documento es específico
  is_global: boolean;
};

type DocumentCardProps = {
  document: Document;
};

const DocumentCard = ({ document }: DocumentCardProps) => {
  const typeIcons = {
    pdf: <FileText className="text-red-500" />,
    doc: <FileText className="text-blue-500" />,
    xls: <FileText className="text-green-500" />,
    img: <FileText className="text-purple-500" />,
    other: <FileText className="text-gray-500" />
  };
  
  const formattedDate = format(new Date(document.date), "d 'de' MMMM, yyyy", { locale: es });
  
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // In a real app, this would trigger actual file download
    toast.success(`Descargando ${document.title}`);
  };
  
  const handleCardClick = () => {
    // In a real app, this could open a preview or details modal
    toast(`Vista previa: ${document.title}`);
  };
  
  return (
    <div className="ios-card" onClick={handleCardClick}>
      <div className="p-4">
        <div className="flex items-start gap-3">
          <div className="h-10 w-10 flex items-center justify-center bg-gray-100 rounded-lg">
            {typeIcons[document.type]}
          </div>
          
          <div className="flex-1">
            <h3 className="font-medium text-lg text-ios-darkText">
              {document.title}
            </h3>
            
            <p className="text-sm text-gray-500 mt-1">
              {document.description}
            </p>
            
            <div className="flex flex-wrap items-center gap-2 mt-3">
              <span className="text-xs bg-ios-gray px-2 py-1 rounded-md">
                {document.category}
              </span>
              
              {document.is_global ? (
                <Badge variant="secondary" className="text-xs">
                  Global
                </Badge>
              ) : document.student_name ? (
                <Badge variant="outline" className="text-xs flex items-center gap-1">
                  <User className="h-3 w-3" />
                  {document.student_name}
                </Badge>
              ) : null}
              
              <span className="text-xs text-gray-500">
                {formattedDate}
              </span>
            </div>
            
            <div className="flex justify-end mt-3">
              <Button
                size="sm"
                variant="ghost"
                className="flex items-center gap-1 text-ios-blue hover:text-ios-blue hover:bg-ios-blue/10"
                onClick={handleDownload}
              >
                <Download className="h-4 w-4" />
                <span>Descargar</span>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentCard;

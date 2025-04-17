
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { FileText, Download } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

type Document = {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "doc" | "xls" | "img" | "other";
  url: string;
  date: string;
  category: string;
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
            
            <div className="flex flex-wrap items-center justify-between mt-3">
              <div className="flex items-center gap-2">
                <span className="text-xs bg-ios-gray px-2 py-1 rounded-md">
                  {document.category}
                </span>
                <span className="text-xs text-gray-500">
                  {formattedDate}
                </span>
              </div>
              
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

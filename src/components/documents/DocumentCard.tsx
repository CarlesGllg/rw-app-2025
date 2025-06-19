
import { format } from "date-fns";
import { es, ca } from "date-fns/locale";
import { FileText, Download, User, Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTranslation } from "react-i18next";

type Document = {
  id: string;
  title: string;
  description: string;
  type: "pdf" | "doc" | "xls" | "img" | "other";
  url: string;
  date: string;
  category: string;
  student_name?: string;
  is_global: boolean;
};

type DocumentCardProps = {
  document: Document;
};

const DocumentCard = ({ document }: DocumentCardProps) => {
  const { t, i18n } = useTranslation();
  const [previewOpen, setPreviewOpen] = useState(false);
  
  const typeIcons = {
    pdf: <FileText className="text-red-500" />,
    doc: <FileText className="text-blue-500" />,
    xls: <FileText className="text-green-500" />,
    img: <FileText className="text-purple-500" />,
    other: <FileText className="text-gray-500" />
  };
  
  // Seleccionar el locale apropiado basado en el idioma actual
  const dateLocale = i18n.language === 'ca' ? ca : es;
  const formattedDate = format(new Date(document.date), "d 'de' MMMM, yyyy", { locale: dateLocale });
  
  const handleDownload = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    // En una aplicación real, esto descargaría el archivo
    toast.success(`${t('common.download')} ${document.title}`);
    
    // Si tenemos una URL válida, intentamos descargar
    if (document.url && document.url.startsWith('http')) {
      window.open(document.url, '_blank');
    }
  };
  
  const handlePreview = () => {
    setPreviewOpen(true);
  };
  
  const renderPreview = () => {
    // Si no hay URL válida
    if (!document.url || !document.url.startsWith('http')) {
      return (
        <div className="min-h-[300px] flex items-center justify-center">
          <p className="text-gray-500">No hay vista previa disponible para este documento</p>
        </div>
      );
    }
    
    // Switch según el tipo de documento
    switch (document.type) {
      case 'pdf':
        return (
          <iframe 
            src={`${document.url}#toolbar=0`} 
            className="w-full h-[70vh]"
            title={document.title}
          />
        );
      case 'img':
        return (
          <div className="flex justify-center">
            <img 
              src={document.url} 
              alt={document.title} 
              className="max-h-[70vh] object-contain"
            />
          </div>
        );
      case 'doc':
      case 'xls':
      case 'other':
      default:
        // Para documentos que no podemos renderizar directamente
        return (
          <div className="min-h-[300px] flex flex-col items-center justify-center gap-4">
            <div className="h-16 w-16 flex items-center justify-center bg-gray-100 rounded-lg">
              {typeIcons[document.type]}
            </div>
            <p className="text-center">Este tipo de documento requiere descarga para su visualización</p>
            <Button
              onClick={handleDownload}
              className="mt-4 flex items-center gap-2"
            >
              <Download className="h-4 w-4" />
              {t('common.download')} documento
            </Button>
          </div>
        );
    }
  };
  
  return (
    <>
      <div className="ios-card cursor-pointer" onClick={handlePreview}>
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
              
              <div className="flex justify-end mt-3 gap-2">
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-1 text-ios-blue hover:text-ios-blue hover:bg-ios-blue/10"
                  onClick={(e) => {
                    e.stopPropagation();
                    handlePreview();
                  }}
                >
                  <Eye className="h-4 w-4" />
                  <span>{t('common.view')}</span>
                </Button>
                
                <Button
                  size="sm"
                  variant="ghost"
                  className="flex items-center gap-1 text-ios-blue hover:text-ios-blue hover:bg-ios-blue/10"
                  onClick={handleDownload}
                >
                  <Download className="h-4 w-4" />
                  <span>{t('common.download')}</span>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Modal para la vista previa del documento */}
      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="sm:max-w-3xl">
          <DialogHeader>
            <DialogTitle>{document.title}</DialogTitle>
          </DialogHeader>
          {renderPreview()}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default DocumentCard;

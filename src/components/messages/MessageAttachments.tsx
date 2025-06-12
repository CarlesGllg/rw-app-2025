
import { useState } from "react";
import { Paperclip, Download, Eye, FileText, Image } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import { MessageAttachment } from "@/types/database";

type MessageAttachmentsProps = {
  attachments: MessageAttachment[];
};

const MessageAttachments = ({ attachments }: MessageAttachmentsProps) => {
  const [previewFile, setPreviewFile] = useState<MessageAttachment | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);

  if (!attachments || attachments.length === 0) {
    return null;
  }

  const downloadFile = async (attachment: MessageAttachment) => {
    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage
        .from('attachments')
        .download(attachment.file_path);

      if (error) {
        console.error("Error descargando archivo:", error);
        toast.error("Error al descargar el archivo");
        return;
      }

      // Crear URL para descarga
      const url = URL.createObjectURL(data);
      const a = document.createElement('a');
      a.href = url;
      a.download = attachment.file_name;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      
      toast.success("Archivo descargado");
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al descargar el archivo");
    } finally {
      setIsLoading(false);
    }
  };

  const previewFileHandler = async (attachment: MessageAttachment) => {
    const isPreviewable = attachment.file_type.includes('image/') || 
                         attachment.file_type === 'application/pdf';
    
    if (!isPreviewable) {
      toast.error("Vista previa no disponible para este tipo de archivo");
      return;
    }

    try {
      setIsLoading(true);
      const { data, error } = await supabase.storage
        .from('attachments')
        .createSignedUrl(attachment.file_path, 3600); // 1 hora

      if (error) {
        console.error("Error obteniendo URL del archivo:", error);
        toast.error("Error al obtener vista previa");
        return;
      }

      setPreviewUrl(data.signedUrl);
      setPreviewFile(attachment);
    } catch (error) {
      console.error("Error:", error);
      toast.error("Error al obtener vista previa");
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (fileType: string) => {
    if (fileType.includes('image/')) {
      return <Image className="h-4 w-4" />;
    } else if (fileType === 'application/pdf') {
      return <FileText className="h-4 w-4" />;
    }
    return <FileText className="h-4 w-4" />;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <>
      <div className="mt-3 border-t border-gray-100 pt-3">
        <div className="flex items-center gap-2 mb-2">
          <Paperclip className="h-4 w-4 text-gray-400" />
          <span className="text-sm text-gray-600 font-medium">
            {attachments.length} archivo{attachments.length > 1 ? 's' : ''} adjunto{attachments.length > 1 ? 's' : ''}
          </span>
        </div>
        
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center justify-between p-2 bg-gray-50 rounded-lg"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {getFileIcon(attachment.file_type)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900 truncate">
                    {attachment.file_name}
                  </p>
                  <p className="text-xs text-gray-500">
                    {formatFileSize(attachment.file_size)}
                  </p>
                </div>
              </div>
              
              <div className="flex items-center gap-1">
                {(attachment.file_type.includes('image/') || attachment.file_type === 'application/pdf') && (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => previewFileHandler(attachment)}
                    disabled={isLoading}
                    className="h-8 w-8 p-0"
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                )}
                
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => downloadFile(attachment)}
                  disabled={isLoading}
                  className="h-8 w-8 p-0"
                >
                  <Download className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Dialog para vista previa */}
      <Dialog open={!!previewFile} onOpenChange={() => setPreviewFile(null)}>
        <DialogContent className="max-w-4xl max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>{previewFile?.file_name}</DialogTitle>
          </DialogHeader>
          
          {previewFile && previewUrl && (
            <div className="flex justify-center items-center max-h-[70vh] overflow-auto">
              {previewFile.file_type.includes('image/') ? (
                <img
                  src={previewUrl}
                  alt={previewFile.file_name}
                  className="max-w-full max-h-full object-contain"
                />
              ) : previewFile.file_type === 'application/pdf' ? (
                <iframe
                  src={previewUrl}
                  className="w-full h-[70vh]"
                  title={previewFile.file_name}
                />
              ) : null}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MessageAttachments;

import { useState } from "react";
import MessageCard from "./MessageCard";

// Sample data for messages
const MESSAGES = [
  {
    id: "1",
    title: "Suspensión de clases - 20 Abril",
    content: "Estimados padres, les informamos que este viernes 20 de abril se suspenderán las clases debido a una jornada de capacitación docente. Los alumnos no deben asistir al colegio.",
    date: "2025-04-16T10:30:00",
    sender: "Dirección Académica",
    priority: "high" as const,
    read: false
  },
  {
    id: "2",
    title: "Programa especial Día de las Madres",
    content: "Invitamos a todas las madres al programa especial que se realizará el próximo 10 de mayo en el auditorio escolar. El horario será de 10:00 AM a 12:00 PM. ¡Las esperamos para celebrar juntos!",
    date: "2025-04-15T14:45:00",
    sender: "Coordinación de Eventos",
    priority: "medium" as const,
    read: false
  },
  {
    id: "3",
    title: "Entrega de calificaciones - Primer Trimestre",
    content: "Se informa que la entrega de calificaciones del primer trimestre se realizará del 22 al 26 de abril. Favor de agendar su cita con el tutor de grupo a través de la plataforma escolar.",
    date: "2025-04-10T09:15:00",
    sender: "Servicios Escolares",
    priority: "medium" as const,
    read: true
  },
  {
    id: "4",
    title: "Actualización de datos personales",
    content: "Solicitamos amablemente actualizar sus datos de contacto en el sistema escolar antes del 30 de abril. Es importante mantener información actualizada para casos de emergencia.",
    date: "2025-04-05T11:20:00",
    sender: "Administración",
    priority: "low" as const,
    read: true
  },
  {
    id: "5",
    title: "Medidas de seguridad - Entrada y salida",
    content: "Recordamos a los padres respetar los horarios y procedimientos de entrada y salida. Por seguridad de todos los alumnos, no se permitirá la salida con personas no autorizadas.",
    date: "2025-03-28T16:00:00",
    sender: "Seguridad Escolar",
    priority: "high" as const,
    read: true
  }
];

const MessageList = () => {
  const [messages, setMessages] = useState(MESSAGES);
  
  const markAsRead = (id: string) => {
    setMessages(messages.map(msg => 
      msg.id === id ? { ...msg, read: true } : msg
    ));
  };

  return (
    <div className="space-y-4">
      {messages.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500">No hay mensajes disponibles</p>
        </div>
      ) : (
        messages.map((message) => (
          <MessageCard 
            key={message.id} 
            message={message} 
            onMarkAsRead={markAsRead}
          />
        ))
      )}
    </div>
  );
};

export default MessageList;

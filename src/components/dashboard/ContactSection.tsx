
import { useState } from "react";
import { Phone, Mail, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";

type Office = "sabadell" | "terrassa";

const CONTACTS = {
  sabadell: {
    name: "Right Way Sabadell",
    phone: "931259602",
    formattedPhone: "93 125 96 02",
    email: "sabadell@rwenglishschool.com",
  },
  terrassa: {
    name: "Right Way Terrassa", 
    phone: "931198674",
    formattedPhone: "93 119 86 74",
    email: "terrassa@rwenglishschool.com",
  },
};

const ContactSection = () => {
  const [selected, setSelected] = useState<Office>("sabadell");

  const handleBack = () => {
    window.history.back();
  };

  return (
    <section className="max-w-xl mx-auto bg-white rounded-xl shadow p-8 mt-8">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold text-ios-darkText">Contacto</h2>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleBack}
          className="hover:bg-gray-100"
        >
          <ArrowLeft className="h-5 w-5" />
          <span className="sr-only">Volver</span>
        </Button>
      </div>
      
      <div className="flex flex-col md:flex-row gap-6 md:gap-16">
        {/* Teléfonos */}
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">Teléfonos</h3>
          <div className="flex flex-col gap-2">
            <a
              href={`tel:${CONTACTS.sabadell.phone}`}
              className="flex items-center gap-2 text-ios-blue hover:underline"
            >
              <Phone size={20} />
              {CONTACTS.sabadell.name}: 
              <span className="font-mono">{CONTACTS.sabadell.formattedPhone}</span>
            </a>
            <a
              href={`tel:${CONTACTS.terrassa.phone}`}
              className="flex items-center gap-2 text-ios-blue hover:underline"
            >
              <Phone size={20} />
              {CONTACTS.terrassa.name}: 
              <span className="font-mono">{CONTACTS.terrassa.formattedPhone}</span>
            </a>
          </div>
        </div>
        {/* Correo electrónico */}
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">Correo electrónico</h3>
          <div className="mb-3 flex gap-2">
            <Button
              size="sm"
              variant={selected === "sabadell" ? "default" : "outline"}
              onClick={() => setSelected("sabadell")}
            >
              Sabadell
            </Button>
            <Button
              size="sm"
              variant={selected === "terrassa" ? "default" : "outline"}
              onClick={() => setSelected("terrassa")}
            >
              Terrassa
            </Button>
          </div>
          <a
            href={`mailto:${CONTACTS[selected].email}`}
            className="flex items-center gap-2 text-ios-blue hover:underline"
          >
            <Mail size={20} />
            Enviar correo a <span className="underline">{CONTACTS[selected].name}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

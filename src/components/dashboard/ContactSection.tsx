
import { useState } from "react";
import { phone, mail } from "lucide-react";
import { Button } from "@/components/ui/button";

type Office = "sabadell" | "terrassa";

const CONTACTS = {
  sabadell: {
    name: "Right Way Sabadell",
    phone: "93 125 96 02",
    phoneHref: "931259602",
    email: "sabadell@rwenglishschool.com",
  },
  terrassa: {
    name: "Right Way Terrassa",
    phone: "93 119 86 74",
    phoneHref: "931198674",
    email: "terrassa@rwenglishschool.com",
  },
};

const ContactSection = () => {
  const [selected, setSelected] = useState<Office>("sabadell");

  return (
    <section className="ios-card p-6 mt-4">
      <h2 className="text-xl font-semibold mb-3 text-ios-darkText">Contacto</h2>
      <div className="flex flex-col md:flex-row gap-6 md:gap-16">
        {/* Teléfonos */}
        <div className="flex-1">
          <h3 className="text-lg font-medium mb-2">Teléfonos</h3>
          <div className="flex flex-col gap-2">
            <a
              href={`tel:${CONTACTS.sabadell.phoneHref}`}
              className="flex items-center gap-2 text-ios-blue hover:underline"
            >
              <span>
                {phone({ size: 20 })}
              </span>
              {CONTACTS.sabadell.name}:{" "}
              <span className="font-mono">{CONTACTS.sabadell.phone}</span>
            </a>
            <a
              href={`tel:${CONTACTS.terrassa.phoneHref}`}
              className="flex items-center gap-2 text-ios-blue hover:underline"
            >
              <span>
                {phone({ size: 20 })}
              </span>
              {CONTACTS.terrassa.name}:{" "}
              <span className="font-mono">{CONTACTS.terrassa.phone}</span>
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
            <span>
              {mail({ size: 20 })}
            </span>
            Enviar correo a <span className="underline">{CONTACTS[selected].name}</span>
          </a>
        </div>
      </div>
    </section>
  );
};

export default ContactSection;

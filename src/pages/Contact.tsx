import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout"; // Asegúrate de importar el layout correctamente

type Office = "sabadell" | "terrassa";

const CONTACTS = {
  sabadell: {
    name: "Sabadell", // Cambiado de "Right Way Sabadell" a "Sabadell"
    phone: "931259602", // Sin espacios en el número
    formattedPhone: "931259602", // Eliminar espacios aquí también
    email: "sabadell@rwenglishschool.com",
  },
  terrassa: {
    name: "Terrassa", // Cambiado de "Right Way Terrassa" a "Terrassa"
    phone: "931198674", // Sin espacios
    formattedPhone: "931198674", // Y sin espacios aquí
    email: "terrassa@rwenglishschool.com",
  },
};

const Contact = () => {
  const [selected, setSelected] = useState<Office>("sabadell");

  return (
    <AppLayout title="Contacto"> {/* Aquí envolvemos con el AppLayout */}
      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-ios-darkText">Contacto</h2>

        {/* Utilizamos flex para que las tarjetas estén una debajo de la otra */}
        <div className="flex flex-col gap-8">
          {/* Tarjeta de Teléfonos */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-medium mb-4">Teléfonos</h3>
            <div className="flex flex-col gap-4">
              <a
                href={`tel:${CONTACTS.sabadell.phone}`}
                className="flex items-center gap-3 text-ios-blue hover:underline"
              >
                <Phone size={20} />
                <span className="font-mono text-xl"> {/* Aumentamos el tamaño del número */}
                  <strong>{CONTACTS.sabadell.name}</strong>: 
                  <span className="ml-2">{CONTACTS.sabadell.formattedPhone}</span> {/* Añadimos margen a la izquierda */}
                </span>
              </a>
              <a
                href={`tel:${CONTACTS.terrassa.phone}`}
                className="flex items-center gap-3 text-ios-blue hover:underline"
              >
                <Phone size={20} />
                <span className="font-mono text-xl">
                  <strong>{CONTACTS.terrassa.name}</strong>: 
                  <span className="ml-2">{CONTACTS.terrassa.formattedPhone}</span>
                </span>
              </a>
            </div>
          </div>

          {/* Tarjeta de Correo Electrónico */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-medium mb-4">Correo Electrónico</h3>
            <div className="mb-6 flex gap-2">
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
              className="flex items-center gap-3 text-ios-blue hover:underline"
            >
              <Mail size={20} />
              Enviar correo a <span className="underline">{CONTACTS[selected].name}</span>
            </a>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default Contact;

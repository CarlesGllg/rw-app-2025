
import { useState } from "react";
import { Phone, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslation } from "react-i18next";

type Office = "sabadell" | "terrassa";

const CONTACTS = {
  sabadell: {
    name: "Sabadell",
    phone: "931259602",
    formattedPhone: "931259602",
    email: "sabadell@rwenglishschool.com",
  },
  terrassa: {
    name: "Terrassa",
    phone: "931198674",
    formattedPhone: "931198674",
    email: "terrassa@rwenglishschool.com",
  },
};

const Contact = () => {
  const { t } = useTranslation();
  const [selected, setSelected] = useState<Office>("sabadell");

  return (
    <AppLayout title={t('contact.title')}>
      <section className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-ios-darkText">{t('contact.title')}</h2>

        <div className="flex flex-col gap-8">
          {/* Tarjeta de Teléfonos */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-medium mb-4">{t('contact.phones')}</h3>
            <div className="flex flex-col gap-4">
              <a
                href={`tel:${CONTACTS.sabadell.phone}`}
                className="flex items-center gap-3 text-ios-blue hover:underline"
              >
                <Phone size={20} />
                <span className="font-mono text-xl">
                  <strong>{t('contact.sabadell')}</strong>: 
                  <span className="ml-2">{CONTACTS.sabadell.formattedPhone}</span>
                </span>
              </a>
              <a
                href={`tel:${CONTACTS.terrassa.phone}`}
                className="flex items-center gap-3 text-ios-blue hover:underline"
              >
                <Phone size={20} />
                <span className="font-mono text-xl">
                  <strong>{t('contact.terrassa')}</strong>: 
                  <span className="ml-2">{CONTACTS.terrassa.formattedPhone}</span>
                </span>
              </a>
            </div>
          </div>

          {/* Tarjeta de Correo Electrónico */}
          <div className="bg-white rounded-xl shadow p-6">
            <h3 className="text-lg font-medium mb-4">{t('contact.email')}</h3>
            <div className="mb-6 flex gap-2">
              <Button
                size="sm"
                variant={selected === "sabadell" ? "default" : "outline"}
                onClick={() => setSelected("sabadell")}
              >
                {t('contact.sabadell')}
              </Button>
              <Button
                size="sm"
                variant={selected === "terrassa" ? "default" : "outline"}
                onClick={() => setSelected("terrassa")}
              >
                {t('contact.terrassa')}
              </Button>
            </div>
            <a
              href={`mailto:${CONTACTS[selected].email}`}
              className="flex items-center gap-3 text-ios-blue hover:underline"
            >
              <Mail size={20} />
              {t('contact.sendEmail')} <span className="underline">{CONTACTS[selected].name}</span>
            </a>
          </div>
        </div>
      </section>
    </AppLayout>
  );
};

export default Contact;


import { Phone, Mail, MapPin } from "lucide-react";
import AppLayout from "@/components/layout/AppLayout";
import { useTranslation } from "react-i18next";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const CONTACTS = {
  sabadell: {
    name: "Sabadell",
    phone: "931259602",
    formattedPhone: "931259602",
    email: "sabadell@rwenglishschool.com",
    address: "Avinguda Estrasburg 39-45 (08206) Sabadell",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Avinguda+Estrasburg+39-45+08206+Sabadell"
  },
  terrassa: {
    name: "Terrassa",
    phone: "931198674",
    formattedPhone: "931198674",
    email: "terrassa@rwenglishschool.com",
    address: "Avinguda del Vint-i-dos de Juliol, 451 (08226) Terrassa",
    mapsUrl: "https://www.google.com/maps/search/?api=1&query=Avinguda+del+Vint-i-dos+de+Juliol+451+08226+Terrassa"
  },
};

const Contact = () => {
  const { t } = useTranslation();

  return (
    <AppLayout title={t('contact.title')}>
      <section className="max-w-6xl mx-auto bg-white rounded-xl shadow-lg p-8 mt-8">
        <h2 className="text-2xl font-semibold mb-6 text-ios-darkText">{t('contact.title')}</h2>

        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-left font-semibold text-ios-darkText">
                  Escuela
                </TableHead>
                <TableHead className="text-left font-semibold text-ios-darkText">
                  {t('contact.phones')}
                </TableHead>
                <TableHead className="text-left font-semibold text-ios-darkText">
                  {t('contact.email')}
                </TableHead>
                <TableHead className="text-left font-semibold text-ios-darkText">
                  ¿Dónde estamos?
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium text-ios-darkText">
                  Right Way {CONTACTS.sabadell.name}
                </TableCell>
                <TableCell>
                  <a
                    href={`tel:${CONTACTS.sabadell.phone}`}
                    className="flex items-center gap-2 text-ios-blue hover:underline"
                  >
                    <Phone size={18} />
                    <span className="font-mono">{CONTACTS.sabadell.formattedPhone}</span>
                  </a>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `mailto:${CONTACTS.sabadell.email}`}
                    className="flex items-center gap-2"
                  >
                    <Mail size={18} />
                    Contactar
                  </Button>
                </TableCell>
                <TableCell>
                  <a
                    href={CONTACTS.sabadell.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-ios-blue hover:underline"
                  >
                    <MapPin size={18} />
                    <span className="text-sm">{CONTACTS.sabadell.address}</span>
                  </a>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium text-ios-darkText">
                  Right Way {CONTACTS.terrassa.name}
                </TableCell>
                <TableCell>
                  <a
                    href={`tel:${CONTACTS.terrassa.phone}`}
                    className="flex items-center gap-2 text-ios-blue hover:underline"
                  >
                    <Phone size={18} />
                    <span className="font-mono">{CONTACTS.terrassa.formattedPhone}</span>
                  </a>
                </TableCell>
                <TableCell>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => window.location.href = `mailto:${CONTACTS.terrassa.email}`}
                    className="flex items-center gap-2"
                  >
                    <Mail size={18} />
                    Contactar
                  </Button>
                </TableCell>
                <TableCell>
                  <a
                    href={CONTACTS.terrassa.mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-ios-blue hover:underline"
                  >
                    <MapPin size={18} />
                    <span className="text-sm">{CONTACTS.terrassa.address}</span>
                  </a>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </section>
    </AppLayout>
  );
};

export default Contact;

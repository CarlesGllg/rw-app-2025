
import { Card, CardContent } from "@/components/ui/card";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import type { Event } from "@/types/database";

type UpcomingEventsProps = {
  events: Event[];
};

const UpcomingEvents = ({ events = [] }: UpcomingEventsProps) => {
  return (
    <section>
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-medium text-gray-700">Próximos Eventos</h3>
      </div>

      <div className="space-y-2">
        {events && events.length > 0 ? (
          events.map((event) => (
            <div key={event.id} className="flex items-center gap-3 p-3 bg-white rounded-xl border border-gray-100">
              <div className="h-12 w-12 flex flex-col items-center justify-center bg-ios-blue/10 text-ios-blue rounded-lg">
                <span className="text-xs">
                  {format(new Date(event.start_date), "MMM", { locale: es }).toUpperCase()}
                </span>
                <span className="font-bold">
                  {format(new Date(event.start_date), "d")}
                </span>
              </div>
              <div>
                <h4 className="font-medium">{event.title}</h4>
                <p className="text-xs text-gray-500">{event.description}</p>
              </div>
            </div>
          ))
        ) : (
          <Card>
            <CardContent className="py-6 text-center text-gray-500">
              No hay eventos próximos
            </CardContent>
          </Card>
        )}
      </div>
    </section>
  );
};

export default UpcomingEvents;

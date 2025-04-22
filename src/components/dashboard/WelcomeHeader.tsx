
import { format } from "date-fns";
import { es } from "date-fns/locale";
import UserAvatar from "@/components/ui/UserAvatar";
import type { User } from "@/hooks/useAuth";

type WelcomeHeaderProps = {
  user: User;
};

const WelcomeHeader = ({ user }: WelcomeHeaderProps) => {
  const today = new Date();
  const formattedDate = format(today, "EEEE, d 'de' MMMM yyyy", { locale: es });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  return (
    <section className="ios-card p-6">
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div>
          <h2 className="text-2xl font-bold text-ios-darkText">
            Hola, {user.full_name?.split(" ")[0] || 'Usuario'}
          </h2>
          <p className="text-gray-500 mt-1">{capitalizedDate}</p>
        </div>

        <UserAvatar
          name={user.full_name || 'Usuario'}
          role={user.role}
          showRole={true}
        />
      </div>
    </section>
  );
};

export default WelcomeHeader;

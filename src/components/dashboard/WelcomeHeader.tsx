
import { format } from "date-fns";
import { es, ca } from "date-fns/locale";
import UserAvatar from "@/components/ui/UserAvatar";
import type { User } from "@/hooks/useAuth";
import { useTranslation } from "react-i18next";

type WelcomeHeaderProps = {
  user: User | null;
};

const WelcomeHeader = ({ user }: WelcomeHeaderProps) => {
  const { t, i18n } = useTranslation();
  const today = new Date();
  
  // Get the appropriate locale for date formatting
  const locale = i18n.language === 'ca' ? ca : es;
  const dateFormat = i18n.language === 'ca' ? "EEEE, d 'de' MMMM yyyy" : "EEEE, d 'de' MMMM yyyy";
  
  const formattedDate = format(today, dateFormat, { locale });
  const capitalizedDate = formattedDate.charAt(0).toUpperCase() + formattedDate.slice(1);

  // Use optional chaining and provide a default value
  const firstName = user?.full_name?.split(" ")[0] || 'Usuario';

  return (
    <section className="ios-card p-6 max-w-full w-full">
      <div className="flex items-center justify-between flex-wrap gap-4 sm:gap-6">
        <div className="flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-ios-darkText">
            {t('dashboard.welcome', { name: firstName })}
          </h2>
          <p className="text-gray-500 mt-1 text-sm sm:text-base">{capitalizedDate}</p>
        </div>

        <UserAvatar
          name={user?.full_name || 'Usuario'}
          role={user?.role || 'parent'}
          showRole={true}
          size="lg"
        />
      </div>
    </section>
  );
};

export default WelcomeHeader;

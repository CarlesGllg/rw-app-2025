
import { Link, useLocation } from "react-router-dom";
import { Bell, FileText, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type MobileNavigationProps = {
  unreadNotifications: number;
};

const MobileNavigation = ({ unreadNotifications }: MobileNavigationProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  const isActive = (path: string) => currentPath === path;

  return (
    <nav
      className="bg-white fixed bottom-0 left-0 right-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 md:hidden"
      role="navigation"
      aria-label="Menú de navegación móvil"
    >
      <div className="flex justify-around">
        <Link
          to="/dashboard"
          className={cn(
            "flex flex-col items-center py-3 px-4 text-sm",
            isActive("/dashboard") ? "text-ios-blue" : "text-gray-600"
          )}
          aria-current={isActive("/dashboard") ? "page" : undefined}
        >
          <Home size={20} />
          <span>{t('navigation.home')}</span>
        </Link>

        <Link
          to="/messages"
          className={cn(
            "flex flex-col items-center py-3 px-4 text-sm relative",
            isActive("/messages") ? "text-ios-blue" : "text-gray-600"
          )}
          aria-current={isActive("/messages") ? "page" : undefined}
        >
          <div className="relative">
            <Bell size={20} />
            {unreadNotifications > 0 && (
              <span
                className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center"
                aria-label={`${unreadNotifications} notificaciones sin leer`}
              >
                {unreadNotifications}
              </span>
            )}
          </div>
          <span>{t('navigation.messages')}</span>
        </Link>

        <Link
          to="/documents"
          className={cn(
            "flex flex-col items-center py-3 px-4 text-sm",
            isActive("/documents") ? "text-ios-blue" : "text-gray-600"
          )}
          aria-current={isActive("/documents") ? "page" : undefined}
        >
          <FileText size={20} />
          <span>{t('navigation.documents')}</span>
        </Link>

        <Link
          to="/profile"
          className={cn(
            "flex flex-col items-center py-3 px-4 text-sm",
            isActive("/profile") ? "text-ios-blue" : "text-gray-600"
          )}
          aria-current={isActive("/profile") ? "page" : undefined}
        >
          <User size={20} />
          <span>{t('navigation.profile')}</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;

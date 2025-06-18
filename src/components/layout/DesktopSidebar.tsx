
import { Link, useLocation } from "react-router-dom";
import { Bell, FileText, Home, LogOut, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { useTranslation } from "react-i18next";

type DesktopSidebarProps = {
  unreadNotifications: number;
  onLogout: () => void;
};

const DesktopSidebar = ({ unreadNotifications, onLogout }: DesktopSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;
  const { t } = useTranslation();

  const NavItem = ({
    to,
    icon: Icon,
    label,
    badge,
  }: {
    to: string;
    icon: typeof Home;
    label: string;
    badge?: number;
  }) => {
    const isActive = currentPath === to;

    return (
      <Link
        to={to}
        className={cn(
          "flex items-center py-3 px-4 space-x-3 rounded-xl transition-colors relative",
          isActive
            ? "bg-ios-blue/10 text-ios-blue font-medium"
            : "text-gray-700 hover:bg-gray-100"
        )}
      >
        <Icon size={20} />
        <span>{label}</span>
        {badge && badge > 0 ? (
          <span className="absolute right-3 top-3 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
            {badge}
          </span>
        ) : null}
      </Link>
    );
  };

  return (
    <div className="hidden fixed left-0 top-0 bottom-0 w-64 bg-white shadow-sm border-r border-gray-100 md:flex flex-col">
      {/* Logo y título */}
      <div className="p-6 border-b border-gray-100 flex items-center">
        <img src="/logo_txt_transp.png" alt="Logo" className="h-16 w-full object-contain" />
      </div>

      <div className="p-6 border-b border-gray-100">
        <p className="text-base font-semibold text-gray-700 tracking-wide mt-1">
          {t('navigation.parentPortal')}
        </p>
      </div>

      {/* Scrollable navigation */}
      <div className="flex-1 overflow-y-auto p-4 space-y-1">
        <NavItem to="/dashboard" icon={Home} label={t('navigation.home')} />
        <NavItem
          to="/messages"
          icon={Bell}
          label={t('navigation.messages')}
          badge={unreadNotifications}
        />
        <NavItem to="/documents" icon={FileText} label={t('navigation.documents')} />
        <NavItem to="/profile" icon={User} label={t('navigation.profile')} />
        <NavItem to="/contacto" icon={Mail} label="Contacto" />
      </div>

      {/* Logout button */}
      <div className="p-4">
        <Button
          variant="outline"
          className="w-full flex items-center justify-center gap-2"
          onClick={onLogout}
        >
          <LogOut size={16} />
          <span>{t('auth.logout')}</span>
        </Button>
      </div>
    </div>
  );
};

export default DesktopSidebar;

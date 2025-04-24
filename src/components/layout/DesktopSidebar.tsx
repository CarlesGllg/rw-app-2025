import { Link, useLocation } from "react-router-dom";
import { Bell, FileText, Home, LogOut, User, Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type DesktopSidebarProps = {
  unreadNotifications: number;
  onLogout: () => void;
};

const DesktopSidebar = ({ unreadNotifications, onLogout }: DesktopSidebarProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

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
    <div className="hidden fixed left-0 top-0 bottom-0 w-64 bg-white shadow-sm border-r border-gray-100 md:block mt-16">
      <div className="p-6 border-b border-gray-100 flex items-center">
        {/* Logo */}
        <img src="/solologo_fondo_transp.png" alt="Logo" className="h-8 w-8 mr-2" /> {/* Ruta del logo */}
        <div>
          <h2 className="text-2xl text-black font-serif">Right Way</h2> {/* Cambiado a color negro y fuente Times New Roman */}
          <p className="text-sm text-gray-500 mt-1">Portal para Padres</p>
        </div>
      </div>
      
      <div className="p-4 space-y-1">
        <NavItem to="/dashboard" icon={Home} label="Inicio" />
        <NavItem
          to="/messages"
          icon={Bell}
          label="Mensajes"
          badge={unreadNotifications}
        />
        <NavItem to="/documents" icon={FileText} label="Documentos" />
        <NavItem to="/profile" icon={User} label="Perfil" />
        <NavItem to="/contacto" icon={Mail} label="Contacto" />
      </div>
      
      <div className="absolute bottom-8 left-6 right-6">
        <Button 
          variant="outline" 
          className="w-full flex items-center justify-center gap-2"
          onClick={onLogout}
        >
          <LogOut size={16} />
          <span>Cerrar Sesión</span>
        </Button>
      </div>
    </div>
  );
};

export default DesktopSidebar;

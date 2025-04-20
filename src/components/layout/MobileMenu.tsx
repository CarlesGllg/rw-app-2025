
import { Bell, FileText, Home, LogOut, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { Link } from "react-router-dom";

type MobileMenuProps = {
  unreadNotifications: number;
  onLogout: () => void;
};

const MobileMenu = ({ unreadNotifications, onLogout }: MobileMenuProps) => {
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
    const isActive = window.location.pathname === to;
    
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
    <Sheet>
      <SheetTrigger asChild>
        <Button variant="ghost" size="icon" className="md:hidden">
          <Menu size={22} />
        </Button>
      </SheetTrigger>
      <SheetContent side="left" className="w-72">
        <div className="flex items-center justify-between py-4 border-b mb-6">
          <h2 className="font-semibold text-xl text-ios-darkText">Menú</h2>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon">
              <X size={18} />
            </Button>
          </SheetTrigger>
        </div>

        <div className="space-y-1">
          <NavItem to="/dashboard" icon={Home} label="Inicio" />
          <NavItem
            to="/messages"
            icon={Bell}
            label="Mensajes"
            badge={unreadNotifications}
          />
          <NavItem to="/documents" icon={FileText} label="Documentos" />
          <NavItem to="/profile" icon={User} label="Perfil" />
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
      </SheetContent>
    </Sheet>
  );
};

export default MobileMenu;

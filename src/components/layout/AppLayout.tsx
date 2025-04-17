
import { useState, ReactNode } from "react";
import { useNavigate, Link } from "react-router-dom";
import { Bell, FileText, Home, LogOut, Menu, User, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { toast } from "sonner";

type AppLayoutProps = {
  children: ReactNode;
  title: string;
};

const AppLayout = ({ children, title }: AppLayoutProps) => {
  const [unreadNotifications, setUnreadNotifications] = useState(2);
  const navigate = useNavigate();
  const [user, setUser] = useState(() => {
    const storedUser = localStorage.getItem("user");
    return storedUser ? JSON.parse(storedUser) : null;
  });
  
  const handleLogout = () => {
    localStorage.removeItem("user");
    toast.success("Sesión cerrada");
    navigate("/");
  };

  const markAllAsRead = () => {
    setUnreadNotifications(0);
    toast.success("Todas las notificaciones marcadas como leídas");
  };
  
  if (!user) {
    navigate("/");
    return null;
  }
  
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
    <div className="min-h-screen bg-ios-gray">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="ios-container py-4 flex justify-between items-center">
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
                  to="/mensajes"
                  icon={Bell}
                  label="Mensajes"
                  badge={unreadNotifications}
                />
                <NavItem to="/documentos" icon={FileText} label="Documentos" />
                <NavItem to="/perfil" icon={User} label="Perfil" />
              </div>

              <div className="absolute bottom-8 left-6 right-6">
                <Button 
                  variant="outline" 
                  className="w-full flex items-center justify-center gap-2"
                  onClick={handleLogout}
                >
                  <LogOut size={16} />
                  <span>Cerrar Sesión</span>
                </Button>
              </div>
            </SheetContent>
          </Sheet>

          <h1 className="font-semibold text-xl text-ios-darkText">{title}</h1>
          
          <div className="flex items-center space-x-2">
            {unreadNotifications > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={() => navigate("/mensajes")}
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadNotifications}
                </span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="ios-container py-6">
        {children}
      </main>

      {/* Bottom Navigation */}
      <nav className="bg-white fixed bottom-0 left-0 right-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 md:hidden">
        <div className="flex justify-around">
          <Link
            to="/dashboard"
            className={cn(
              "flex flex-col items-center py-3 px-4 text-sm",
              window.location.pathname === "/dashboard"
                ? "text-ios-blue"
                : "text-gray-600"
            )}
          >
            <Home size={20} />
            <span>Inicio</span>
          </Link>
          <Link
            to="/mensajes"
            className={cn(
              "flex flex-col items-center py-3 px-4 text-sm relative",
              window.location.pathname === "/mensajes"
                ? "text-ios-blue"
                : "text-gray-600"
            )}
          >
            <Bell size={20} />
            <span>Mensajes</span>
            {unreadNotifications > 0 && (
              <span className="absolute top-2 right-2 bg-red-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center">
                {unreadNotifications}
              </span>
            )}
          </Link>
          <Link
            to="/documentos"
            className={cn(
              "flex flex-col items-center py-3 px-4 text-sm",
              window.location.pathname === "/documentos"
                ? "text-ios-blue"
                : "text-gray-600"
            )}
          >
            <FileText size={20} />
            <span>Documentos</span>
          </Link>
          <Link
            to="/perfil"
            className={cn(
              "flex flex-col items-center py-3 px-4 text-sm",
              window.location.pathname === "/perfil"
                ? "text-ios-blue"
                : "text-gray-600"
            )}
          >
            <User size={20} />
            <span>Perfil</span>
          </Link>
        </div>
      </nav>

      {/* Desktop Sidebar */}
      <div className="hidden fixed left-0 top-0 bottom-0 w-64 bg-white shadow-sm border-r border-gray-100 md:block">
        <div className="p-6 border-b border-gray-100">
          <h2 className="font-bold text-2xl text-ios-blue">Colegio App</h2>
          <p className="text-sm text-gray-500 mt-1">Portal para Padres</p>
        </div>
        
        <div className="p-4 space-y-1">
          <NavItem to="/dashboard" icon={Home} label="Inicio" />
          <NavItem
            to="/mensajes"
            icon={Bell}
            label="Mensajes"
            badge={unreadNotifications}
          />
          <NavItem to="/documentos" icon={FileText} label="Documentos" />
          <NavItem to="/perfil" icon={User} label="Perfil" />
        </div>
        
        <div className="absolute bottom-8 left-6 right-6">
          <Button 
            variant="outline" 
            className="w-full flex items-center justify-center gap-2"
            onClick={handleLogout}
          >
            <LogOut size={16} />
            <span>Cerrar Sesión</span>
          </Button>
        </div>
      </div>
      
      {/* Desktop Content Padding */}
      <div className="hidden md:block md:pl-64">
        <div className="h-20"></div>
      </div>
      
      {/* Mobile Bottom Navigation Padding */}
      <div className="pb-16 md:pb-0"></div>
    </div>
  );
};

export default AppLayout;

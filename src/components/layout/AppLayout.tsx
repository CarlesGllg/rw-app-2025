
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MobileNavigation from "./MobileNavigation";
import DesktopSidebar from "./DesktopSidebar";
import MobileMenu from "./MobileMenu";

type AppLayoutProps = {
  children: React.ReactNode;
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

  return (
    <div className="min-h-screen bg-ios-gray">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="ios-container py-4 flex justify-between items-center">
          <MobileMenu 
            unreadNotifications={unreadNotifications}
            onLogout={handleLogout}
          />

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

      {/* Mobile Navigation */}
      <MobileNavigation unreadNotifications={unreadNotifications} />

      {/* Desktop Sidebar */}
      <DesktopSidebar 
        unreadNotifications={unreadNotifications}
        onLogout={handleLogout}
      />
      
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


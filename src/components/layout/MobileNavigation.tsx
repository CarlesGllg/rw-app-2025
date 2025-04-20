
import { Link, useLocation } from "react-router-dom";
import { Bell, FileText, Home, User } from "lucide-react";
import { cn } from "@/lib/utils";

type MobileNavigationProps = {
  unreadNotifications: number;
};

const MobileNavigation = ({ unreadNotifications }: MobileNavigationProps) => {
  const location = useLocation();
  const currentPath = location.pathname;

  return (
    <nav className="bg-white fixed bottom-0 left-0 right-0 shadow-[0_-2px_10px_rgba(0,0,0,0.05)] border-t border-gray-100 md:hidden">
      <div className="flex justify-around">
        <Link
          to="/dashboard"
          className={cn(
            "flex flex-col items-center py-3 px-4 text-sm",
            currentPath === "/dashboard"
              ? "text-ios-blue"
              : "text-gray-600"
          )}
        >
          <Home size={20} />
          <span>Inicio</span>
        </Link>
        <Link
          to="/messages"
          className={cn(
            "flex flex-col items-center py-3 px-4 text-sm relative",
            currentPath === "/messages"
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
          to="/documents"
          className={cn(
            "flex flex-col items-center py-3 px-4 text-sm",
            currentPath === "/documents"
              ? "text-ios-blue"
              : "text-gray-600"
          )}
        >
          <FileText size={20} />
          <span>Documentos</span>
        </Link>
        <Link
          to="/profile"
          className={cn(
            "flex flex-col items-center py-3 px-4 text-sm",
            currentPath === "/profile"
              ? "text-ios-blue"
              : "text-gray-600"
          )}
        >
          <User size={20} />
          <span>Perfil</span>
        </Link>
      </div>
    </nav>
  );
};

export default MobileNavigation;

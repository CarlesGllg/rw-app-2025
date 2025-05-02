import { Bell } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import MobileNavigation from "./MobileNavigation";
import DesktopSidebar from "./DesktopSidebar";
import MobileMenu from "./MobileMenu";
import { useAuth } from "@/hooks/useAuth";
import { useUnreadMessages } from "@/hooks/useUnreadMessages";
import { supabase } from "@/lib/supabase";

type AppLayoutProps = {
  children: React.ReactNode;
  title: string;
};

const AppLayout = ({ children, title }: AppLayoutProps) => {
  const { user, signOut } = useAuth();
  const unreadMessages = useUnreadMessages();

  const markAllAsRead = async () => {
    if (!user) return;

    try {
      const { data: studentData } = await supabase
        .from("student_parent")
        .select("student_id")
        .eq("parent_id", user.id);

      if (!studentData?.length) return;

      const studentIds = studentData.map((row) => row.student_id);

      await supabase
        .from("message_student")
        .update({ read: true })
        .in("student_id", studentIds)
        .eq("read", false);

      toast.success("Todas las notificaciones marcadas como leídas");
    } catch (error) {
      console.error("Error marking messages as read:", error);
      toast.error("Error al marcar las notificaciones como leídas");
    }
  };

  return (
    <div className="min-h-screen bg-ios-gray">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div
          className="ios-container py-4 flex justify-between items-center"
          style={{
            paddingTop: "env(safe-area-inset-top)", // Ajusta la parte superior solo según el área segura
          }}
        >
          <MobileMenu unreadNotifications={unreadMessages} onLogout={signOut} />

          <h1 className="font-semibold text-xl text-ios-darkText">{title}</h1>

          <div className="flex items-center space-x-2">
            {unreadMessages > 0 && (
              <Button
                variant="ghost"
                size="icon"
                className="relative"
                onClick={markAllAsRead}
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  {unreadMessages}
                </span>
              </Button>
            )}
          </div>
        </div>
      </header>

      {/* Sidebar */}
      <DesktopSidebar unreadNotifications={unreadMessages} onLogout={signOut} />

      {/* Main content */}
      <main className="px-4 md:px-8 py-6 ml-0 md:ml-64 transition-all duration-300">
        {children}
      </main>

      {/* Mobile Bottom Navigation */}
      <MobileNavigation unreadNotifications={unreadMessages} />
    </div>
  );
};

export default AppLayout;

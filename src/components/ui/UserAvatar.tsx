
import { User } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

type UserAvatarProps = {
  name: string;
  image?: string;
  role?: string;
  size?: "sm" | "md" | "lg";
  showRole?: boolean;
};

const UserAvatar = ({ 
  name, 
  image, 
  role, 
  size = "md", 
  showRole = false 
}: UserAvatarProps) => {
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map(n => n[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };
  
  const sizeClasses = {
    sm: "h-8 w-8 text-xs",
    md: "h-12 w-12 text-sm",
    lg: "h-16 w-16 text-base",
  };
  
  const roleColors = {
    admin: "bg-ios-purple text-white",
    school: "bg-ios-blue text-white",
    parent: "bg-green-100 text-green-800",
    teacher: "bg-amber-100 text-amber-800",
    default: "bg-gray-100 text-gray-800"
  };
  
  const roleLabel = (role?: string) => {
    if (!role) return null;
    
    const labels: Record<string, string> = {
      admin: "Administrador",
      school: "Escuela",
      parent: "Padre/Madre",
      teacher: "Profesor",
    };
    
    return labels[role] || role;
  };
  
  const roleStyle = role ? 
    (roleColors[role as keyof typeof roleColors] || roleColors.default) : 
    roleColors.default;
  
  return (
    <div className="flex items-center gap-3">
      <Avatar className={cn("rounded-full", sizeClasses[size])}>
        <AvatarImage src={image} alt={name} />
        <AvatarFallback className="bg-ios-gray text-ios-blue">
          {image ? <User /> : getInitials(name)}
        </AvatarFallback>
      </Avatar>
      
      {(name || (role && showRole)) && (
        <div>
          {name && <p className="font-medium">{name}</p>}
          {role && showRole && (
            <span className={cn(
              "inline-flex text-xs px-2 py-0.5 rounded-full mt-1",
              roleStyle
            )}>
              {roleLabel(role)}
            </span>
          )}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;

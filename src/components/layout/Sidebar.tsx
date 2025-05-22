
import { useState } from "react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { 
  Settings, 
  Monitor, 
  Database, 
  Cloud, 
  User, 
  RefreshCw,
  Server,
  ArrowLeft,
  ArrowRight 
} from "lucide-react";
import { Link } from "react-router-dom";

type SidebarItem = {
  title: string;
  icon: React.ElementType;
  path: string;
};

const sidebarItems: SidebarItem[] = [
  {
    title: "Dashboard",
    icon: Monitor,
    path: "/"
  },
  {
    title: "Instance Pools",
    icon: Server,
    path: "/instances"
  },
  {
    title: "Autoscaling",
    icon: RefreshCw,
    path: "/autoscaling"
  },
  {
    title: "Storage",
    icon: Database,
    path: "/storage"
  },
  {
    title: "Networks",
    icon: Cloud,
    path: "/networks"
  },
  {
    title: "Users",
    icon: User,
    path: "/users"
  },
  {
    title: "Settings",
    icon: Settings,
    path: "/settings"
  }
];

interface SidebarProps {
  className?: string;
}

const Sidebar = ({ className }: SidebarProps) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      className={cn(
        "flex flex-col bg-sidebar h-full transition-all duration-300 border-r border-sidebar-border",
        collapsed ? "w-[60px]" : "w-64",
        className
      )}
    >
      <div className="flex items-center h-16 px-4 border-b border-sidebar-border">
        {!collapsed && (
          <h1 className="text-xl font-semibold text-gradient">AutoScale</h1>
        )}
        {collapsed && (
          <span className="text-xl font-bold text-teal-400">A</span>
        )}
      </div>
      
      <div className="flex flex-col justify-between h-full py-4">
        <nav className="flex-1 px-2 space-y-1">
          {sidebarItems.map((item) => (
            <Link
              key={item.title}
              to={item.path}
              className={cn(
                "flex items-center px-3 py-2 rounded-md text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground group",
                item.path === "/" ? "bg-sidebar-accent/50 text-teal-400" : ""
              )}
            >
              <item.icon className="flex-shrink-0 w-5 h-5 mr-3" />
              {!collapsed && <span>{item.title}</span>}
            </Link>
          ))}
        </nav>
        
        <div className="px-2 mt-auto">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setCollapsed(!collapsed)}
            className="w-full justify-center text-sidebar-foreground hover:bg-sidebar-accent"
          >
            {collapsed ? <ArrowRight size={16} /> : <ArrowLeft size={16} />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;

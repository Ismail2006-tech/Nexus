"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import styles from "../../app/(dashboard)/layout.module.css";
import { 
  LayoutDashboard, 
  Map, 
  MessageSquare, 
  BrainCircuit, 
  CheckSquare, 
  Users, 
  Calendar, 
  User, 
  Settings,
  LogOut,
  Lightbulb,
  FileText
} from "lucide-react";

export default function Sidebar() {
  const pathname = usePathname();

  const navItems = [
    { name: "Student Dashboard", href: "/dashboard", icon: LayoutDashboard },
    { name: "PLACEMENT ROAD MAP", href: "/roadmap", icon: Map },
    { name: "Career Roadmap", href: "/career", icon: Map },
    { name: "Project Recommendations", href: "/projects", icon: Lightbulb },
    { name: "AI Doubt Solver", href: "/doubts", icon: MessageSquare },
    { name: "AI Tutor", href: "/tutor", icon: BrainCircuit },
    { name: "Mock Tests", href: "/tests", icon: CheckSquare },
    { name: "Mock Interviews", href: "/interviews", icon: Users },
    { name: "Profile", href: "/profile", icon: User },
    { name: "Resume Builder", href: "/resume", icon: FileText },
    { name: "Settings", href: "/settings", icon: Settings },
  ];

  return (
    <aside className={styles.sidebar}>
      <div className={styles.sidebarLogo}>
        NEXUS
      </div>
      
      <nav className={styles.nav}>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = pathname === item.href;
          
          return (
            <Link 
              key={item.name} 
              href={item.href}
              className={`${styles.navItem} ${isActive ? styles.active : ""}`}
            >
              <Icon size={20} />
              {item.name}
            </Link>
          );
        })}
      </nav>

      <button onClick={() => signOut({ callbackUrl: '/' })} className={styles.logoutBtn}>
        <LogOut size={18} />
        Logout
      </button>
    </aside>
  );
}

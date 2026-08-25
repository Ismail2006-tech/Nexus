"use client";

import { usePathname } from "next/navigation";
import styles from "../../app/(dashboard)/layout.module.css";

interface HeaderProps {
  user: {
    name?: string | null;
    email?: string | null;
    image?: string | null;
  };
}

export default function Header({ user }: HeaderProps) {
  const pathname = usePathname();
  
  // Format pathname to display as title
  const title = pathname === "/dashboard" 
    ? "Dashboard" 
    : pathname.split("/")[1]?.charAt(0).toUpperCase() + pathname.split("/")[1]?.slice(1).replace("-", " ");

  const getInitials = (name?: string | null) => {
    if (!name) return "U";
    return name.split(" ").map(n => n[0]).join("").substring(0, 2).toUpperCase();
  };

  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>
        {title || "NEXUS"}
      </div>
      
      <div className={styles.userInfo}>
        <span className={styles.userName}>{user.name || user.email}</span>
        <div className={styles.avatar}>
          {getInitials(user.name)}
        </div>
      </div>
    </header>
  );
}

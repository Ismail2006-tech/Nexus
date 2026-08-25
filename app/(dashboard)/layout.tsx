import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Sidebar from "@/components/dashboard/Sidebar";
import Header from "@/components/dashboard/Header";
import styles from "./layout.module.css";
import { SessionProvider } from "next-auth/react";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return (
    <SessionProvider session={session}>
      <div className={styles.layout}>
        <Sidebar />
        <div className={styles.main}>
          <Header user={session.user} />
          <main className={styles.content}>
            {children}
          </main>
        </div>
      </div>
    </SessionProvider>
  );
}

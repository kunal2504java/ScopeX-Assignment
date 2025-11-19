import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { SidebarAnimated } from "@/components/sidebar-animated"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getSession()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-black">
      <Navbar user={user} />
      <div className="flex h-[calc(100vh-4rem)]">
        <SidebarAnimated role={user.role} />
        <main className="flex-1 overflow-y-auto p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

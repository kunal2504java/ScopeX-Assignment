import { getSession } from "@/lib/auth"
import { redirect } from "next/navigation"
import { Navbar } from "@/components/navbar"
import { Sidebar } from "@/components/sidebar"

interface DashboardLayoutProps {
  children: React.ReactNode
}

export async function DashboardLayout({ children }: DashboardLayoutProps) {
  const user = await getSession()

  if (!user) {
    redirect("/login")
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-black">
      <Navbar user={user} />
      <div className="flex">
        <Sidebar role={user.role} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  )
}

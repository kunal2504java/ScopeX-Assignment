"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
  LayoutDashboard,
  Users,
  FolderKanban,
  ListTodo,
  UserCircle,
  FileText,
  UsersRound,
} from "lucide-react"
import type { Role } from "@/types"

interface SidebarProps {
  role: Role
}

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
  roles: Role[]
}

const navItems: NavItem[] = [
  // Admin routes
  {
    title: "Dashboard",
    href: "/admin",
    icon: LayoutDashboard,
    roles: ["ADMIN"],
  },
  {
    title: "User Management",
    href: "/admin/users",
    icon: Users,
    roles: ["ADMIN"],
  },
  {
    title: "Reports",
    href: "/admin/reports",
    icon: FileText,
    roles: ["ADMIN"],
  },
  {
    title: "Audit Logs",
    href: "/admin/audit-logs",
    icon: FileText,
    roles: ["ADMIN"],
  },
  // Manager routes
  {
    title: "Dashboard",
    href: "/manager",
    icon: LayoutDashboard,
    roles: ["MANAGER"],
  },
  {
    title: "Projects",
    href: "/manager/projects",
    icon: FolderKanban,
    roles: ["MANAGER"],
  },
  {
    title: "Team",
    href: "/manager/team",
    icon: UsersRound,
    roles: ["MANAGER"],
  },
  // User routes
  {
    title: "My Tasks",
    href: "/user",
    icon: ListTodo,
    roles: ["USER"],
  },
  // Common routes
  {
    title: "Profile",
    href: "/profile",
    icon: UserCircle,
    roles: ["ADMIN", "MANAGER", "USER"],
  },
]

export function Sidebar({ role }: SidebarProps) {
  const pathname = usePathname()

  const filteredNavItems = navItems.filter((item) => item.roles.includes(role))

  return (
    <aside className="w-64 border-r bg-white dark:bg-zinc-950 dark:border-zinc-800 min-h-[calc(100vh-4rem)]">
      <nav className="flex flex-col gap-1 p-4">
        {filteredNavItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.href
          
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                isActive
                  ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                  : "text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-zinc-800"
              )}
            >
              <Icon className="h-5 w-5" />
              {item.title}
            </Link>
          )
        })}
      </nav>
    </aside>
  )
}

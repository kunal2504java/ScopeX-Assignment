"use client"

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
import {
  Sidebar,
  SidebarBody,
  SidebarLink,
} from "@/components/animated-sidebar"

interface SidebarAnimatedProps {
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

export function SidebarAnimated({ role }: SidebarAnimatedProps) {
  const pathname = usePathname()
  const filteredNavItems = navItems.filter((item) => item.roles.includes(role))

  const links = filteredNavItems.map((item) => {
    const Icon = item.icon
    const isActive = pathname === item.href
    
    return {
      label: item.title,
      href: item.href,
      icon: (
        <Icon
          className={cn(
            "h-5 w-5 flex-shrink-0",
            isActive
              ? "text-blue-600 dark:text-blue-400"
              : "text-slate-700 dark:text-slate-300"
          )}
        />
      ),
    }
  })

  return (
    <Sidebar>
      <SidebarBody className="justify-between gap-10">
        <div className="flex flex-col flex-1 overflow-y-auto overflow-x-hidden">
          <div className="mt-8 flex flex-col gap-2">
            {links.map((link, idx) => {
              const isActive = pathname === link.href
              return (
                <SidebarLink
                  key={idx}
                  link={link}
                  className={cn(
                    "rounded-lg px-3 py-2 transition-colors",
                    isActive
                      ? "bg-blue-50 text-blue-600 dark:bg-blue-900/20 dark:text-blue-400"
                      : "hover:bg-slate-100 dark:hover:bg-zinc-800"
                  )}
                />
              )
            })}
          </div>
        </div>
      </SidebarBody>
    </Sidebar>
  )
}

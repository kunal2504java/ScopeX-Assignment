"use client"

import { useRouter } from "next/navigation"
import { LogOut, User } from "lucide-react"
import { Button } from "@/components/ui/button"
import { ThemeToggle } from "@/components/theme-toggle"
import type { User as UserType } from "@/types"

interface NavbarProps {
  user: UserType
}

export function Navbar({ user }: NavbarProps) {
  const router = useRouter()

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", {
        method: "POST",
      })
      router.push("/login")
    } catch (error) {
      console.error("Logout error:", error)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white dark:bg-zinc-950 dark:border-zinc-800">
      <div className="flex h-16 items-center px-4 md:px-6">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-blue-600 flex items-center justify-center">
            <span className="text-white font-bold text-sm">SX</span>
          </div>
          <span className="font-bold text-xl">ScopeX</span>
        </div>
        
        <div className="ml-auto flex items-center gap-4">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-slate-500 dark:text-gray-400" />
            <div className="hidden md:block">
              <p className="text-sm font-medium text-slate-900 dark:text-white">{user.name}</p>
              <p className="text-xs text-slate-500 dark:text-gray-400">{user.role}</p>
            </div>
          </div>
          
          <ThemeToggle />
          
          <Button variant="ghost" size="icon" onClick={handleLogout}>
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </div>
    </header>
  )
}

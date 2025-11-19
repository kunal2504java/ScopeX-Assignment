"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"

export default function ResetTheme() {
  const router = useRouter()

  useEffect(() => {
    // Clear theme from localStorage
    localStorage.removeItem('scopex-theme')
    localStorage.removeItem('theme')
    
    // Remove dark class
    document.documentElement.classList.remove('dark')
    
    // Set to light
    localStorage.setItem('scopex-theme', 'light')
    
    // Redirect to login after 1 second
    setTimeout(() => {
      router.push('/login')
    }, 1000)
  }, [router])

  return (
    <div className="min-h-screen flex items-center justify-center bg-white">
      <div className="text-center">
        <h1 className="text-2xl font-bold text-black mb-4">Resetting Theme...</h1>
        <p className="text-gray-600">Redirecting to login page...</p>
      </div>
    </div>
  )
}

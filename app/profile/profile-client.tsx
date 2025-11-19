"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { User as UserIcon } from "lucide-react"

interface User {
  id: string
  email: string
  name: string
  role: string
  createdAt: string
}

export function ProfileClient() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  })
  const [message, setMessage] = useState("")

  useEffect(() => {
    fetchProfile()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await fetch("/api/auth/me")
      const data = await response.json()
      setUser(data.user)
      setFormData({
        name: data.user.name,
        email: data.user.email,
        password: "",
      })
    } catch (error) {
      console.error("Failed to fetch profile:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setMessage("")

    try {
      const updateData: any = {
        name: formData.name,
        email: formData.email,
      }

      if (formData.password) {
        updateData.password = formData.password
      }

      const response = await fetch(`/api/users/${user?.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updateData),
      })

      if (response.ok) {
        setMessage("Profile updated successfully!")
        setEditing(false)
        setFormData({ ...formData, password: "" })
        fetchProfile()
      } else {
        setMessage("Failed to update profile")
      }
    } catch (error) {
      console.error("Failed to update profile:", error)
      setMessage("An error occurred")
    }
  }

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case "ADMIN":
        return "destructive" as const
      case "MANAGER":
        return "default" as const
      default:
        return "secondary" as const
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>User not found</div>
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h1 className="text-3xl font-bold">Profile</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Manage your account information
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <div className="h-16 w-16 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
              <UserIcon className="h-8 w-8 text-blue-600" />
            </div>
            <div>
              <CardTitle>{user.name}</CardTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant={getRoleBadgeVariant(user.role)}>{user.role}</Badge>
                <span className="text-sm text-gray-500">{user.email}</span>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-500">Member Since</p>
                <p className="font-medium">
                  {new Date(user.createdAt).toLocaleDateString()}
                </p>
              </div>
              <div>
                <p className="text-gray-500">Account Status</p>
                <p className="font-medium text-green-600">Active</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Update Profile</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) =>
                  setFormData({ ...formData, name: e.target.value })
                }
                disabled={!editing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                disabled={!editing}
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">
                New Password (leave blank to keep current)
              </Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                disabled={!editing}
                placeholder="••••••••"
              />
            </div>

            {message && (
              <div
                className={`text-sm p-3 rounded-md ${
                  message.includes("success")
                    ? "bg-green-50 text-green-600"
                    : "bg-red-50 text-red-600"
                }`}
              >
                {message}
              </div>
            )}

            <div className="flex gap-2">
              {editing ? (
                <>
                  <Button type="submit">Save Changes</Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setEditing(false)
                      setFormData({
                        name: user.name,
                        email: user.email,
                        password: "",
                      })
                      setMessage("")
                    }}
                  >
                    Cancel
                  </Button>
                </>
              ) : (
                <Button type="button" onClick={() => setEditing(true)}>
                  Edit Profile
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

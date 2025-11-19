"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Select } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Activity } from "lucide-react"

interface AuditLog {
  id: string
  action: string
  userId: string
  details: string | null
  createdAt: string
  user: {
    id: string
    name: string
    email: string
    role: string
  }
}

export function AuditLogsClient() {
  const [logs, setLogs] = useState<AuditLog[]>([])
  const [loading, setLoading] = useState(true)
  const [actionFilter, setActionFilter] = useState("")

  useEffect(() => {
    fetchLogs()
  }, [actionFilter])

  const fetchLogs = async () => {
    try {
      const params = new URLSearchParams()
      if (actionFilter) params.append("action", actionFilter)

      const response = await fetch(`/api/audit-logs?${params}`)
      const data = await response.json()
      setLogs(data.logs || [])
    } catch (error) {
      console.error("Failed to fetch logs:", error)
    } finally {
      setLoading(false)
    }
  }

  const getActionBadgeVariant = (action: string) => {
    if (action.includes("LOGIN") || action.includes("LOGOUT")) return "default" as const
    if (action.includes("CREATED")) return "success" as const
    if (action.includes("DELETED")) return "destructive" as const
    if (action.includes("UPDATED")) return "warning" as const
    return "secondary" as const
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Audit Logs</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Track all system activities and user actions
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-4">
            <Activity className="h-5 w-5" />
            <Select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="w-64"
            >
              <option value="">All Actions</option>
              <option value="USER_LOGIN">User Login</option>
              <option value="USER_LOGOUT">User Logout</option>
              <option value="USER_CREATED">User Created</option>
              <option value="USER_UPDATED">User Updated</option>
              <option value="USER_DELETED">User Deleted</option>
              <option value="PROJECT_CREATED">Project Created</option>
              <option value="PROJECT_UPDATED">Project Updated</option>
              <option value="PROJECT_DELETED">Project Deleted</option>
              <option value="TASK_CREATED">Task Created</option>
              <option value="TASK_UPDATED">Task Updated</option>
              <option value="TASK_DELETED">Task Deleted</option>
            </Select>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.id}
                className="flex items-start gap-4 p-4 border rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <Badge variant={getActionBadgeVariant(log.action)}>
                      {log.action}
                    </Badge>
                    <span className="text-xs text-gray-500">
                      {new Date(log.createdAt).toLocaleString()}
                    </span>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {log.details}
                  </p>
                  <p className="text-xs text-gray-500 mt-1">
                    by {log.user.name} ({log.user.email}) • {log.user.role}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

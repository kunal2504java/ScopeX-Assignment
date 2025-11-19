"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Users, FolderKanban, ListTodo, TrendingUp } from "lucide-react"

export function ReportsClient() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReports()
  }, [])

  const fetchReports = async () => {
    try {
      const response = await fetch('/api/reports')
      if (response.ok) {
        const result = await response.json()
        setData(result)
      }
    } catch (error) {
      console.error('Failed to fetch reports:', error)
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reports & Analytics</h1>
        <p className="text-gray-500 dark:text-gray-400">
          System-wide statistics and insights
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalUsers || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Registered in system</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>
            <FolderKanban className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalProjects || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Active projects</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Tasks</CardTitle>
            <ListTodo className="h-4 w-4 text-purple-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{data?.totalTasks || 0}</div>
            <p className="text-xs text-gray-500 mt-1">Across all projects</p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5" />
              Users by Role
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.usersByRole?.map((item: any) => (
                <div key={item.role} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        item.role === 'ADMIN' ? 'destructive' : 
                        item.role === 'MANAGER' ? 'default' : 
                        'secondary'
                      }
                    >
                      {item.role}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{item._count.role}</span>
                    <span className="text-sm text-gray-500">users</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <ListTodo className="h-5 w-5" />
              Tasks by Status
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {data?.tasksByStatus?.map((item: any) => (
                <div key={item.status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge 
                      variant={
                        item.status === 'DONE' ? 'success' : 
                        item.status === 'IN_PROGRESS' ? 'warning' : 
                        'secondary'
                      }
                    >
                      {item.status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-2xl font-bold">{item._count.status}</span>
                    <span className="text-sm text-gray-500">tasks</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {data?.recentActivities?.map((activity: any) => (
              <div key={activity.id} className="flex items-start gap-4 pb-4 border-b last:border-0">
                <div className="flex-1">
                  <p className="text-sm font-medium">{activity.action}</p>
                  <p className="text-xs text-gray-500">{activity.details}</p>
                  <p className="text-xs text-gray-400 mt-1">
                    by {activity.user.name} • {new Date(activity.createdAt).toLocaleString()}
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

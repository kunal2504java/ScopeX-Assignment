"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Users, FolderKanban, ListTodo, Activity } from "lucide-react"

export function AdminDashboardClient() {
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

  const stats = [
    {
      title: "Total Users",
      value: data?.totalUsers || 0,
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-50 dark:bg-blue-900/20",
    },
    {
      title: "Total Projects",
      value: data?.totalProjects || 0,
      icon: FolderKanban,
      color: "text-green-600",
      bgColor: "bg-green-50 dark:bg-green-900/20",
    },
    {
      title: "Total Tasks",
      value: data?.totalTasks || 0,
      icon: ListTodo,
      color: "text-purple-600",
      bgColor: "bg-purple-50 dark:bg-purple-900/20",
    },
    {
      title: "Recent Activities",
      value: data?.recentActivities?.length || 0,
      icon: Activity,
      color: "text-orange-600",
      bgColor: "bg-orange-50 dark:bg-orange-900/20",
    },
  ]

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Admin Dashboard</h1>
        <p className="text-gray-500 dark:text-gray-400">
          Overview of system statistics and activities
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon
          return (
            <Card key={stat.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">
                  {stat.title}
                </CardTitle>
                <div className={`${stat.bgColor} p-2 rounded-lg`}>
                  <Icon className={`h-4 w-4 ${stat.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stat.value}</div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {data?.usersByRole && (
        <Card>
          <CardHeader>
            <CardTitle>Users by Role</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.usersByRole.map((item: any) => (
                <div key={item.role} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.role}</span>
                  <span className="text-sm text-gray-500">{item._count.role} users</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {data?.tasksByStatus && (
        <Card>
          <CardHeader>
            <CardTitle>Tasks by Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {data.tasksByStatus.map((item: any) => (
                <div key={item.status} className="flex items-center justify-between">
                  <span className="text-sm font-medium">{item.status.replace('_', ' ')}</span>
                  <span className="text-sm text-gray-500">{item._count.status} tasks</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}

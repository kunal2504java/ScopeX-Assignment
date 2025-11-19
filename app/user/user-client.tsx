"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Select } from "@/components/ui/select"
import { ListTodo, CheckCircle2, Clock, Circle } from "lucide-react"

interface Task {
  id: string
  title: string
  description: string | null
  status: string
  createdAt: string
  project: {
    id: string
    name: string
  }
}

export function UserTasksClient() {
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [statusFilter, setStatusFilter] = useState("")

  useEffect(() => {
    fetchTasks()
  }, [statusFilter])

  const fetchTasks = async () => {
    try {
      const params = new URLSearchParams()
      if (statusFilter) params.append("status", statusFilter)

      const response = await fetch(`/api/tasks?${params}`)
      const data = await response.json()
      setTasks(data.tasks || [])
    } catch (error) {
      console.error("Failed to fetch tasks:", error)
    } finally {
      setLoading(false)
    }
  }

  const updateTaskStatus = async (taskId: string, newStatus: string) => {
    try {
      const response = await fetch(`/api/tasks/${taskId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      })

      if (response.ok) {
        fetchTasks()
      }
    } catch (error) {
      console.error("Failed to update task:", error)
    }
  }

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case "DONE":
        return "success" as const
      case "IN_PROGRESS":
        return "warning" as const
      default:
        return "secondary" as const
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "DONE":
        return <CheckCircle2 className="h-5 w-5 text-green-600" />
      case "IN_PROGRESS":
        return <Clock className="h-5 w-5 text-yellow-600" />
      default:
        return <Circle className="h-5 w-5 text-gray-400" />
    }
  }

  const tasksByStatus = {
    TODO: tasks.filter((t) => t.status === "TODO"),
    IN_PROGRESS: tasks.filter((t) => t.status === "IN_PROGRESS"),
    DONE: tasks.filter((t) => t.status === "DONE"),
  }

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Tasks</h1>
          <p className="text-gray-500 dark:text-gray-400">
            View and manage your assigned tasks
          </p>
        </div>
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-48"
        >
          <option value="">All Status</option>
          <option value="TODO">To Do</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="DONE">Done</option>
        </Select>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">To Do</h3>
            <Badge variant="secondary">{tasksByStatus.TODO.length}</Badge>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">In Progress</h3>
            <Badge variant="warning">{tasksByStatus.IN_PROGRESS.length}</Badge>
          </CardHeader>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h3 className="text-sm font-medium">Done</h3>
            <Badge variant="success">{tasksByStatus.DONE.length}</Badge>
          </CardHeader>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        {/* To Do Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Circle className="h-5 w-5 text-gray-400" />
            To Do
          </h2>
          {tasksByStatus.TODO.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {task.description || "No description"}
                    </p>
                  </div>
                  <Badge variant="outline">{task.project.name}</Badge>
                  <Select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="w-full"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* In Progress Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <Clock className="h-5 w-5 text-yellow-600" />
            In Progress
          </h2>
          {tasksByStatus.IN_PROGRESS.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow border-yellow-200">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-1">{task.title}</h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {task.description || "No description"}
                    </p>
                  </div>
                  <Badge variant="outline">{task.project.name}</Badge>
                  <Select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="w-full"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Done Column */}
        <div className="space-y-4">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <CheckCircle2 className="h-5 w-5 text-green-600" />
            Done
          </h2>
          {tasksByStatus.DONE.map((task) => (
            <Card key={task.id} className="hover:shadow-md transition-shadow border-green-200">
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-semibold mb-1 line-through text-gray-500">
                      {task.title}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {task.description || "No description"}
                    </p>
                  </div>
                  <Badge variant="outline">{task.project.name}</Badge>
                  <Select
                    value={task.status}
                    onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                    className="w-full"
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </Select>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}

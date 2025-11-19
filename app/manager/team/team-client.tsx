"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select } from "@/components/ui/select"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Search } from "lucide-react"

interface User {
  id: string
  name: string
  email: string
  role: string
}

interface Project {
  id: string
  name: string
}

interface Task {
  id: string
  title: string
  status: string
  project: {
    name: string
  }
  assignedTo: {
    name: string
  }
}

export function TeamPageClient() {
  const [users, setUsers] = useState<User[]>([])
  const [projects, setProjects] = useState<Project[]>([])
  const [tasks, setTasks] = useState<Task[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    projectId: "",
    assignedToId: "",
    status: "TODO",
  })

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const [usersRes, projectsRes, tasksRes] = await Promise.all([
        fetch("/api/users"),
        fetch("/api/projects"),
        fetch("/api/tasks"),
      ])

      const [usersData, projectsData, tasksData] = await Promise.all([
        usersRes.json(),
        projectsRes.json(),
        tasksRes.json(),
      ])

      setUsers(usersData.users?.filter((u: User) => u.role === "USER") || [])
      setProjects(projectsData.projects || [])
      setTasks(tasksData.tasks || [])
    } catch (error) {
      console.error("Failed to fetch data:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    try {
      const response = await fetch("/api/tasks", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        setShowModal(false)
        setFormData({
          title: "",
          description: "",
          projectId: "",
          assignedToId: "",
          status: "TODO",
        })
        fetchData()
      }
    } catch (error) {
      console.error("Failed to create task:", error)
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

  if (loading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Team Management</h1>
          <p className="text-gray-500 dark:text-gray-400">
            Assign tasks to team members
          </p>
        </div>
        <Button onClick={() => setShowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Assign Task
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Team Members</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {users.map((user) => {
                const userTasks = tasks.filter((t) => t.assignedTo.name === user.name)
                return (
                  <div
                    key={user.id}
                    className="flex items-center justify-between p-3 border rounded-lg"
                  >
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-gray-500">{user.email}</p>
                    </div>
                    <Badge variant="secondary">{userTasks.length} tasks</Badge>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <h2 className="text-xl font-semibold">Recent Task Assignments</h2>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {tasks.slice(0, 10).map((task) => (
                <div key={task.id} className="p-3 border rounded-lg">
                  <div className="flex items-start justify-between mb-2">
                    <p className="font-medium">{task.title}</p>
                    <Badge variant={getStatusBadgeVariant(task.status)}>
                      {task.status.replace("_", " ")}
                    </Badge>
                  </div>
                  <p className="text-sm text-gray-500">
                    {task.project.name} • Assigned to {task.assignedTo.name}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <Card className="w-full max-w-md">
            <CardHeader>
              <h2 className="text-xl font-bold">Assign New Task</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Task Title</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="flex min-h-[80px] w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm ring-offset-white placeholder:text-gray-400 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="projectId">Project</Label>
                  <Select
                    id="projectId"
                    value={formData.projectId}
                    onChange={(e) =>
                      setFormData({ ...formData, projectId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select a project</option>
                    {projects.map((project) => (
                      <option key={project.id} value={project.id}>
                        {project.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="assignedToId">Assign To</Label>
                  <Select
                    id="assignedToId"
                    value={formData.assignedToId}
                    onChange={(e) =>
                      setFormData({ ...formData, assignedToId: e.target.value })
                    }
                    required
                  >
                    <option value="">Select a team member</option>
                    {users.map((user) => (
                      <option key={user.id} value={user.id}>
                        {user.name}
                      </option>
                    ))}
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="status">Status</Label>
                  <Select
                    id="status"
                    value={formData.status}
                    onChange={(e) =>
                      setFormData({ ...formData, status: e.target.value })
                    }
                  >
                    <option value="TODO">To Do</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="DONE">Done</option>
                  </Select>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" className="flex-1">
                    Assign Task
                  </Button>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => {
                      setShowModal(false)
                      setFormData({
                        title: "",
                        description: "",
                        projectId: "",
                        assignedToId: "",
                        status: "TODO",
                      })
                    }}
                  >
                    Cancel
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  )
}

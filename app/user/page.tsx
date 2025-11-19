import { DashboardLayout } from "@/components/dashboard-layout"
import { UserTasksClient } from "./user-client"

export default function UserTasksPage() {
  return (
    <DashboardLayout>
      <UserTasksClient />
    </DashboardLayout>
  )
}

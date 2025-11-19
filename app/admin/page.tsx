import { DashboardLayout } from "@/components/dashboard-layout"
import { AdminDashboardClient } from "./admin-dashboard-client"

export default function AdminDashboard() {
  return (
    <DashboardLayout>
      <AdminDashboardClient />
    </DashboardLayout>
  )
}

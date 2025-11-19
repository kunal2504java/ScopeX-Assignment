import { DashboardLayout } from "@/components/dashboard-layout"
import { UsersPageClient } from "./users-client"

export default function UsersPage() {
  return (
    <DashboardLayout>
      <UsersPageClient />
    </DashboardLayout>
  )
}

import { DashboardLayout } from "@/components/dashboard-layout"
import { AuditLogsClient } from "./audit-logs-client"

export default function AuditLogsPage() {
  return (
    <DashboardLayout>
      <AuditLogsClient />
    </DashboardLayout>
  )
}

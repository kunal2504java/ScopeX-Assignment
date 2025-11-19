import { DashboardLayout } from "@/components/dashboard-layout"
import { ProjectsPageClient } from "./projects-client"

export default function ProjectsPage() {
  return (
    <DashboardLayout>
      <ProjectsPageClient />
    </DashboardLayout>
  )
}

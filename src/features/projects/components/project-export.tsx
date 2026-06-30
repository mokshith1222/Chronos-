"use client"

import { Button, buttonVariants } from "@/components/ui/button"
import { Download } from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { exportToJSON, exportToCSV } from "@/lib/export-utils"
import { useProjects } from "@/hooks/use-projects-queries"

export function ProjectExportButton() {
  const { data: projects } = useProjects()

  const handleExportJSON = () => {
    if (projects) {
      exportToJSON(projects, `focused_planck_projects_${new Date().toISOString().split('T')[0]}`)
    }
  }

  const handleExportCSV = () => {
    if (projects) {
      // Flatten specific data for CSV
      const flattened = projects.map((p: any) => ({
        id: p.id,
        name: p.name,
        status: p.status,
        color: p.color,
        isArchived: p.isArchived,
        totalTasks: p._count?.tasks || 0,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt
      }))
      exportToCSV(flattened, `focused_planck_projects_${new Date().toISOString().split('T')[0]}`)
    }
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger className={buttonVariants({ variant: "outline", size: "sm", className: "h-9" })}>
        <Download className="h-4 w-4 mr-2" />
        Export
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={handleExportJSON}>Export as JSON</DropdownMenuItem>
        <DropdownMenuItem onClick={handleExportCSV}>Export as CSV</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

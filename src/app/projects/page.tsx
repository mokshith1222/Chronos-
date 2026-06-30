"use client"

import { useState } from "react"
import { useProjectsStore } from "@/stores/projects-store"
import { ProjectsToolbar } from "@/features/projects/components/projects-toolbar"
import { ProjectsGrid } from "@/features/projects/components/projects-grid"
import { ProjectsList } from "@/features/projects/components/projects-list"
import { CreateProjectModal } from "@/features/projects/components/create-project-modal"
import { EditProjectModal } from "@/features/projects/components/edit-project-modal"
import { DeleteProjectModal } from "@/features/projects/components/delete-project-modal"
import { useArchiveProject } from "@/hooks/use-projects-queries"
import { toast } from "sonner"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function ProjectsPage() {
  const { viewMode } = useProjectsStore()
  const archiveProject = useArchiveProject()
  
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)
  const [selectedProject, setSelectedProject] = useState<any>(null)

  const handleEdit = (project: any) => {
    setSelectedProject(project)
    setIsEditOpen(true)
  }

  const handleDelete = (project: any) => {
    setSelectedProject(project)
    setIsDeleteOpen(true)
  }

  const handleArchive = (project: any) => {
    archiveProject.mutate({ id: project.id, isArchived: !project.isArchived }, {
      onSuccess: () => {
        toast.success(`Project ${project.isArchived ? 'restored' : 'archived'} successfully`)
      }
    })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight">Projects</h1>
          <p className="text-sm text-muted-foreground mt-1">Manage and track your workspaces.</p>
        </div>

        <main className="flex-1 w-full mx-auto">
          <ProjectsToolbar onNewProject={() => setIsCreateOpen(true)} />
          
          {viewMode === "grid" ? (
            <ProjectsGrid onEdit={handleEdit} onDelete={handleDelete} onArchive={handleArchive} />
          ) : (
            <ProjectsList onEdit={handleEdit} onDelete={handleDelete} onArchive={handleArchive} />
          )}
        </main>
      </div>
      
      <CreateProjectModal open={isCreateOpen} onOpenChange={setIsCreateOpen} />
      <EditProjectModal project={selectedProject} open={isEditOpen} onOpenChange={setIsEditOpen} />
      <DeleteProjectModal project={selectedProject} open={isDeleteOpen} onOpenChange={setIsDeleteOpen} />
    </DashboardLayout>
  )
}

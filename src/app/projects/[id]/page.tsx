"use client"

import { useState, use } from "react"
import { useProject, useArchiveProject } from "@/hooks/use-projects-queries"
import { ProjectHeader } from "@/features/projects/components/project-header"
import { ProjectOverview } from "@/features/projects/components/project-overview"
import dynamic from "next/dynamic"

const ProjectDashboard = dynamic(
  () => import("@/features/projects/components/project-dashboard").then((mod) => mod.ProjectDashboard),
  {
    ssr: false,
    loading: () => <Skeleton className="h-[400px] w-full rounded-xl mt-8" />
  }
)
import { EditProjectModal } from "@/features/projects/components/edit-project-modal"
import { DeleteProjectModal } from "@/features/projects/components/delete-project-modal"
import { Skeleton } from "@/components/ui/skeleton"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function ProjectDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const router = useRouter()
  const resolvedParams = use(params)
  const { data: project, isLoading, isError } = useProject(resolvedParams.id)
  const archiveProject = useArchiveProject()

  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isDeleteOpen, setIsDeleteOpen] = useState(false)

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background p-6 max-w-[1600px] mx-auto w-full space-y-8">
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <Skeleton key={i} className="h-32 rounded-xl" />
          ))}
        </div>
      </div>
    )
  }

  if (isError || !project) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center text-destructive">
        <h2>Project not found</h2>
        <p className="text-muted-foreground mt-2">The project may have been deleted or you don't have access.</p>
      </div>
    )
  }

  const handleArchive = () => {
    archiveProject.mutate({ id: project.id, isArchived: !project.isArchived }, {
      onSuccess: () => {
        toast.success(`Project ${project.isArchived ? 'restored' : 'archived'} successfully`)
      }
    })
  }

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <main className="flex-1 px-6 max-w-[1600px] w-full mx-auto">
        <ProjectHeader 
          project={project} 
          onEdit={() => setIsEditOpen(true)}
          onDelete={() => setIsDeleteOpen(true)}
          onArchive={handleArchive}
        />
        
        <ProjectOverview project={project} />
        
        <ProjectDashboard projectId={project.id} />
      </main>

      <EditProjectModal project={project} open={isEditOpen} onOpenChange={setIsEditOpen} />
      <DeleteProjectModal 
        project={project} 
        open={isDeleteOpen} 
        onOpenChange={(open) => {
          setIsDeleteOpen(open)
          // If the modal was closed and the project is deleted, the query will fail and show "not found", but we should redirect.
          if (!open && !project) {
            router.push("/projects")
          }
        }} 
      />
    </div>
  )
}

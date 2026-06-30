"use client"

import { useProjects } from "@/hooks/use-projects-queries"
import { useProjectsStore } from "@/stores/projects-store"
import { ProjectCard } from "./project-card"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderX } from "lucide-react"

interface ProjectsGridProps {
  onEdit: (project: any) => void
  onDelete: (project: any) => void
  onArchive: (project: any) => void
}

export function ProjectsGrid({ onEdit, onDelete, onArchive }: ProjectsGridProps) {
  const { data: projects, isLoading, isError } = useProjects()
  const { searchQuery } = useProjectsStore()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
        {[...Array(8)].map((_, i) => (
          <div key={i} className="flex flex-col gap-4 border rounded-xl p-6 bg-card h-[200px]">
            <div className="flex items-center gap-4">
              <Skeleton className="w-10 h-10 rounded-xl" />
              <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
              </div>
            </div>
            <div className="mt-auto space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-5/6" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  if (isError || !projects) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-destructive">
        <p>Failed to load projects</p>
      </div>
    )
  }

  const filteredProjects = projects.filter((p: any) => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase()) && !p.isArchived
  )

  if (filteredProjects.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-muted-foreground">
        <FolderX className="w-12 h-12 mb-4 opacity-20" />
        <h3 className="text-lg font-medium text-foreground">No projects found</h3>
        <p className="text-sm mt-1">Try adjusting your search or filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 py-6">
      {filteredProjects.map((project: any) => (
        <ProjectCard
          key={project.id}
          project={project}
          onEdit={onEdit}
          onDelete={onDelete}
          onArchive={onArchive}
        />
      ))}
    </div>
  )
}

"use client"

import { useProjects } from "@/hooks/use-projects-queries"
import { useProjectsStore } from "@/stores/projects-store"
import { ProjectListItem } from "./project-list-item"
import { Skeleton } from "@/components/ui/skeleton"
import { FolderX } from "lucide-react"

interface ProjectsListProps {
  onEdit: (project: any) => void
  onDelete: (project: any) => void
  onArchive: (project: any) => void
}

export function ProjectsList({ onEdit, onDelete, onArchive }: ProjectsListProps) {
  const { data: projects, isLoading, isError } = useProjects()
  const { searchQuery } = useProjectsStore()

  if (isLoading) {
    return (
      <div className="flex flex-col gap-3 py-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 border rounded-xl p-4 bg-card h-[74px]">
            <Skeleton className="w-10 h-10 rounded-lg" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="w-32 h-6 hidden md:block" />
            <Skeleton className="w-32 h-6 hidden sm:block" />
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
    <div className="flex flex-col gap-3 py-6">
      {filteredProjects.map((project: any) => (
        <ProjectListItem
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

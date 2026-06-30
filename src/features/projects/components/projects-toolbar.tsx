"use client"

import { useProjectsStore } from "@/stores/projects-store"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, LayoutGrid, List, Filter } from "lucide-react"
import { ProjectExportButton } from "./project-export"

interface ProjectsToolbarProps {
  onNewProject: () => void
}

export function ProjectsToolbar({ onNewProject }: ProjectsToolbarProps) {
  const { viewMode, setViewMode, searchQuery, setSearchQuery } = useProjectsStore()

  return (
    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 py-4 border-b">
      <div className="relative w-full max-w-md">
        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <Search className="h-4 w-4 text-muted-foreground" />
        </div>
        <Input
          type="text"
          className="pl-9 bg-background/50 backdrop-blur-sm"
          placeholder="Search projects..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />
      </div>

      <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto pb-2 sm:pb-0">
        <div className="flex items-center p-1 bg-muted/50 rounded-lg border shrink-0">
          <Button
            variant={viewMode === "grid" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2.5"
            onClick={() => setViewMode("grid")}
          >
            <LayoutGrid className="h-4 w-4" />
          </Button>
          <Button
            variant={viewMode === "list" ? "default" : "ghost"}
            size="sm"
            className="h-7 px-2.5"
            onClick={() => setViewMode("list")}
          >
            <List className="h-4 w-4" />
          </Button>
        </div>

        <Button variant="outline" size="sm" className="h-9 shrink-0">
          <Filter className="h-4 w-4 mr-2" />
          Filters
        </Button>

        <ProjectExportButton />

        <Button size="sm" className="h-9 shrink-0" onClick={onNewProject}>
          New Project
        </Button>
      </div>
    </div>
  )
}

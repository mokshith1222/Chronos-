"use client"

import { useTasksStore, TaskViewMode } from "@/stores/tasks-store"
import { useProjects } from "@/hooks/use-projects-queries"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, LayoutGrid, List, Calendar, Kanban, Filter, Plus, Clock } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface TasksToolbarProps {
  onNewTask: () => void
}

export function TasksToolbar({ onNewTask }: TasksToolbarProps) {
  const { 
    viewMode, 
    setViewMode, 
    searchQuery, 
    setSearchQuery,
    projectFilter,
    setProjectFilter,
    statusFilter,
    setStatusFilter
  } = useTasksStore()
  
  const { data: projects } = useProjects()

  const views: { id: TaskViewMode; icon: any; label: string }[] = [
    { id: "list", icon: List, label: "List" },
    { id: "kanban", icon: Kanban, label: "Board" },
  ]

  return (
    <div className="flex flex-col gap-4 py-4 border-b">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="h-4 w-4 text-muted-foreground" />
          </div>
          <Input
            type="text"
            className="pl-9 bg-background/50 backdrop-blur-sm"
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0">
          <div className="flex items-center p-1 bg-muted/50 rounded-lg border shrink-0">
            {views.map((v) => {
              const Icon = v.icon
              return (
                <Button
                  key={v.id}
                  variant={viewMode === v.id ? "default" : "ghost"}
                  size="sm"
                  className="h-7 px-2.5"
                  onClick={() => setViewMode(v.id)}
                >
                  <Icon className="h-4 w-4 mr-1.5" />
                  <span className="text-xs">{v.label}</span>
                </Button>
              )
            })}
          </div>

          <Button size="sm" className="h-9 shrink-0" onClick={onNewTask}>
            <Plus className="h-4 w-4 mr-1.5" />
            New Task
          </Button>
        </div>
      </div>

      <div className="flex items-center gap-3 flex-wrap text-xs text-muted-foreground">
        <div className="flex items-center gap-1.5">
          <span>Project:</span>
          <Select 
            value={projectFilter || "all"} 
            onValueChange={(val) => setProjectFilter(val === "all" ? null : val)}
          >
            <SelectTrigger className="h-7 text-xs w-[130px] bg-background">
              <SelectValue>
                {projectFilter 
                  ? (projects?.find((p: any) => p.id === projectFilter)?.name || "All Projects")
                  : "All Projects"
                }
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all" label="All Projects">All Projects</SelectItem>
              {projects?.map((project: any) => (
                <SelectItem key={project.id} value={project.id} label={project.name}>
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="flex items-center gap-1.5">
          <span>Status:</span>
          <Select 
            value={statusFilter[0] || "all"} 
            onValueChange={(val) => setStatusFilter(val === "all" ? [] : [val].filter(Boolean) as string[])}
          >
            <SelectTrigger className="h-7 text-xs w-[130px] bg-background">
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Statuses</SelectItem>
              <SelectItem value="BACKLOG">Backlog</SelectItem>
              <SelectItem value="TODO">Todo</SelectItem>
              <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
              <SelectItem value="DONE">Done</SelectItem>
              <SelectItem value="CANCELED">Canceled</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

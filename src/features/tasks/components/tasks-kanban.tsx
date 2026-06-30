"use client"

import { useState } from "react"
import { useTasks, useUpdateTask } from "@/hooks/use-tasks-queries"
import { useTasksStore } from "@/stores/tasks-store"
import { TaskCard } from "./task-card"
import { Badge } from "@/components/ui/badge"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const COLUMNS = [
  { id: "BACKLOG", label: "Backlog" },
  { id: "TODO", label: "Todo" },
  { id: "IN_PROGRESS", label: "In Progress" },
  { id: "DONE", label: "Done" },
  { id: "CANCELED", label: "Canceled" },
] as const

interface TasksKanbanProps {
  onNewTaskWithStatus: (status: string) => void
}

export function TasksKanban({ onNewTaskWithStatus }: TasksKanbanProps) {
  const { searchQuery, projectFilter, statusFilter } = useTasksStore()
  const { data: tasks, isLoading } = useTasks({
    projectId: projectFilter || undefined,
  })
  const updateTask = useUpdateTask()
  const [activeColumn, setActiveColumn] = useState<string | null>(null)

  const visibleColumns = statusFilter.length > 0
    ? COLUMNS.filter((col) => statusFilter.includes(col.id))
    : COLUMNS

  const gridColsClass = 
    visibleColumns.length === 1 ? "grid-cols-1 max-w-sm" :
    visibleColumns.length === 2 ? "grid-cols-1 md:grid-cols-2 max-w-2xl" :
    visibleColumns.length === 3 ? "grid-cols-1 md:grid-cols-3 max-w-4xl" :
    visibleColumns.length === 4 ? "grid-cols-1 md:grid-cols-4" :
    "grid-cols-1 md:grid-cols-5"

  if (isLoading) {
    return (
      <div className={cn("grid gap-4 py-6 overflow-x-auto", gridColsClass)}>
        {visibleColumns.map((col) => (
          <div key={col.id} className="flex flex-col gap-3 min-w-[240px] bg-muted/30 rounded-xl p-3 border h-[600px]">
            <div className="flex items-center justify-between">
              <span className="font-semibold text-sm">{col.label}</span>
              <span className="w-5 h-5 rounded-full bg-muted flex items-center justify-center text-xs">0</span>
            </div>
            <div className="space-y-3">
              <div className="h-28 border rounded-xl bg-card animate-pulse" />
              <div className="h-28 border rounded-xl bg-card animate-pulse" />
            </div>
          </div>
        ))}
      </div>
    )
  }

  // Client side filtering for search
  const filteredTasks = (tasks || []).filter((task: any) =>
    task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
  )

  const handleDragStart = (e: React.DragEvent, taskId: string) => {
    e.dataTransfer.setData("text/plain", taskId)
  }

  const handleDragOver = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setActiveColumn(columnId)
  }

  const handleDrop = (e: React.DragEvent, columnId: string) => {
    e.preventDefault()
    setActiveColumn(null)
    const taskId = e.dataTransfer.getData("text/plain")
    if (taskId) {
      updateTask.mutate({ id: taskId, data: { status: columnId as any } })
    }
  }

  const getTasksByStatus = (status: string) => {
    return filteredTasks.filter((task: any) => task.status === status)
  }

  return (
    <div className={cn("grid gap-4 py-6 overflow-x-auto", gridColsClass)}>
      {visibleColumns.map((col) => {
        const columnTasks = getTasksByStatus(col.id)
        
        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDragLeave={() => setActiveColumn(null)}
            onDrop={(e) => handleDrop(e, col.id)}
            className={cn(
              "flex flex-col gap-3 min-w-[240px] bg-muted/30 rounded-xl p-3 border transition-colors duration-200 min-h-[600px] h-fit",
              activeColumn === col.id ? "bg-primary/5 border-primary/30" : "border-transparent"
            )}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm text-foreground">{col.label}</span>
                <span className="text-xs text-muted-foreground bg-muted px-2 py-0.5 rounded-full">
                  {columnTasks.length}
                </span>
              </div>
              
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-7 w-7 rounded-lg text-muted-foreground hover:text-foreground"
                onClick={() => onNewTaskWithStatus(col.id)}
              >
                <Plus className="h-4 w-4" />
              </Button>
            </div>

            <div className="flex flex-col gap-3 flex-1 overflow-y-auto">
              {columnTasks.map((task: any) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task.id)}
                  className="active:cursor-grabbing cursor-grab"
                >
                  <TaskCard task={task} />
                </div>
              ))}
              
              {columnTasks.length === 0 && (
                <div className="flex-1 border border-dashed border-border/60 rounded-xl flex items-center justify-center p-8 text-center text-xs text-muted-foreground">
                  No tasks here
                </div>
              )}
            </div>
          </div>
        )
      })}
    </div>
  )
}

"use client"

import { useTasks } from "@/hooks/use-tasks-queries"
import { useTasksStore } from "@/stores/tasks-store"
import { TaskListItem } from "./task-list-item"
import { Skeleton } from "@/components/ui/skeleton"
import { CheckSquare2 } from "lucide-react"

export function TasksList() {
  const { searchQuery, projectFilter, statusFilter, priorityFilter } = useTasksStore()
  
  // Pass filters down to the query
  const { data: tasks, isLoading, isError } = useTasks({
    projectId: projectFilter || undefined,
  })

  if (isLoading) {
    return (
      <div className="flex flex-col gap-2.5 py-6">
        {[...Array(6)].map((_, i) => (
          <div key={i} className="flex items-center gap-4 border rounded-xl p-4 bg-card h-[64px]">
            <Skeleton className="w-5 h-5 rounded-full" />
            <div className="space-y-2 flex-1">
              <Skeleton className="h-4 w-48" />
              <Skeleton className="h-3 w-32" />
            </div>
            <Skeleton className="w-24 h-6 rounded-md" />
            <Skeleton className="w-24 h-6 rounded-md" />
          </div>
        ))}
      </div>
    )
  }

  if (isError || !tasks) {
    return (
      <div className="py-20 flex flex-col items-center justify-center text-destructive">
        <p>Failed to load tasks</p>
      </div>
    )
  }

  // Client side filtering for search & status
  const filteredTasks = tasks.filter((task: any) => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    const matchesStatus = statusFilter.length === 0 || statusFilter.includes(task.status)
    const matchesPriority = priorityFilter.length === 0 || priorityFilter.includes(task.priority)

    return matchesSearch && matchesStatus && matchesPriority
  })

  if (filteredTasks.length === 0) {
    return (
      <div className="py-32 flex flex-col items-center justify-center text-muted-foreground">
        <CheckSquare2 className="w-12 h-12 mb-4 opacity-20" />
        <h3 className="text-lg font-medium text-foreground">No tasks found</h3>
        <p className="text-sm mt-1">Try adjusting your filters or create a new task.</p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-2.5 py-6">
      {filteredTasks.map((task: any) => (
        <TaskListItem key={task.id} task={task} />
      ))}
    </div>
  )
}

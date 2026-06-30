"use client"

import { useState, useEffect } from "react"
import { useTasks, useUpdateTask } from "@/hooks/use-tasks-queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus, GripVertical, Calendar, Sparkles, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function DailyPlanner() {
  const { data: tasks, isLoading } = useTasks()
  const updateTask = useUpdateTask()
  
  const [newPriorityTitle, setNewPriorityTitle] = useState("")
  const [priorities, setPriorities] = useState<{ id: string; title: string; completed: boolean }[]>([])

  // Load from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("chronos-daily-focus")
    if (saved) {
      try {
        setPriorities(JSON.parse(saved))
      } catch (e) {
        console.error("Failed to load daily focus from localStorage:", e)
      }
    }
  }, [])

  // Save to localStorage whenever priorities change
  const savePriorities = (updated: typeof priorities) => {
    setPriorities(updated)
    localStorage.setItem("chronos-daily-focus", JSON.stringify(updated))
  }

  const handleAddPriority = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newPriorityTitle.trim()) return
    const updated = [
      ...priorities,
      { id: Date.now().toString(), title: newPriorityTitle.trim(), completed: false }
    ]
    savePriorities(updated)
    setNewPriorityTitle("")
  }

  const togglePriority = (id: string) => {
    const updated = priorities.map(p => p.id === id ? { ...p, completed: !p.completed } : p)
    savePriorities(updated)
  }

  const handleDeletePriority = (id: string) => {
    const updated = priorities.filter(p => p.id !== id)
    savePriorities(updated)
  }

  const handleDragStart = (e: React.DragEvent, task: any) => {
    // Pack task details into drag transfer
    e.dataTransfer.setData("application/json", JSON.stringify({
      title: task.title,
      description: task.description,
      taskId: task.id,
      projectId: task.projectId,
    }))
  }

  const unscheduledTasks = (tasks || []).filter((task: any) => !task.dueDate && task.status !== "DONE")

  return (
    <div className="space-y-6">
      {/* Daily Priorities */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Sparkles className="w-4 h-4 text-amber-500" />
            Daily Focus Priorities
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="space-y-2">
            {priorities.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">
                No focus priorities set for today. Add one below!
              </p>
            ) : (
              priorities.map((priority) => (
                <div key={priority.id} className="flex items-center justify-between p-1.5 hover:bg-accent/20 rounded-lg group">
                  <div className="flex items-center gap-3">
                    <Checkbox
                      checked={priority.completed}
                      onCheckedChange={() => togglePriority(priority.id)}
                    />
                    <span className={cn("text-xs font-medium", priority.completed && "line-through text-muted-foreground")}>
                      {priority.title}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeletePriority(priority.id)}
                    className="opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity cursor-pointer p-0.5"
                    aria-label="Delete focus priority"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>

          <form onSubmit={handleAddPriority} className="flex gap-2">
            <Input
              placeholder="Add daily focus..."
              value={newPriorityTitle}
              onChange={(e) => setNewPriorityTitle(e.target.value)}
              className="h-8 text-xs bg-background/20"
            />
            <Button type="submit" size="sm" className="h-8 px-2.5 shrink-0">
              <Plus className="w-3.5 h-3.5" />
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Unscheduled Tasks for Drag & Drop Time Blocking */}
      <Card className="border-border/60 bg-card/60 backdrop-blur-sm">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-1.5">
            <Calendar className="w-4 h-4 text-primary" />
            Unscheduled Tasks
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <div className="space-y-2 animate-pulse">
              <div className="h-8 bg-muted rounded" />
              <div className="h-8 bg-muted rounded" />
            </div>
          ) : unscheduledTasks.length === 0 ? (
            <div className="py-8 text-center text-xs text-muted-foreground">
              All tasks are scheduled!
            </div>
          ) : (
            <div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
              {unscheduledTasks.map((task: any) => (
                <div
                  key={task.id}
                  draggable
                  onDragStart={(e) => handleDragStart(e, task)}
                  className="flex items-center gap-3 p-2 bg-background/30 hover:bg-background/70 border rounded-lg cursor-grab active:cursor-grabbing group transition-all"
                >
                  <GripVertical className="w-3.5 h-3.5 text-muted-foreground shrink-0" />
                  <span className="text-xs font-semibold truncate text-foreground group-hover:text-primary transition-colors">
                    {task.title}
                  </span>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

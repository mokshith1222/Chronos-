"use client"

import { Badge } from "@/components/ui/badge"
import { Calendar, CheckSquare, Clock, MoreHorizontal, Flag, Bookmark, Play, Pause } from "lucide-react"
import { buttonVariants } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useUpdateTask, useDeleteTask } from "@/hooks/use-tasks-queries"
import { useActiveSession, useStartSession, useStopSession } from "@/hooks/use-time-queries"
import { useTimerStore } from "@/stores/timer-store"
import { useTasksStore } from "@/stores/tasks-store"
import { cn } from "@/lib/utils"

interface TaskListItemProps {
  task: any
}

export function TaskListItem({ task }: TaskListItemProps) {
  const updateTask = useUpdateTask()
  const deleteTask = useDeleteTask()
  const setSelectedTaskId = useTasksStore((state) => state.setSelectedTaskId)

  const { data: activeSession } = useActiveSession()
  const startSession = useStartSession()
  const stopSession = useStopSession()

  const { countdownRemaining, elapsedSeconds } = useTimerStore()

  const isActive = activeSession?.taskId === task.id

  const handleTimerToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (isActive) {
      // Pause/Stop: Stop the server session and save the exact time tracked so far
      stopSession.mutate()
    } else {
      // Start: Start a new server session
      startSession.mutate({
        taskId: task.id,
        projectId: task.projectId,
        type: task.estimatedTime ? "COUNTDOWN" : "NORMAL",
        description: `Working on: ${task.title}`
      })
    }
  }

  const completedChecklist = task.checklists?.filter((item: any) => item.isCompleted).length || 0
  const totalChecklist = task.checklists?.length || 0

  const priorityColors = {
    URGENT: "text-red-500 bg-red-500/10 border-red-500/20",
    HIGH: "text-orange-500 bg-orange-500/10 border-orange-500/20",
    MEDIUM: "text-blue-500 bg-blue-500/10 border-blue-500/20",
    LOW: "text-slate-500 bg-slate-500/10 border-slate-500/20",
    NO_PRIORITY: "text-muted-foreground bg-muted border-transparent",
  }

  const handleStatusToggle = (e: React.MouseEvent) => {
    e.stopPropagation()
    const newStatus = task.status === "DONE" ? "TODO" : "DONE"
    updateTask.mutate({ id: task.id, data: { status: newStatus } })
  }

  const formatTime = (minutes: number | null) => {
    if (!minutes) return null
    const h = Math.floor(minutes / 60)
    const m = minutes % 60
    return h > 0 ? `${h}h ${m}m` : `${m}m`
  }

  const isCountdown = !!task.estimatedTime

  return (
    <div
      onClick={() => setSelectedTaskId(task.id)}
      className={cn(
        "flex items-center gap-4 p-3 rounded-xl border bg-card hover:bg-accent/35 transition-all cursor-pointer group select-none duration-300",
        isActive && "border-primary/40 shadow-[0_0_12px_rgba(var(--primary-rgb),0.06)] bg-primary/2"
      )}
    >
      <button
        onClick={handleStatusToggle}
        className={cn(
          "w-4.5 h-4.5 rounded-full border border-primary flex items-center justify-center transition-all shrink-0 cursor-pointer",
          task.status === "DONE" ? "bg-primary text-primary-foreground" : "bg-transparent hover:bg-primary/10"
        )}
      >
        {task.status === "DONE" && (
          <span className="text-[10px] font-bold">✓</span>
        )}
      </button>

      <div className="flex-1 min-w-0 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="flex flex-col gap-1 min-w-0">
          <span
            className={cn(
              "text-sm font-semibold truncate text-foreground",
              task.status === "DONE" && "text-muted-foreground line-through"
            )}
          >
            {task.title}
          </span>
          {task.description && (
            <span className="text-xs text-muted-foreground truncate max-w-md">
              {task.description}
            </span>
          )}
        </div>

        <div className="flex items-center gap-3 flex-wrap sm:flex-nowrap">
          {task.project && (
            <Badge variant="outline" className="text-[10px] px-2 py-0 border-primary/10 text-primary bg-primary/5">
              <Bookmark className="w-2.5 h-2.5 mr-1" />
              {task.project.name}
            </Badge>
          )}

          <Badge variant="outline" className={cn("text-[10px] px-2 py-0", priorityColors[task.priority as keyof typeof priorityColors])}>
            <Flag className="w-2.5 h-2.5 mr-1 fill-current" />
            {task.priority.replace("_", " ")}
          </Badge>

          {task.dueDate && (
            <div className={cn(
              "flex items-center gap-1 text-xs text-muted-foreground px-1",
              new Date(task.dueDate) < new Date() && task.status !== "DONE" ? "text-red-500 font-medium" : ""
            )}>
              <Calendar className="w-3.5 h-3.5" />
              <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
            </div>
          )}

          {totalChecklist > 0 && (
            <div className="flex items-center gap-1 text-xs text-muted-foreground px-1">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>{completedChecklist}/{totalChecklist}</span>
            </div>
          )}

          <div className="flex items-center gap-2 pl-2 border-l border-border/40">
            {/* Time Display */}
            {(task.estimatedTime || task.actualTime || isActive) && (
              <div className={cn(
                "flex items-center gap-1 text-xs",
                isActive ? "text-primary font-bold" : "text-muted-foreground"
              )}>
                <Clock className={cn("w-3.5 h-3.5", isActive && "animate-spin-slow")} />
                {isActive ? (
                  <span className="font-mono font-bold">
                    {(() => {
                      const totalSeconds = isCountdown ? countdownRemaining : ((task.actualTime || 0) * 60 + elapsedSeconds)
                      const mins = Math.floor(totalSeconds / 60)
                      const secs = totalSeconds % 60
                      return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
                    })()}
                    {isCountdown ? ` / ${formatTime(task.estimatedTime)}` : ""}
                  </span>
                ) : (
                  <span>
                    {task.actualTime ? `${formatTime(task.actualTime)} / ` : ""}
                    {formatTime(task.estimatedTime) || "No Est."}
                  </span>
                )}
              </div>
            )}

            <div className="flex items-center gap-1">
              {/* Play/Pause Button */}
              <button
                onClick={handleTimerToggle}
                className={cn(
                  "p-1 rounded-full border transition-all cursor-pointer flex items-center justify-center size-6 shrink-0",
                  isActive
                    ? "bg-primary/10 text-primary border-primary/25 hover:bg-primary/20"
                    : "bg-background border-border/80 text-muted-foreground hover:text-primary hover:border-primary/30"
                )}
                title={isActive ? "Pause timer" : "Start timer"}
              >
                {isActive ? (
                  <Pause className="size-2.5 fill-current stroke-none" />
                ) : (
                  <Play className="size-2.5 fill-current stroke-none ml-[1px]" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="shrink-0">
        <DropdownMenu>
          <DropdownMenuTrigger
            className={buttonVariants({ variant: "ghost", size: "icon", className: "h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity focus:opacity-100 cursor-pointer" })}
            onClick={(e) => e.stopPropagation()}
            aria-label="Task actions"
          >
            <MoreHorizontal className="h-4 w-4" />
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            <DropdownMenuItem onClick={() => setSelectedTaskId(task.id)}>View Details</DropdownMenuItem>
            <DropdownMenuItem onClick={() => updateTask.mutate({ id: task.id, data: { isFavorite: !task.isFavorite } })}>
              {task.isFavorite ? "Unfavorite" : "Favorite"}
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-destructive focus:bg-destructive focus:text-destructive-foreground"
              onClick={() => deleteTask.mutate(task.id)}
            >
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </div>
  )
}

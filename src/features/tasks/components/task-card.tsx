"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar, CheckSquare, Clock, MoreVertical, Flag, Bookmark, Play, Pause } from "lucide-react"
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
import { widgetHover } from "@/lib/animations"

interface TaskCardProps {
  task: any
}

export function TaskCard({ task }: TaskCardProps) {
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
    <motion.div
      variants={widgetHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      onClick={() => setSelectedTaskId(task.id)}
    >
      <Card className={cn(
        "group border-border hover:border-primary/40 cursor-pointer select-none relative transition-all duration-300",
        isActive && "border-primary/50 shadow-[0_0_15px_rgba(var(--primary-rgb),0.08)] bg-primary/2"
      )}>
        <CardHeader className="flex flex-row items-start justify-between space-y-0 p-4 pb-2">
          <div className="flex items-center gap-2 flex-1 min-w-0">
            <button
              onClick={handleStatusToggle}
              className={cn(
                "w-4 h-4 rounded-full border border-primary flex items-center justify-center transition-all shrink-0 cursor-pointer",
                task.status === "DONE" ? "bg-primary text-primary-foreground" : "bg-transparent hover:bg-primary/10"
              )}
            >
              {task.status === "DONE" && (
                <span className="text-[10px] font-bold">✓</span>
              )}
            </button>
            <h3
              className={cn(
                "font-medium text-sm truncate",
                task.status === "DONE" && "text-muted-foreground line-through"
              )}
            >
              {task.title}
            </h3>
          </div>

          <DropdownMenu>
            <DropdownMenuTrigger
              className={buttonVariants({ variant: "ghost", size: "icon", className: "h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer" })}
              onClick={(e) => e.stopPropagation()}
              aria-label="Task actions"
            >
              <MoreVertical className="h-3.5 w-3.5" />
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
        </CardHeader>

        <CardContent className="p-4 pt-0 space-y-3">
          {task.description && (
            <p className="text-xs text-muted-foreground line-clamp-2">
              {task.description}
            </p>
          )}

          <div className="flex flex-wrap gap-1.5 items-center">
            <Badge
              variant="outline"
              className={cn("text-[10px] font-medium px-2 py-0", priorityColors[task.priority as keyof typeof priorityColors])}
            >
              <Flag className="w-2.5 h-2.5 mr-1 fill-current" />
              {task.priority.replace("_", " ")}
            </Badge>

            {task.project && (
              <Badge
                variant="outline"
                className="text-[10px] font-medium px-2 py-0 border-primary/10 text-primary bg-primary/5"
              >
                <Bookmark className="w-2.5 h-2.5 mr-1" />
                {task.project.name}
              </Badge>
            )}
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground pt-1.5 border-t border-border/40">
            <div className="flex items-center gap-3">
              {task.dueDate && (
                <div className={cn(
                  "flex items-center gap-1",
                  new Date(task.dueDate) < new Date() && task.status !== "DONE" ? "text-red-500 font-medium" : ""
                )}>
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{new Date(task.dueDate).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}</span>
                </div>
              )}
              {totalChecklist > 0 && (
                <div className="flex items-center gap-1">
                  <CheckSquare className="w-3.5 h-3.5" />
                  <span>{completedChecklist}/{totalChecklist}</span>
                </div>
              )}
            </div>

            <div className="flex items-center gap-2">
              {/* Time Display */}
              {(task.estimatedTime || task.actualTime || isActive) && (
                <div className={cn(
                  "flex items-center gap-1 text-[11px]",
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
        </CardContent>
      </Card>
    </motion.div>
  )
}

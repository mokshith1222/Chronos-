"use client"

import { useState, useEffect } from "react"
import { useActiveSession, useUpdateActiveSession, useStopSession } from "@/hooks/use-time-queries"
import { useProjects } from "@/hooks/use-projects-queries"
import { useTasks } from "@/hooks/use-tasks-queries"
import { useTimerStore } from "@/stores/timer-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { CheckCircle, Play, Pause, Square } from "lucide-react"
import { cn } from "@/lib/utils"

const RATING_CONFIG = [
  {
    key: "mood" as const,
    label: "Mood",
    emoji: "😊",
    levels: ["😞 Low", "😕 Meh", "😐 Okay", "😊 Good", "😄 Great"],
    color: "bg-rose-400",
  },
  {
    key: "energy" as const,
    label: "Energy",
    emoji: "⚡",
    levels: ["🪫 Empty", "😴 Tired", "😌 Calm", "⚡ Pumped", "🔥 On Fire"],
    color: "bg-amber-400",
  },
  {
    key: "productivity" as const,
    label: "Focus",
    emoji: "🎯",
    levels: ["🐢 Slow", "😑 Mild", "💼 Decent", "🚀 Sharp", "🏆 Peak"],
    color: "bg-emerald-400",
  },
]

export function TimerPanel() {
  const { data: activeSession } = useActiveSession()
  const { data: projects } = useProjects()
  const { data: tasks } = useTasks()

  const updateSession = useUpdateActiveSession()
  const stopSession = useStopSession()

  // Timer Store Integration
  const {
    isRunning,
    elapsedSeconds,
    timerType,
    pomodoroStage,
    countdownRemaining,
    countdownDuration,
    pomodoroWorkDuration,
    pomodoroShortBreakDuration,
    pomodoroLongBreakDuration,
    resumeTimer,
    pauseTimer,
  } = useTimerStore()

  const [description, setDescription] = useState("")
  const [projectId, setProjectId] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)
  const [notes, setNotes] = useState("")
  const [mood, setMood] = useState<number | null>(null)
  const [energyLevel, setEnergyLevel] = useState<number | null>(null)
  const [productivityRating, setProductivityRating] = useState<number | null>(null)

  useEffect(() => {
    if (activeSession) {
      setDescription(activeSession.description || "")
      setProjectId(activeSession.projectId || null)
      setTaskId(activeSession.taskId || null)
      setNotes(activeSession.notes || "")
      setMood(activeSession.mood || null)
      setEnergyLevel(activeSession.energyLevel || null)
      setProductivityRating(activeSession.productivityRating || null)
    }
  }, [activeSession])

  if (!activeSession) return null

  const handleUpdate = () => {
    updateSession.mutate({
      description,
      projectId: projectId === "none" || !projectId ? null : projectId,
      taskId: taskId === "none" || !taskId ? null : taskId,
      notes,
      mood: mood || undefined,
      energyLevel: energyLevel || undefined,
      productivityRating: productivityRating || undefined,
    })
  }

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null,
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ].filter(Boolean).join(":")
  }

  const displayedTime = 
    timerType === "POMODORO" || timerType === "COUNTDOWN"
      ? formatTime(countdownRemaining)
      : formatTime(elapsedSeconds)

  // Calculate Progress percentage
  let progressPercentage = 0
  if (timerType === "COUNTDOWN" && countdownDuration > 0) {
    progressPercentage = ((countdownDuration - countdownRemaining) / countdownDuration) * 100
  } else if (timerType === "POMODORO") {
    const stageDuration = 
      pomodoroStage === "WORK" ? pomodoroWorkDuration :
      pomodoroStage === "SHORT_BREAK" ? pomodoroShortBreakDuration :
      pomodoroLongBreakDuration
    if (stageDuration > 0) {
      progressPercentage = ((stageDuration - countdownRemaining) / stageDuration) * 100
    }
  }

  const handlePlayPause = () => {
    if (isRunning) {
      pauseTimer()
    } else {
      resumeTimer()
    }
  }

  const ratings = { mood, energy: energyLevel, productivity: productivityRating }
  const setters = { mood: setMood, energy: setEnergyLevel, productivity: setProductivityRating }

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-3 border-b border-border/40">
        <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
          Active Tracking Session
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6 pt-6">
        
        {/* BIG TICKING CLOCK DISPLAY */}
        <div className="flex flex-col items-center justify-center p-6 rounded-2xl bg-muted/40 border border-border/50 shadow-inner relative overflow-hidden">
          <div className="text-xs font-extrabold uppercase tracking-widest text-primary mb-1">
            {timerType === "POMODORO" ? `POMODORO: ${pomodoroStage}` : `${timerType} TIMER`}
          </div>
          
          <div className="font-mono text-5xl font-black tracking-tight text-foreground select-none my-2">
            {displayedTime}
          </div>

          {/* Progress Bar for Pomodoro/Countdown */}
          {(timerType === "POMODORO" || timerType === "COUNTDOWN") && (
            <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden mt-3 max-w-[200px]">
              <div 
                className="h-full bg-primary transition-all duration-300 ease-out shadow-sm"
                style={{ width: `${progressPercentage}%` }}
              />
            </div>
          )}

          {/* Quick Session Controls */}
          <div className="flex items-center gap-3 mt-4">
            <Button
              variant="outline"
              size="sm"
              className="rounded-xl h-9 px-4 gap-1.5 font-semibold"
              onClick={handlePlayPause}
            >
              {isRunning ? (
                <>
                  <Pause className="size-4" /> Pause
                </>
              ) : (
                <>
                  <Play className="size-4 fill-current" /> Resume
                </>
              )}
            </Button>
            <Button
              variant="destructive"
              size="sm"
              className="rounded-xl h-9 px-4 gap-1.5 font-semibold"
              onClick={() => stopSession.mutate()}
            >
              <Square className="size-3.5 fill-current" /> Stop & Save
            </Button>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="session-desc">Activity Description</Label>
          <Input
            id="session-desc"
            placeholder="What are you working on?"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            onBlur={handleUpdate}
            className="bg-background/40 border-border/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1">
            <Label>Project</Label>
            <Select
              value={projectId ?? "none"}
              onValueChange={(val: string | null) => {
                setProjectId(val)
                updateSession.mutate({ projectId: val === "none" || !val ? null : val })
              }}
            >
              <SelectTrigger className="bg-background/40 border-border/50">
                <SelectValue>
                  {projectId && projectId !== "none"
                    ? (projects?.find((p: any) => p.id === projectId)?.name ?? "No Project")
                    : "No Project"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Project</SelectItem>
                {projects?.map((project: any) => (
                  <SelectItem key={project.id} value={project.id}>
                    {project.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-1">
            <Label>Task</Label>
            <Select
              value={taskId ?? "none"}
              onValueChange={(val: string | null) => {
                setTaskId(val)
                updateSession.mutate({ taskId: val === "none" || !val ? null : val })
              }}
            >
              <SelectTrigger className="bg-background/40 border-border/50">
                <SelectValue>
                  {taskId && taskId !== "none"
                    ? (tasks?.find((t: any) => t.id === taskId)?.title ?? "No Task")
                    : "No Task"}
                </SelectValue>
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No Task</SelectItem>
                {tasks?.map((task: any) => (
                  <SelectItem key={task.id} value={task.id}>
                    {task.title}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1">
          <Label htmlFor="session-notes">Session Notes</Label>
          <Textarea
            id="session-notes"
            placeholder="Add live notes or log ideas..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            onBlur={handleUpdate}
            rows={3}
            className="resize-none bg-background/40 border-border/50"
          />
        </div>

        {/* Session Feel — clean segmented bar ratings */}
        <div className="space-y-2.5 pt-2 border-t border-border/40">
          <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Session Feel</Label>
          <div className="space-y-2">
            {RATING_CONFIG.map(({ key, label, emoji, levels, color }) => {
              const value = ratings[key]
              const setter = setters[key]
              return (
                <div key={key} className="flex flex-col sm:flex-row sm:items-center gap-3 py-3 px-4 rounded-xl bg-muted/30 border border-border/30">
                  <div className="flex items-center gap-2.5">
                    <span className="text-base w-5 text-center">{emoji}</span>
                    <span className="text-xs font-semibold text-foreground w-14 shrink-0">{label}</span>
                  </div>
                  <div className="flex gap-1.5 flex-1 w-full">
                    {[1, 2, 3, 4, 5].map((idx) => (
                      <button
                        key={idx}
                        type="button"
                        title={levels[idx - 1]}
                        onClick={() => {
                          setter(idx)
                          setTimeout(() => handleUpdate(), 100)
                        }}
                        className={cn(
                          "h-2 flex-1 rounded-full transition-all duration-200",
                          idx <= (value ?? 0) ? color : "bg-border hover:bg-muted-foreground/30"
                        )}
                      />
                    ))}
                  </div>
                  <span className="text-xs text-muted-foreground w-20 text-left sm:text-right shrink-0 truncate">
                    {value ? levels[value - 1] : "—"}
                  </span>
                </div>
              )
            })}
          </div>
        </div>

      </CardContent>
    </Card>
  )
}

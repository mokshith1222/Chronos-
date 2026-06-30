"use client"

import { useState } from "react"
import { useTimerStore, TimerType } from "@/stores/timer-store"
import { useStartSession, useActiveSession } from "@/hooks/use-time-queries"
import { useProjects } from "@/hooks/use-projects-queries"
import { useTasks } from "@/hooks/use-tasks-queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Flame, Timer, Hourglass } from "lucide-react"

export function TimeModes() {
  const { data: activeSession } = useActiveSession()
  const startSession = useStartSession()
  const { data: projects } = useProjects()
  const { data: tasks } = useTasks()

  const [activeTab, setActiveTab] = useState<TimerType>("NORMAL")
  const [description, setDescription] = useState("")
  const [projectId, setProjectId] = useState<string | null>(null)
  const [taskId, setTaskId] = useState<string | null>(null)

  // Countdown presets
  const [customMinutes, setCustomMinutes] = useState("10")

  // Pomodoro settings
  const [pomoWork, setPomoWork] = useState("25")
  const [pomoBreak, setPomoBreak] = useState("5")

  const handleStart = () => {
    let type = activeTab
    let metadata: any = {
      projectId: projectId === "none" || !projectId ? null : projectId,
      taskId: taskId === "none" || !taskId ? null : taskId,
      description,
      type,
    }

    if (activeTab === "COUNTDOWN") {
      const secs = parseInt(customMinutes, 10) * 60
      if (!isNaN(secs)) {
        useTimerStore.getState().setCountdownDuration(secs)
      }
    } else if (activeTab === "POMODORO") {
      const workSecs = parseInt(pomoWork, 10) * 60
      const breakSecs = parseInt(pomoBreak, 10) * 60
      if (!isNaN(workSecs) && !isNaN(breakSecs)) {
        useTimerStore.getState().setPomodoroDurations(workSecs, breakSecs, 15 * 60)
      }
    }

    startSession.mutate(metadata)
  }

  if (activeSession) return null

  const tabs = [
    { id: "NORMAL", label: "Stopwatch", icon: Timer },
    { id: "POMODORO", label: "Pomodoro", icon: Flame },
    { id: "COUNTDOWN", label: "Countdown", icon: Hourglass },
  ] as const

  return (
    <Card className="border-border/60 bg-card/60 backdrop-blur-md">
      <CardHeader className="pb-4">
        <div className="flex p-1 bg-muted/50 rounded-lg border w-full">
          {tabs.map((tab) => {
            const Icon = tab.icon
            return (
              <Button
                key={tab.id}
                variant={activeTab === tab.id ? "default" : "ghost"}
                size="sm"
                className="flex-1 h-8 text-xs gap-1.5"
                onClick={() => setActiveTab(tab.id)}
              >
                <Icon className="h-3.5 w-3.5" />
                {tab.label}
              </Button>
            )
          })}
        </div>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="mode-desc">What are you focusing on?</Label>
          <Input
            id="mode-desc"
            placeholder="Description (optional)..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="bg-background/40 border-border/50"
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <Label>Project</Label>
            <Select value={projectId ?? "none"} onValueChange={(val: string | null) => setProjectId(val)}>
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

          <div className="space-y-1.5">
            <Label>Task</Label>
            <Select value={taskId ?? "none"} onValueChange={(val: string | null) => setTaskId(val)}>
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

        {/* Mode Specific Inputs */}
        {activeTab === "COUNTDOWN" && (
          <div className="space-y-1.5 pt-2 border-t border-border/40">
            <Label htmlFor="countdown-mins">Duration (Minutes)</Label>
            <Input
              id="countdown-mins"
              type="number"
              value={customMinutes}
              onChange={(e) => setCustomMinutes(e.target.value)}
              className="bg-background/40 border-border/50 w-full"
            />
          </div>
        )}

        {activeTab === "POMODORO" && (
          <div className="grid grid-cols-2 gap-4 pt-2 border-t border-border/40">
            <div className="space-y-1.5">
              <Label htmlFor="pomo-work">Work (Mins)</Label>
              <Input
                id="pomo-work"
                type="number"
                value={pomoWork}
                onChange={(e) => setPomoWork(e.target.value)}
                className="bg-background/40 border-border/50"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="pomo-break">Break (Mins)</Label>
              <Input
                id="pomo-break"
                type="number"
                value={pomoBreak}
                onChange={(e) => setPomoBreak(e.target.value)}
                className="bg-background/40 border-border/50"
              />
            </div>
          </div>
        )}

        <Button 
          className="w-full mt-2" 
          onClick={handleStart}
          disabled={startSession.isPending}
        >
          <Play className="h-4 w-4 mr-1.5 fill-current" />
          Start Timer
        </Button>
      </CardContent>
    </Card>
  )
}

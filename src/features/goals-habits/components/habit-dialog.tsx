"use client"

import * as React from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Label } from "@/components/ui/label"
import { useCreateHabitMutation, useUpdateHabitMutation, Habit } from "@/hooks/use-goals-queries"
import { useProjects } from "@/hooks/use-projects-queries"
import { useTasks } from "@/hooks/use-tasks-queries"
import { Activity, Plus, Minus, Layers } from "lucide-react"

interface HabitDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  habit?: Habit | null // If passed, we are editing
}

const FREQUENCIES = [
  { value: "DAILY", label: "Daily" },
  { value: "WEEKLY", label: "Weekly" },
  { value: "MONTHLY", label: "Monthly" },
  { value: "CUSTOM", label: "Custom Days" },
]

const DAYS_OF_WEEK = [
  { value: "1", label: "Mon" },
  { value: "2", label: "Tue" },
  { value: "3", label: "Wed" },
  { value: "4", label: "Thu" },
  { value: "5", label: "Fri" },
  { value: "6", label: "Sat" },
  { value: "0", label: "Sun" },
]

const PRESET_COLORS = [
  "#f59e0b", // Amber/Orange
  "#ef4444", // Red
  "#3b82f6", // Blue
  "#10b981", // Green
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#6b7280", // Gray
]

export function HabitDialog({ open, onOpenChange, habit }: HabitDialogProps) {
  const createHabit = useCreateHabitMutation()
  const updateHabit = useUpdateHabitMutation()

  const { data: projects } = useProjects()
  const { data: tasks } = useTasks()

  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [frequency, setFrequency] = React.useState("DAILY")
  const [customDays, setCustomDays] = React.useState<string[]>([])
  const [targetCount, setTargetCount] = React.useState(1)
  const [isNegative, setIsNegative] = React.useState(false)
  const [color, setColor] = React.useState("#f59e0b")
  const [icon, setIcon] = React.useState("Activity")
  const [projectId, setProjectId] = React.useState("")
  const [taskId, setTaskId] = React.useState("")

  // Initialize fields if editing
  React.useEffect(() => {
    if (habit) {
      setTitle(habit.title)
      setDescription(habit.description || "")
      setFrequency(habit.frequency)
      setCustomDays(habit.customDays ? habit.customDays.split(",") : [])
      setTargetCount(habit.targetCount)
      setIsNegative(habit.isNegative)
      setColor(habit.color)
      setIcon(habit.icon)
      setProjectId(habit.projectId || "")
      setTaskId(habit.taskId || "")
    } else {
      // Reset
      setTitle("")
      setDescription("")
      setFrequency("DAILY")
      setCustomDays([])
      setTargetCount(1)
      setIsNegative(false)
      setColor("#f59e0b")
      setIcon("Activity")
      setProjectId("")
      setTaskId("")
    }
  }, [habit, open])

  const toggleDay = (day: string) => {
    if (customDays.includes(day)) {
      setCustomDays(customDays.filter((d) => d !== day))
    } else {
      setCustomDays([...customDays, day].sort())
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const data: any = {
      title: title.trim(),
      description: description.trim() || null,
      frequency,
      customDays: frequency === "CUSTOM" ? customDays.join(",") : null,
      targetCount: parseInt(targetCount.toString()) || 1,
      isNegative,
      color,
      icon,
      projectId: projectId || null,
      taskId: taskId || null,
    }

    if (habit) {
      updateHabit.mutate(
        { id: habit.id, ...data },
        {
          onSuccess: () => onOpenChange(false),
        }
      )
    } else {
      createHabit.mutate(data, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md max-h-[90vh] overflow-y-auto p-6 bg-card/95 backdrop-blur-xl border shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Activity className="size-6 text-primary animate-pulse" />
            {habit ? "Edit Habit" : "Create New Habit"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">Habit Title</Label>
            <Input
              id="title"
              placeholder="e.g., Morning Workout"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
              className="rounded-xl border-input focus:ring-2 focus:ring-primary"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="description" className="text-sm font-semibold">Description</Label>
            <Textarea
              id="description"
              placeholder="Write a short cue or reminder..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border-input min-h-[60px]"
            />
          </div>

          {/* Habit Type (Positive vs Negative) */}
          <div className="space-y-2">
            <Label className="text-sm font-semibold">Habit Type</Label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => setIsNegative(false)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold transition-all text-sm ${
                  !isNegative
                    ? "bg-emerald-500/10 text-emerald-500 border-emerald-500 shadow-sm"
                    : "bg-background hover:bg-muted"
                }`}
              >
                <Plus className="size-4" />
                Positive (Build)
              </button>
              <button
                type="button"
                onClick={() => setIsNegative(true)}
                className={`flex items-center justify-center gap-2 py-3 px-4 rounded-xl border font-semibold transition-all text-sm ${
                  isNegative
                    ? "bg-rose-500/10 text-rose-500 border-rose-500 shadow-sm"
                    : "bg-background hover:bg-muted"
                }`}
              >
                <Minus className="size-4" />
                Negative (Break)
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Frequency</Label>
              <select
                value={frequency}
                onChange={(e) => setFrequency(e.target.value)}
                className="w-full h-10 px-3 py-1 bg-background border border-input rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {FREQUENCIES.map((f) => (
                  <option key={f.value} value={f.value}>
                    {f.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="targetCount" className="text-sm font-semibold">Daily Target Count</Label>
              <Input
                id="targetCount"
                type="number"
                min={1}
                value={targetCount}
                onChange={(e) => setTargetCount(parseInt(e.target.value) || 1)}
                className="rounded-xl border-input"
              />
            </div>
          </div>

          {frequency === "CUSTOM" && (
            <div className="space-y-2 p-3 bg-muted/30 border rounded-xl animate-in slide-in-from-top-2 duration-300">
              <Label className="text-xs font-semibold">Select Days</Label>
              <div className="flex flex-wrap gap-1.5 mt-1">
                {DAYS_OF_WEEK.map((d) => {
                  const isSelected = customDays.includes(d.value)
                  return (
                    <button
                      key={d.value}
                      type="button"
                      onClick={() => toggleDay(d.value)}
                      className={`h-8 px-2.5 rounded-lg text-xs font-semibold border transition-all ${
                        isSelected
                          ? "bg-primary text-primary-foreground border-primary"
                          : "bg-background hover:bg-muted"
                      }`}
                    >
                      {d.label}
                    </button>
                  )
                })}
              </div>
            </div>
          )}

          <div className="space-y-2">
            <Label className="text-sm font-semibold">Theme Color</Label>
            <div className="flex gap-2 items-center flex-wrap h-10">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="size-6 rounded-full border border-white/20 transition-transform hover:scale-125 focus:outline-none"
                  style={{
                    backgroundColor: c,
                    boxShadow: color === c ? `0 0 0 2px white, 0 0 0 4px ${c}` : "none",
                  }}
                />
              ))}
            </div>
          </div>

          {/* Integrations */}
          <div className="space-y-4 p-4 bg-muted/20 border rounded-2xl">
            <h4 className="text-xs font-bold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
              <Layers className="size-3.5" />
              Integrations (Link to Workspace)
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Link Project</Label>
                <select
                  value={projectId}
                  onChange={(e) => setProjectId(e.target.value)}
                  className="w-full h-9 px-3 py-1 bg-background border border-input rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">None</option>
                  {projects?.map((p: any) => (
                    <option key={p.id} value={p.id}>
                      {p.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <Label className="text-xs font-medium">Link Task</Label>
                <select
                  value={taskId}
                  onChange={(e) => setTaskId(e.target.value)}
                  className="w-full h-9 px-3 py-1 bg-background border border-input rounded-xl text-xs outline-none focus:ring-2 focus:ring-primary"
                >
                  <option value="">None</option>
                  {tasks?.map((t: any) => (
                    <option key={t.id} value={t.id}>
                      {t.title}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          <DialogFooter className="pt-4 border-t">
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
              className="rounded-xl"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={createHabit.isPending || updateHabit.isPending}
              className="rounded-xl shadow-lg px-6"
            >
              {habit ? "Save Changes" : "Create Habit"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

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
import { useCreateGoalMutation, useUpdateGoalMutation, Goal } from "@/hooks/use-goals-queries"
import { useProjects } from "@/hooks/use-projects-queries"
import { useTasks } from "@/hooks/use-tasks-queries"
import { Plus, Trash2, Target, Calendar, CheckSquare, Layers } from "lucide-react"

interface GoalDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  goal?: Goal | null // If passed, we are editing
}

const CATEGORIES = [
  { value: "PERSONAL", label: "Personal" },
  { value: "WORK", label: "Work" },
  { value: "STUDY", label: "Study" },
  { value: "HEALTH", label: "Health" },
  { value: "FITNESS", label: "Fitness" },
  { value: "FINANCIAL", label: "Financial" },
  { value: "READING", label: "Reading" },
  { value: "LEARNING", label: "Learning" },
  { value: "CUSTOM", label: "Custom" },
]

const PRIORITIES = [
  { value: "LOW", label: "Low" },
  { value: "MEDIUM", label: "Medium" },
  { value: "HIGH", label: "High" },
  { value: "URGENT", label: "Urgent" },
]

const PRESET_COLORS = [
  "#3b82f6", // Blue
  "#10b981", // Green
  "#ef4444", // Red
  "#f59e0b", // Orange
  "#8b5cf6", // Purple
  "#ec4899", // Pink
  "#06b6d4", // Cyan
  "#6b7280", // Gray
]

export function GoalDialog({ open, onOpenChange, goal }: GoalDialogProps) {
  const createGoal = useCreateGoalMutation()
  const updateGoal = useUpdateGoalMutation()

  const { data: projects } = useProjects()
  const { data: tasks } = useTasks()

  const [title, setTitle] = React.useState("")
  const [description, setDescription] = React.useState("")
  const [category, setCategory] = React.useState("PERSONAL")
  const [priority, setPriority] = React.useState("MEDIUM")
  const [targetDate, setTargetDate] = React.useState("")
  const [color, setColor] = React.useState("#3b82f6")
  const [notes, setNotes] = React.useState("")
  const [tags, setTags] = React.useState("")
  const [projectId, setProjectId] = React.useState("")
  const [taskId, setTaskId] = React.useState("")

  // Progress Type: "milestones" | "numeric" | "manual"
  const [progressType, setProgressType] = React.useState<"milestones" | "numeric" | "manual">("manual")
  
  // Numeric tracking fields
  const [targetValue, setTargetValue] = React.useState("")
  const [currentValue, setCurrentValue] = React.useState("")
  const [units, setUnits] = React.useState("")

  // Milestones
  const [milestones, setMilestones] = React.useState<{ title: string; dueDate?: string }[]>([])
  const [newMilestoneTitle, setNewMilestoneTitle] = React.useState("")

  // Initialize fields if editing
  React.useEffect(() => {
    if (goal) {
      setTitle(goal.title)
      setDescription(goal.description || "")
      setCategory(goal.category)
      setPriority(goal.priority)
      setTargetDate(goal.targetDate ? goal.targetDate.split("T")[0] : "")
      setColor(goal.color)
      setNotes(goal.notes || "")
      setTags(goal.tags || "")
      setProjectId(goal.projectId || "")
      setTaskId(goal.taskId || "")
      
      if (goal.targetValue !== null) {
        setProgressType("numeric")
        setTargetValue(goal.targetValue.toString())
        setCurrentValue(goal.currentValue.toString())
        setUnits(goal.units || "")
      } else if (goal.milestones && goal.milestones.length > 0) {
        setProgressType("milestones")
        setMilestones(goal.milestones.map(m => ({ title: m.title, dueDate: m.dueDate ? m.dueDate.split("T")[0] : undefined })))
      } else {
        setProgressType("manual")
      }
    } else {
      // Reset
      setTitle("")
      setDescription("")
      setCategory("PERSONAL")
      setPriority("MEDIUM")
      setTargetDate("")
      setColor("#3b82f6")
      setNotes("")
      setTags("")
      setProjectId("")
      setTaskId("")
      setProgressType("manual")
      setTargetValue("")
      setCurrentValue("")
      setUnits("")
      setMilestones([])
    }
  }, [goal, open])

  const handleAddMilestone = () => {
    if (!newMilestoneTitle.trim()) return
    setMilestones([...milestones, { title: newMilestoneTitle.trim() }])
    setNewMilestoneTitle("")
  }

  const handleRemoveMilestone = (index: number) => {
    setMilestones(milestones.filter((_, i) => i !== index))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!title.trim()) return

    const data: any = {
      title: title.trim(),
      description: description.trim() || null,
      category,
      priority,
      color,
      notes: notes.trim() || null,
      tags: tags.trim() || null,
      projectId: projectId || null,
      taskId: taskId || null,
      targetDate: targetDate ? new Date(targetDate).toISOString() : null,
    }

    if (progressType === "numeric") {
      data.targetValue = targetValue ? parseFloat(targetValue) : null
      data.currentValue = currentValue ? parseFloat(currentValue) : 0
      data.units = units.trim() || null
    } else if (progressType === "milestones") {
      data.milestones = milestones
      data.targetValue = null
      data.currentValue = 0
      data.units = null
    } else {
      data.targetValue = null
      data.currentValue = 0
      data.units = null
    }

    if (goal) {
      updateGoal.mutate(
        { id: goal.id, ...data },
        {
          onSuccess: () => onOpenChange(false),
        }
      )
    } else {
      createGoal.mutate(data, {
        onSuccess: () => onOpenChange(false),
      })
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-xl max-h-[90vh] overflow-y-auto p-6 bg-card/95 backdrop-blur-xl border shadow-2xl rounded-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Target className="size-6 text-primary animate-pulse" />
            {goal ? "Edit Goal" : "Create New Goal"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6 mt-4">
          <div className="space-y-2">
            <Label htmlFor="title" className="text-sm font-semibold">Goal Title</Label>
            <Input
              id="title"
              placeholder="e.g., Read 12 Books"
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
              placeholder="Outline what you want to achieve..."
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="rounded-xl border-input min-h-[80px]"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label className="text-sm font-semibold">Category</Label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full h-10 px-3 py-1 bg-background border border-input rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {CATEGORIES.map((c) => (
                  <option key={c.value} value={c.value}>
                    {c.label}
                  </option>
                ))}
              </select>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Priority</Label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full h-10 px-3 py-1 bg-background border border-input rounded-xl text-sm outline-none focus:ring-2 focus:ring-primary"
              >
                {PRIORITIES.map((p) => (
                  <option key={p.value} value={p.value}>
                    {p.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="targetDate" className="text-sm font-semibold">Target Date</Label>
              <Input
                id="targetDate"
                type="date"
                value={targetDate}
                onChange={(e) => setTargetDate(e.target.value)}
                className="rounded-xl border-input"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-semibold">Goal Color</Label>
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
          </div>

          {/* Progress Type Selection */}
          <div className="space-y-3 p-4 bg-muted/30 border rounded-2xl">
            <Label className="text-sm font-semibold">Progress Tracking Method</Label>
            <div className="grid grid-cols-3 gap-2">
              <button
                type="button"
                onClick={() => setProgressType("manual")}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  progressType === "manual"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background hover:bg-muted"
                }`}
              >
                Manual %
              </button>
              <button
                type="button"
                onClick={() => setProgressType("numeric")}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  progressType === "numeric"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background hover:bg-muted"
                }`}
              >
                Numeric Target
              </button>
              <button
                type="button"
                onClick={() => setProgressType("milestones")}
                className={`py-2 px-3 text-xs font-semibold rounded-xl border transition-all ${
                  progressType === "milestones"
                    ? "bg-primary text-primary-foreground border-primary shadow-sm"
                    : "bg-background hover:bg-muted"
                }`}
              >
                Milestones
              </button>
            </div>

            {progressType === "numeric" && (
              <div className="grid grid-cols-3 gap-2 pt-2 animate-in fade-in duration-300">
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold">Current</Label>
                  <Input
                    type="number"
                    value={currentValue}
                    onChange={(e) => setCurrentValue(e.target.value)}
                    placeholder="0"
                    className="h-8 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold">Target</Label>
                  <Input
                    type="number"
                    value={targetValue}
                    onChange={(e) => setTargetValue(e.target.value)}
                    placeholder="100"
                    className="h-8 rounded-lg"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-[10px] uppercase font-bold">Units</Label>
                  <Input
                    value={units}
                    onChange={(e) => setUnits(e.target.value)}
                    placeholder="e.g. miles"
                    className="h-8 rounded-lg"
                  />
                </div>
              </div>
            )}

            {progressType === "milestones" && (
              <div className="space-y-2 pt-2 animate-in fade-in duration-300">
                <Label className="text-xs font-semibold">Milestones List</Label>
                <div className="flex gap-2">
                  <Input
                    placeholder="New milestone..."
                    value={newMilestoneTitle}
                    onChange={(e) => setNewMilestoneTitle(e.target.value)}
                    className="h-9 rounded-xl"
                  />
                  <Button type="button" onClick={handleAddMilestone} size="sm" className="rounded-xl h-9">
                    <Plus className="size-4" />
                  </Button>
                </div>
                <ul className="space-y-1.5 max-h-36 overflow-y-auto pr-1 mt-2">
                  {milestones.map((m, index) => (
                    <li key={index} className="flex items-center justify-between p-2 rounded-xl bg-background border text-xs">
                      <span className="truncate pr-4 font-medium">{m.title}</span>
                      <button
                        type="button"
                        onClick={() => handleRemoveMilestone(index)}
                        className="text-muted-foreground hover:text-destructive transition-colors"
                      >
                        <Trash2 className="size-3.5" />
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
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
              disabled={createGoal.isPending || updateGoal.isPending}
              className="rounded-xl shadow-lg px-6"
            >
              {goal ? "Save Changes" : "Create Goal"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

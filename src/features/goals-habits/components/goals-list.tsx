"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  useGetGoalsQuery,
  useUpdateGoalMutation,
  useDeleteGoalMutation,
  useUpdateMilestoneMutation,
  Goal,
  Milestone,
} from "@/hooks/use-goals-queries"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Progress } from "@/components/ui/progress"
import { GoalDialog } from "./goal-dialog"
import {
  Target,
  Plus,
  Search,
  MoreVertical,
  Calendar,
  Layers,
  CheckSquare,
  AlertCircle,
  FolderOpen,
  Filter,
  CheckCircle2,
} from "lucide-react"

export function GoalsList() {
  const [search, setSearch] = React.useState("")
  const [status, setStatus] = React.useState("ACTIVE")
  const [category, setCategory] = React.useState("ALL")
  const [priority, setPriority] = React.useState("ALL")

  const { data: goals, isLoading, isError } = useGetGoalsQuery({
    search,
    status,
    category,
    priority,
  })

  const updateGoal = useUpdateGoalMutation()
  const deleteGoal = useDeleteGoalMutation()
  const updateMilestone = useUpdateMilestoneMutation()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingGoal, setEditingGoal] = React.useState<Goal | null>(null)
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal)
    setDialogOpen(true)
    setActiveMenuId(null)
  }

  const handleDelete = (id: string) => {
    if (confirm("Are you sure you want to delete this goal?")) {
      deleteGoal.mutate(id)
    }
    setActiveMenuId(null)
  }

  const handleToggleMilestone = (goalId: string, milestone: Milestone) => {
    updateMilestone.mutate({
      goalId,
      milestoneId: milestone.id,
      isCompleted: !milestone.isCompleted,
    })
  }

  const handleManualProgressChange = (goal: Goal, amount: number) => {
    const newProgress = Math.min(100, Math.max(0, goal.progress + amount))
    updateGoal.mutate({
      id: goal.id,
      progress: newProgress,
    })
  }

  const handleNumericValueChange = (goal: Goal, isIncrement: boolean) => {
    const step = 1
    const newCurrent = isIncrement 
      ? goal.currentValue + step 
      : Math.max(0, goal.currentValue - step)
    
    updateGoal.mutate({
      id: goal.id,
      currentValue: newCurrent,
    })
  }

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null)
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center bg-card/40 p-4 border rounded-2xl">
        <div className="relative w-full md:max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <Input
            placeholder="Search goals..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9 rounded-xl border-input bg-background/50"
          />
        </div>

        <div className="flex flex-wrap gap-2 items-center w-full md:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground mr-2">
            <Filter className="size-3.5" />
            Filters:
          </div>

          <select
            value={status}
            onChange={(e) => setStatus(e.target.value)}
            className="h-9 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ACTIVE">Active Goals</option>
            <option value="COMPLETED">Completed Goals</option>
            <option value="ARCHIVED">Archived Goals</option>
            <option value="ALL">All Goals</option>
          </select>

          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="h-9 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Categories</option>
            <option value="PERSONAL">Personal</option>
            <option value="WORK">Work</option>
            <option value="STUDY">Study</option>
            <option value="HEALTH">Health</option>
            <option value="FITNESS">Fitness</option>
            <option value="FINANCIAL">Financial</option>
            <option value="READING">Reading</option>
            <option value="LEARNING">Learning</option>
          </select>

          <select
            value={priority}
            onChange={(e) => setPriority(e.target.value)}
            className="h-9 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
          >
            <option value="ALL">All Priorities</option>
            <option value="LOW">Low</option>
            <option value="MEDIUM">Medium</option>
            <option value="HIGH">High</option>
            <option value="URGENT">Urgent</option>
          </select>

          <Button
            onClick={() => {
              setEditingGoal(null)
              setDialogOpen(true)
            }}
            className="rounded-xl ml-auto md:ml-0"
            size="sm"
          >
            <Plus className="size-4 mr-1.5" />
            New Goal
          </Button>
        </div>
      </div>

      {/* Goals Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-64 rounded-2xl border bg-card/40 animate-pulse" />
          ))}
        </div>
      ) : isError || !goals ? (
        <div className="text-center p-12 border border-dashed rounded-3xl">
          <AlertCircle className="size-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Error Loading Goals</h3>
          <p className="text-muted-foreground text-sm">Please try again later.</p>
        </div>
      ) : goals.length === 0 ? (
        <div className="text-center p-16 border border-dashed rounded-3xl bg-card/10">
          <Target className="size-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No Goals Found</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-6">Create a goal to start mapping your milestones.</p>
          <Button onClick={() => setDialogOpen(true)} className="rounded-xl">
            Create First Goal
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {goals.map((goal) => (
              <motion.div
                key={goal.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.2 }}
                className="relative flex flex-col justify-between border bg-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group"
              >
                {/* Background Accent */}
                <div
                  className="absolute top-0 left-0 w-1.5 h-full opacity-80"
                  style={{ backgroundColor: goal.color }}
                />

                <div className="space-y-4">
                  {/* Goal Header */}
                  <div className="flex justify-between items-start gap-4">
                    <div className="flex flex-wrap gap-1.5">
                      <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                        {goal.category}
                      </span>
                      <span
                        className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full ${
                          goal.priority === "URGENT"
                            ? "bg-rose-500/10 text-rose-500"
                            : goal.priority === "HIGH"
                            ? "bg-amber-500/10 text-amber-500"
                            : "bg-muted text-muted-foreground"
                        }`}
                      >
                        {goal.priority}
                      </span>
                    </div>

                    {/* Menu Button */}
                    <div className="relative">
                      <Button
                        variant="ghost"
                        size="icon-sm"
                        onClick={(e) => {
                          e.stopPropagation()
                          setActiveMenuId(activeMenuId === goal.id ? null : goal.id)
                        }}
                        className="rounded-full hover:bg-muted"
                      >
                        <MoreVertical className="size-4 text-muted-foreground" />
                      </Button>

                      {activeMenuId === goal.id && (
                        <div className="absolute right-0 mt-1 w-32 bg-popover border shadow-lg rounded-xl z-20 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                          <button
                            onClick={() => handleEdit(goal)}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted font-medium text-foreground"
                          >
                            Edit Goal
                          </button>
                          <button
                            onClick={() => handleDelete(goal.id)}
                            className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted font-medium text-destructive"
                          >
                            Delete
                          </button>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Goal Info */}
                  <div>
                    <h3 className="font-bold text-lg text-foreground group-hover:text-primary transition-colors duration-200">
                      {goal.title}
                    </h3>
                    {goal.description && (
                      <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                        {goal.description}
                      </p>
                    )}
                  </div>

                  {/* Goal Progress Section */}
                  <div className="space-y-2 pt-2">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-muted-foreground">Progress</span>
                      <span style={{ color: goal.color }} className="font-bold">
                        {goal.progress}%
                      </span>
                    </div>
                    <Progress
                      value={goal.progress}
                      className="h-2 rounded-full bg-muted"
                      indicatorStyle={{ backgroundColor: goal.color }}
                    />
                  </div>

                  {/* Numeric / Milestones Details */}
                  {goal.targetValue !== null ? (
                    <div className="flex items-center justify-between p-2.5 bg-muted/30 border rounded-xl">
                      <div className="text-xs">
                        <span className="font-bold text-foreground">{goal.currentValue}</span>
                        <span className="text-muted-foreground"> / {goal.targetValue} {goal.units || ""}</span>
                      </div>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => handleNumericValueChange(goal, false)}
                          className="size-6 rounded-md"
                        >
                          -
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => handleNumericValueChange(goal, true)}
                          className="size-6 rounded-md"
                        >
                          +
                        </Button>
                      </div>
                    </div>
                  ) : goal.milestones && goal.milestones.length > 0 ? (
                    <div className="space-y-1.5 pt-2">
                      <div className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground">
                        Milestones ({goal.milestones.filter(m => m.isCompleted).length}/{goal.milestones.length})
                      </div>
                      <ul className="space-y-1 max-h-24 overflow-y-auto pr-1">
                        {goal.milestones.map((m) => (
                          <li
                            key={m.id}
                            onClick={() => handleToggleMilestone(goal.id, m)}
                            className="flex items-center gap-2 text-xs font-medium py-1 px-2 rounded-lg hover:bg-muted/50 cursor-pointer transition-colors"
                          >
                            <CheckCircle2
                              className={`size-4 shrink-0 transition-colors ${
                                m.isCompleted
                                  ? "text-emerald-500 fill-emerald-500/10"
                                  : "text-muted-foreground/40"
                              }`}
                            />
                            <span className={m.isCompleted ? "line-through text-muted-foreground" : "text-foreground"}>
                              {m.title}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ) : (
                    <div className="flex items-center justify-between p-2.5 bg-muted/30 border rounded-xl text-xs font-medium">
                      <span className="text-muted-foreground">Adjust Progress:</span>
                      <div className="flex gap-1">
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => handleManualProgressChange(goal, -10)}
                          className="h-6 px-1.5 text-[10px] rounded-md"
                        >
                          -10%
                        </Button>
                        <Button
                          variant="outline"
                          size="icon-xs"
                          onClick={() => handleManualProgressChange(goal, 10)}
                          className="h-6 px-1.5 text-[10px] rounded-md"
                        >
                          +10%
                        </Button>
                      </div>
                    </div>
                  )}
                </div>

                {/* Footer details */}
                <div className="flex items-center justify-between border-t pt-3 mt-4 text-[10px] font-semibold text-muted-foreground">
                  <div className="flex items-center gap-1.5">
                    <Calendar className="size-3.5" />
                    <span>
                      {goal.targetDate
                        ? new Date(goal.targetDate).toLocaleDateString(undefined, {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                          })
                        : "No deadline"}
                    </span>
                  </div>

                  <div className="flex gap-2">
                    {goal.project && (
                      <div className="flex items-center gap-1 bg-primary/5 px-1.5 py-0.5 rounded border border-primary/10">
                        <FolderOpen className="size-3 text-primary" />
                        <span className="truncate max-w-[60px]">{goal.project.name}</span>
                      </div>
                    )}
                    {goal.task && (
                      <div className="flex items-center gap-1 bg-muted px-1.5 py-0.5 rounded border">
                        <CheckSquare className="size-3 text-muted-foreground" />
                        <span className="truncate max-w-[60px]">{goal.task.title}</span>
                      </div>
                    )}
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Goal Creation Dialog */}
      <GoalDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        goal={editingGoal}
      />
    </div>
  )
}

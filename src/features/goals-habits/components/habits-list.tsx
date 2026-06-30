"use client"

import * as React from "react"
import { motion, AnimatePresence } from "framer-motion"
import {
  useGetHabitsQuery,
  useUpdateHabitMutation,
  useDeleteHabitMutation,
  useLogHabitMutation,
  Habit,
} from "@/hooks/use-goals-queries"
import { Button } from "@/components/ui/button"
import { HabitDialog } from "./habit-dialog"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Activity,
  Plus,
  Flame,
  Check,
  MoreVertical,
  Calendar,
  AlertCircle,
  Pause,
  Play,
  RotateCcw,
  Folder,
  CheckSquare,
  Trophy,
  TrendingUp,
  CalendarDays,
  Info,
} from "lucide-react"

export function HabitsList() {
  const [status, setStatus] = React.useState("ACTIVE")
  const { data: habits, isLoading, isError } = useGetHabitsQuery(status)

  const updateHabit = useUpdateHabitMutation()
  const deleteHabit = useDeleteHabitMutation()
  const logHabit = useLogHabitMutation()

  const [dialogOpen, setDialogOpen] = React.useState(false)
  const [editingHabit, setEditingHabit] = React.useState<Habit | null>(null)
  const [activeMenuId, setActiveMenuId] = React.useState<string | null>(null)
  const [selectedHabitForDetail, setSelectedHabitForDetail] = React.useState<Habit | null>(null)

  // Generate last 7 days (ending today)
  const last7Days = React.useMemo(() => {
    return Array.from({ length: 7 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return d
    }).reverse()
  }, [])

  // Helper to format a local Date object as YYYY-MM-DD without timezone shifting
  const getLocalYYYYMMDD = (date: Date) => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, "0")
    const day = String(date.getDate()).padStart(2, "0")
    return `${year}-${month}-${day}`
  }

  const handleEdit = (habit: Habit, e: React.MouseEvent) => {
    e.stopPropagation()
    setEditingHabit(habit)
    setDialogOpen(true)
    setActiveMenuId(null)
  }

  const handleDelete = (id: string, e: React.MouseEvent) => {
    e.stopPropagation()
    if (confirm("Are you sure you want to delete this habit?")) {
      deleteHabit.mutate(id)
    }
    setActiveMenuId(null)
  }

  const handleToggleStatus = (habit: Habit, e: React.MouseEvent) => {
    e.stopPropagation()
    const newStatus = habit.status === "ACTIVE" ? "PAUSED" : "ACTIVE"
    updateHabit.mutate({
      id: habit.id,
      status: newStatus,
    })
    setActiveMenuId(null)
  }

  const handleToggleDay = (habitId: string, date: Date, isCompleted: boolean, e: React.MouseEvent) => {
    e.stopPropagation()
    const dateStr = getLocalYYYYMMDD(date)
    logHabit.mutate({
      habitId,
      date: dateStr,
      status: isCompleted ? "DELETE" : "COMPLETED",
    })
  }

  // Close menus when clicking outside
  React.useEffect(() => {
    const handleOutsideClick = () => setActiveMenuId(null)
    document.addEventListener("click", handleOutsideClick)
    return () => document.removeEventListener("click", handleOutsideClick)
  }, [])

  // Calculate detailed stats for a habit
  const getHabitStats = React.useCallback((habit: Habit) => {
    const completions = habit.history.filter((h) => h.status === "COMPLETED")
    const totalCompletions = completions.length

    // Calculate completion rate over the last 30 days
    const last30Days = Array.from({ length: 30 }, (_, i) => {
      const d = new Date()
      d.setDate(d.getDate() - i)
      return getLocalYYYYMMDD(d)
    })
    const completedLast30 = completions.filter((c) => 
      last30Days.includes(c.date.toString().split("T")[0])
    ).length
    const completionRate30 = Math.round((completedLast30 / 30) * 100)

    // Calculate best day of the week
    const dayCounts = [0, 0, 0, 0, 0, 0, 0] // Sun-Sat
    completions.forEach((c) => {
      const day = new Date(c.date).getDay()
      dayCounts[day]++
    })
    const maxDayVal = Math.max(...dayCounts)
    const bestDayIdx = dayCounts.indexOf(maxDayVal)
    const daysOfWeekNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
    const bestDay = maxDayVal > 0 ? daysOfWeekNames[bestDayIdx] : "None yet"

    return {
      totalCompletions,
      completionRate30,
      bestDay,
      completedLast30,
    }
  }, [])

  // Helper to render mini monthly calendar grid
  const renderMiniCalendar = (habit: Habit) => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth()

    const firstDayOfMonth = new Date(year, month, 1)
    const lastDayOfMonth = new Date(year, month + 1, 0)
    
    // Day of week offset (aligned to Monday = 0)
    let startDayIdx = firstDayOfMonth.getDay() - 1
    if (startDayIdx < 0) startDayIdx = 6 // Sunday

    const totalDays = lastDayOfMonth.getDate()
    const cells = []

    // Pad previous month days
    for (let i = 0; i < startDayIdx; i++) {
      cells.push(<div key={`pad-${i}`} className="size-6 text-[9px] text-muted-foreground/30 flex items-center justify-center" />)
    }

    // Current month days
    for (let day = 1; day <= totalDays; day++) {
      const cellDate = new Date(year, month, day)
      const dateStr = cellDate.toISOString().split("T")[0]
      const isCompleted = habit.history.some(
        (h) => h.status === "COMPLETED" && h.date.toString().split("T")[0] === dateStr
      )
      const isToday = now.getDate() === day

      cells.push(
        <div
          key={`day-${day}`}
          className={`size-6 rounded-full flex items-center justify-center text-[10px] font-bold transition-all ${
            isCompleted
              ? "text-white"
              : isToday
              ? "border border-primary/50 text-foreground"
              : "text-muted-foreground hover:bg-muted/30"
          }`}
          style={{
            backgroundColor: isCompleted ? habit.color : undefined,
          }}
          title={`${cellDate.toLocaleDateString()}: ${isCompleted ? 'Completed' : 'Missed'}`}
        >
          {day}
        </div>
      )
    }

    return cells
  }

  return (
    <div className="space-y-6">
      {/* Filters and Actions */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center bg-card/40 p-4 border rounded-2xl">
        <div className="flex gap-2">
          <Button
            variant={status === "ACTIVE" ? "default" : "outline"}
            onClick={() => setStatus("ACTIVE")}
            className="rounded-xl text-xs h-9"
          >
            Active Habits
          </Button>
          <Button
            variant={status === "PAUSED" ? "default" : "outline"}
            onClick={() => setStatus("PAUSED")}
            className="rounded-xl text-xs h-9"
          >
            Paused Habits
          </Button>
          <Button
            variant={status === "ALL" ? "default" : "outline"}
            onClick={() => setStatus("ALL")}
            className="rounded-xl text-xs h-9"
          >
            All
          </Button>
        </div>

        <Button
          onClick={() => {
            setEditingHabit(null)
            setDialogOpen(true)
          }}
          className="rounded-xl w-full sm:w-auto"
          size="sm"
        >
          <Plus className="size-4 mr-1.5" />
          New Habit
        </Button>
      </div>

      {/* Habits Grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[1, 2].map((i) => (
            <div key={i} className="h-48 rounded-2xl border bg-card/40 animate-pulse" />
          ))}
        </div>
      ) : isError || !habits ? (
        <div className="text-center p-12 border border-dashed rounded-3xl">
          <AlertCircle className="size-12 text-destructive mx-auto mb-4" />
          <h3 className="text-lg font-semibold">Error Loading Habits</h3>
          <p className="text-muted-foreground text-sm">Please try again later.</p>
        </div>
      ) : habits.length === 0 ? (
        <div className="text-center p-16 border border-dashed rounded-3xl bg-card/10">
          <Activity className="size-16 text-muted-foreground/30 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-foreground">No Habits Tracked</h3>
          <p className="text-muted-foreground text-sm mt-1 mb-6">Create a daily or weekly routine to track consistency.</p>
          <Button onClick={() => setDialogOpen(true)} className="rounded-xl">
            Create First Habit
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {habits.map((habit) => {
              const stats = getHabitStats(habit)
              const weeklyProgress = habit.history.filter(
                (h) => h.status === "COMPLETED" && last7Days.some(d => getLocalYYYYMMDD(d) === h.date.toString().split("T")[0])
              ).length

              return (
                <motion.div
                  key={habit.id}
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSelectedHabitForDetail(habit)}
                  className="relative flex flex-col justify-between border bg-card p-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 overflow-hidden group cursor-pointer"
                >
                  {/* Background Accent */}
                  <div
                    className="absolute top-0 left-0 w-1.5 h-full opacity-85"
                    style={{ backgroundColor: habit.color }}
                  />

                  <div className="space-y-4">
                    {/* Habit Header */}
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-muted text-muted-foreground">
                            {habit.frequency}
                          </span>
                          {habit.isNegative ? (
                            <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-rose-500/10 text-rose-500">
                              Break Habit
                            </span>
                          ) : (
                            <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500">
                              Build Habit
                            </span>
                          )}
                          {habit.projectId && (
                            <span className="text-[9px] uppercase font-extrabold tracking-wider px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-500 flex items-center gap-1">
                              <Folder className="size-2.5" /> Project Link
                            </span>
                          )}
                        </div>
                        <h3 className="font-bold text-lg text-foreground mt-2 group-hover:text-primary transition-colors duration-200">
                          {habit.title}
                        </h3>
                        {habit.description && (
                          <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                            {habit.description}
                          </p>
                        )}
                      </div>

                      {/* Menu and Actions */}
                      <div className="flex items-center gap-1.5">
                        {/* Streak badge */}
                        <div className="flex items-center gap-1 bg-amber-500/10 text-amber-600 dark:text-amber-500 px-2 py-1 rounded-xl text-xs font-bold">
                          <Flame className="size-4 fill-amber-500/20" />
                          <span>{habit.currentStreak}d</span>
                        </div>

                        {/* Dropdown Menu */}
                        <div className="relative">
                          <Button
                            variant="ghost"
                            size="icon-sm"
                            onClick={(e) => {
                              e.stopPropagation()
                              setActiveMenuId(activeMenuId === habit.id ? null : habit.id)
                            }}
                            className="rounded-full hover:bg-muted"
                          >
                            <MoreVertical className="size-4 text-muted-foreground" />
                          </Button>

                          {activeMenuId === habit.id && (
                            <div className="absolute right-0 mt-1 w-36 bg-popover border shadow-lg rounded-xl z-20 py-1.5 animate-in fade-in zoom-in-95 duration-100">
                              <button
                                onClick={(e) => handleEdit(habit, e)}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted font-medium text-foreground"
                              >
                                Edit Settings
                              </button>
                              <button
                                onClick={(e) => handleToggleStatus(habit, e)}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted font-medium text-foreground flex items-center gap-1.5"
                              >
                                {habit.status === "ACTIVE" ? (
                                  <>
                                    <Pause className="size-3" /> Pause Habit
                                  </>
                                ) : (
                                  <>
                                    <Play className="size-3" /> Resume Habit
                                  </>
                                )}
                              </button>
                              <button
                                onClick={(e) => handleDelete(habit.id, e)}
                                className="w-full text-left px-3 py-1.5 text-xs hover:bg-muted font-medium text-destructive"
                              >
                                Delete
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar */}
                    <div className="space-y-1">
                      <div className="flex justify-between text-[10px] font-bold text-muted-foreground">
                        <span>Weekly Consistency</span>
                        <span>{weeklyProgress} / 7 Days</span>
                      </div>
                      <div className="w-full h-1.5 bg-muted rounded-full overflow-hidden">
                        <div 
                          className="h-full rounded-full transition-all duration-500"
                          style={{ 
                            width: `${Math.min((weeklyProgress / 7) * 100, 100)}%`,
                            backgroundColor: habit.color 
                          }}
                        />
                      </div>
                    </div>

                    {/* 7-Day Completion Tracker Grid */}
                    <div className="space-y-2 pt-1">
                      <div className="text-[9px] uppercase font-bold tracking-wider text-muted-foreground flex items-center justify-between">
                        <span>Last 7 Days</span>
                        <span className="flex items-center gap-0.5"><Info className="size-3" /> Toggle completion</span>
                      </div>
                      <div className="flex justify-between items-center bg-background/50 border p-2.5 rounded-xl">
                        {last7Days.map((day) => {
                          const dateStr = getLocalYYYYMMDD(day)
                          const isCompleted = habit.history.some(
                            (h) => h.status === "COMPLETED" && h.date.toString().split("T")[0] === dateStr
                          )
                          const isToday = getLocalYYYYMMDD(new Date()) === dateStr

                          return (
                            <div key={dateStr} className="flex flex-col items-center gap-1">
                              <span className="text-[9px] font-extrabold text-muted-foreground select-none">
                                {day.toLocaleDateString(undefined, { weekday: "narrow" })}
                              </span>
                              <button
                                type="button"
                                onClick={(e) => handleToggleDay(habit.id, day, isCompleted, e)}
                                className={`size-7 rounded-full border flex items-center justify-center font-bold transition-all duration-300 ${
                                  isCompleted
                                    ? "text-white scale-110 shadow-sm"
                                    : isToday
                                    ? "border-primary/50 text-foreground hover:bg-muted"
                                    : "border-input text-muted-foreground hover:bg-muted/50"
                                }`}
                                style={{
                                  backgroundColor: isCompleted ? habit.color : "transparent",
                                  borderColor: isCompleted ? habit.color : undefined,
                                }}
                              >
                                {isCompleted ? (
                                  <Check className="size-3 stroke-[3.5px]" />
                                ) : (
                                  <span className="text-[9px]">{day.getDate()}</span>
                                )}
                              </button>
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )
            })}
          </AnimatePresence>
        </div>
      )}

      {/* Habit Detail Modal */}
      <AnimatePresence>
        {selectedHabitForDetail && (() => {
          const stats = getHabitStats(selectedHabitForDetail)
          return (
            <Dialog open={!!selectedHabitForDetail} onOpenChange={(open) => !open && setSelectedHabitForDetail(null)}>
              <DialogContent className="sm:max-w-md p-6 bg-card border shadow-2xl rounded-2xl">
                <DialogHeader className="border-b pb-4">
                  <div className="flex items-center gap-2">
                    <div 
                      className="size-3 rounded-full" 
                      style={{ backgroundColor: selectedHabitForDetail.color }} 
                    />
                    <DialogTitle className="text-xl font-black tracking-tight">{selectedHabitForDetail.title}</DialogTitle>
                  </div>
                  {selectedHabitForDetail.description && (
                    <p className="text-sm text-muted-foreground mt-1 italic">
                      "{selectedHabitForDetail.description}"
                    </p>
                  )}
                </DialogHeader>

                {/* Detail Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 pt-4">
                  <div className="p-3 bg-muted/20 border rounded-xl flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1">
                      <Trophy className="size-3 text-amber-500" /> Streaks
                    </span>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Current:</span>
                        <span>{selectedHabitForDetail.currentStreak} Days</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Longest:</span>
                        <span>{selectedHabitForDetail.longestStreak} Days</span>
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-muted/20 border rounded-xl flex flex-col justify-between">
                    <span className="text-[10px] uppercase font-bold tracking-wider text-muted-foreground flex items-center gap-1">
                      <TrendingUp className="size-3 text-emerald-500" /> Performance
                    </span>
                    <div className="mt-2 space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Last 30d Rate:</span>
                        <span className="text-emerald-500">{stats.completionRate30}%</span>
                      </div>
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">Best Day:</span>
                        <span>{stats.bestDay}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Integrations Panel */}
                {(selectedHabitForDetail.projectId || selectedHabitForDetail.taskId) && (
                  <div className="p-3 bg-primary/5 border border-primary/10 rounded-xl space-y-1.5 text-xs font-semibold">
                    <div className="text-[10px] uppercase font-bold tracking-wider text-primary">Workspace Connections</div>
                    {selectedHabitForDetail.projectId && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Folder className="size-3.5 text-primary" />
                        <span>Linked Project</span>
                      </div>
                    )}
                    {selectedHabitForDetail.taskId && (
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <CheckSquare className="size-3.5 text-primary" />
                        <span>Linked Task</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Month Grid Heatmap */}
                <div className="space-y-3 pt-4 border-t">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] uppercase font-extrabold tracking-wider text-muted-foreground flex items-center gap-1">
                      <CalendarDays className="size-3.5" /> Monthly Consistency
                    </span>
                    <span className="text-xs font-bold text-muted-foreground">
                      {new Date().toLocaleDateString(undefined, { month: 'long', year: 'numeric' })}
                    </span>
                  </div>

                  <div className="grid grid-cols-7 gap-1 bg-muted/10 p-3 rounded-xl border max-w-fit mx-auto">
                    {/* Weekday headers */}
                    {["M", "T", "W", "T", "F", "S", "S"].map((d, idx) => (
                      <div key={idx} className="size-6 text-[10px] font-black text-muted-foreground/60 flex items-center justify-center select-none">
                        {d}
                      </div>
                    ))}
                    {renderMiniCalendar(selectedHabitForDetail)}
                  </div>
                </div>

                <DialogFooter className="pt-4 border-t">
                  <Button 
                    onClick={() => setSelectedHabitForDetail(null)}
                    className="w-full rounded-xl font-semibold"
                  >
                    Close Details
                  </Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>
          )
        })()}
      </AnimatePresence>

      {/* Habit Edit/Create Dialog */}
      <HabitDialog
        open={dialogOpen}
        onOpenChange={setDialogOpen}
        habit={editingHabit}
      />
    </div>
  )
}

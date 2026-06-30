import { create } from "zustand"
import { persist } from "zustand/middleware"

type TimeRange = "today" | "yesterday" | "thisWeek" | "thisMonth" | "custom"

interface DashboardState {
  timeRange: TimeRange
  customDateRange: { from: Date | null; to: Date | null }
  activeWidgets: string[]
  isEditingLayout: boolean
  
  setTimeRange: (range: TimeRange) => void
  setCustomDateRange: (from: Date | null, to: Date | null) => void
  toggleWidget: (widgetId: string) => void
  setIsEditingLayout: (isEditing: boolean) => void
}

export const ALL_WIDGETS = [
  { id: "score", label: "Productivity Score", category: "Metrics" },
  { id: "timer", label: "Running Focus Timer", category: "Actions" },
  { id: "actions", label: "Quick Action Shortcuts", category: "Actions" },
  { id: "calendar", label: "Daily Planner Calendar", category: "Planning" },
  { id: "tasks", label: "Recent Tasks List", category: "Planning" },
  { id: "habits", label: "Habit Streak Tracker", category: "Metrics" },
  { id: "productivity", label: "Productivity Trend Chart", category: "Analytics" },
  { id: "distribution", label: "Project Time Breakdown", category: "Analytics" },
  { id: "goals", label: "Goals Progress Tracker", category: "Metrics" },
  { id: "pinned", label: "Pinned Workspace Items", category: "Navigation" },
  { id: "projects", label: "Active Projects List", category: "Navigation" },
  { id: "notes", label: "Recent Quick Notes", category: "Navigation" },
  { id: "activity", label: "Real-time Activity Feed", category: "Analytics" },
]

export const useDashboardStore = create<DashboardState>()(
  persist(
    (set) => ({
      timeRange: "today",
      customDateRange: { from: null, to: null },
      activeWidgets: [
        "score",
        "timer",
        "actions",
        "calendar",
        "tasks",
        "habits",
        "productivity",
        "distribution",
        "goals",
        "pinned",
        "projects",
        "notes",
        "activity",
      ],
      isEditingLayout: false,

      setTimeRange: (range) => set({ timeRange: range }),
      setCustomDateRange: (from, to) => set({ customDateRange: { from, to } }),
      toggleWidget: (widgetId) =>
        set((state) => ({
          activeWidgets: state.activeWidgets.includes(widgetId)
            ? state.activeWidgets.filter((id) => id !== widgetId)
            : [...state.activeWidgets, widgetId],
        })),
      setIsEditingLayout: (isEditing) => set({ isEditingLayout: isEditing }),
    }),
    {
      name: "dashboard-layout-store-v2",
    }
  )
)

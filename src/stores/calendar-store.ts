import { create } from "zustand"
import { persist } from "zustand/middleware"

export type CalendarViewMode = "month" | "week" | "day" | "agenda"

interface CalendarState {
  selectedDate: string // ISO date string
  viewMode: CalendarViewMode
  selectedEventId: string | null
  
  // Filters
  filterType: "ALL" | "EVENT" | "TIME_BLOCK"
  filterProjectId: string | null

  // Actions
  setSelectedDate: (date: Date) => void
  setViewMode: (mode: CalendarViewMode) => void
  setSelectedEventId: (id: string | null) => void
  setFilterType: (type: "ALL" | "EVENT" | "TIME_BLOCK") => void
  setFilterProjectId: (projectId: string | null) => void
  
  nextDate: () => void
  previousDate: () => void
  setToday: () => void
}

export const useCalendarStore = create<CalendarState>()(
  persist(
    (set, get) => ({
      selectedDate: new Date().toISOString(),
      viewMode: "month",
      selectedEventId: null,
      filterType: "ALL",
      filterProjectId: null,

      setSelectedDate: (date) => set({ selectedDate: date.toISOString() }),
      setViewMode: (mode) => set({ viewMode: mode }),
      setSelectedEventId: (id) => set({ selectedEventId: id }),
      setFilterType: (type) => set({ filterType: type }),
      setFilterProjectId: (projectId) => set({ filterProjectId: projectId }),

      nextDate: () => {
        const current = new Date(get().selectedDate)
        const mode = get().viewMode
        if (mode === "month") {
          current.setMonth(current.getMonth() + 1)
        } else if (mode === "week") {
          current.setDate(current.getDate() + 7)
        } else {
          current.setDate(current.getDate() + 1)
        }
        set({ selectedDate: current.toISOString() })
      },

      previousDate: () => {
        const current = new Date(get().selectedDate)
        const mode = get().viewMode
        if (mode === "month") {
          current.setMonth(current.getMonth() - 1)
        } else if (mode === "week") {
          current.setDate(current.getDate() - 7)
        } else {
          current.setDate(current.getDate() - 1)
        }
        set({ selectedDate: current.toISOString() })
      },

      setToday: () => set({ selectedDate: new Date().toISOString() }),
    }),
    {
      name: "fp-calendar-store",
      partialize: (state) => ({
        viewMode: state.viewMode,
        filterType: state.filterType,
      }),
    }
  )
)

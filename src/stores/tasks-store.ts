import { create } from "zustand"
import { persist } from "zustand/middleware"

export type TaskViewMode = "list" | "kanban" | "calendar" | "timeline"

interface TasksState {
  viewMode: TaskViewMode
  setViewMode: (mode: TaskViewMode) => void
  
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  statusFilter: string[]
  setStatusFilter: (status: string[]) => void
  
  priorityFilter: string[]
  setPriorityFilter: (priority: string[]) => void
  
  projectFilter: string | null
  setProjectFilter: (projectId: string | null) => void
  
  sortBy: string
  setSortBy: (sort: string) => void
  
  showArchived: boolean
  setShowArchived: (show: boolean) => void

  selectedTaskId: string | null
  setSelectedTaskId: (id: string | null) => void
}

export const useTasksStore = create<TasksState>()(
  persist(
    (set) => ({
      viewMode: "list",
      setViewMode: (mode) => set({ viewMode: mode }),
      
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      statusFilter: [],
      setStatusFilter: (status) => set({ statusFilter: status }),
      
      priorityFilter: [],
      setPriorityFilter: (priority) => set({ priorityFilter: priority }),
      
      projectFilter: null,
      setProjectFilter: (projectId) => set({ projectFilter: projectId }),
      
      sortBy: "position",
      setSortBy: (sort) => set({ sortBy: sort }),
      
      showArchived: false,
      setShowArchived: (show) => set({ showArchived: show }),

      selectedTaskId: null,
      setSelectedTaskId: (id) => set({ selectedTaskId: id }),
    }),
    {
      name: "fp-tasks-store",
    }
  )
)

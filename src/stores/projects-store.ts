import { create } from "zustand"
import { persist } from "zustand/middleware"

type ViewMode = "grid" | "list" | "table" | "compact" | "kanban" | "timeline"

interface ProjectsState {
  viewMode: ViewMode
  setViewMode: (mode: ViewMode) => void
  
  searchQuery: string
  setSearchQuery: (query: string) => void
  
  statusFilter: string[]
  setStatusFilter: (status: string[]) => void
  
  sortBy: string
  setSortBy: (sort: string) => void
  
  showArchived: boolean
  setShowArchived: (show: boolean) => void
}

export const useProjectsStore = create<ProjectsState>()(
  persist(
    (set) => ({
      viewMode: "grid",
      setViewMode: (mode) => set({ viewMode: mode }),
      
      searchQuery: "",
      setSearchQuery: (query) => set({ searchQuery: query }),
      
      statusFilter: [],
      setStatusFilter: (status) => set({ statusFilter: status }),
      
      sortBy: "updatedAt",
      setSortBy: (sort) => set({ sortBy: sort }),
      
      showArchived: false,
      setShowArchived: (show) => set({ showArchived: show }),
    }),
    {
      name: "fp-projects-store",
    }
  )
)

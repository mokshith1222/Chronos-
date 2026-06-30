import { create } from "zustand"
import { persist } from "zustand/middleware"

interface SearchItem {
  id: string
  type: "project" | "task" | "note" | "goal" | "habit" | "calendarEvent" | "command"
  title: string
  subtitle?: string
  color?: string
  metadata?: any
}

interface SearchState {
  isOpen: boolean
  query: string
  filterType: string | null
  selectedItem: SearchItem | null
  recentCommands: string[]
  
  setIsOpen: (isOpen: boolean) => void
  toggleOpen: () => void
  setQuery: (query: string) => void
  setFilterType: (filterType: string | null) => void
  setSelectedItem: (item: SearchItem | null) => void
  logCommand: (command: string) => void
  clearRecentCommands: () => void
}

export const useSearchStore = create<SearchState>()(
  persist(
    (set) => ({
      isOpen: false,
      query: "",
      filterType: null,
      selectedItem: null,
      recentCommands: [],

      setIsOpen: (isOpen) => set({ isOpen }),
      toggleOpen: () => set((state) => ({ isOpen: !state.isOpen })),
      setQuery: (query) => set({ query }),
      setFilterType: (filterType) => set({ filterType }),
      setSelectedItem: (selectedItem) => set({ selectedItem }),
      
      logCommand: (command) => set((state) => {
        const filtered = state.recentCommands.filter((c) => c !== command)
        return {
          recentCommands: [command, ...filtered].slice(0, 5),
        }
      }),
      
      clearRecentCommands: () => set({ recentCommands: [] }),
    }),
    {
      name: "chronos-search",
      partialize: (state) => ({
        recentCommands: state.recentCommands,
      }),
    }
  )
)

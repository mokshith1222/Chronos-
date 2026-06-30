import { create } from "zustand"
import { persist } from "zustand/middleware"

interface NotesState {
  selectedNoteId: string | null
  activeFolderId: string | null // "none" = top-level, null = all, "favorites", "archive", "trash", or folderId
  searchQuery: string
  sidebarOpen: boolean

  setSelectedNoteId: (id: string | null) => void
  setActiveFolderId: (id: string | null) => void
  setSearchQuery: (query: string) => void
  toggleSidebar: () => void
}

export const useNotesStore = create<NotesState>()(
  persist(
    (set) => ({
      selectedNoteId: null,
      activeFolderId: null,
      searchQuery: "",
      sidebarOpen: true,

      setSelectedNoteId: (id) => set({ selectedNoteId: id }),
      setActiveFolderId: (id) => set({ activeFolderId: id, selectedNoteId: null }), // Clear selection when switching folder
      setSearchQuery: (query) => set({ searchQuery: query }),
      toggleSidebar: () => set((state) => ({ sidebarOpen: !state.sidebarOpen })),
    }),
    {
      name: "fp-notes-store",
      partialize: (state) => ({
        sidebarOpen: state.sidebarOpen,
        activeFolderId: state.activeFolderId,
      }),
    }
  )
)

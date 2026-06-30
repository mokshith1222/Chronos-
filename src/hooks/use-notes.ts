import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Note {
  id: string
  title: string
  content: string
  updatedAt: number
}

interface NotesState {
  notes: Note[]
  activeNoteId: string | null
  setActiveNote: (id: string) => void
  updateNote: (id: string, content: string, title?: string) => void
  addNote: () => void
  deleteNote: (id: string) => void
}

export const useNotes = create<NotesState>()(
  persist(
    (set) => ({
      notes: [
        { id: '1', title: 'Meeting Notes: Q3 Planning', content: '# Q3 Planning\n\n- Discuss marketing budget.\n- Finalize roadmap.', updatedAt: Date.now() },
        { id: '2', title: 'Brand Guidelines', content: '# Brand\nPrimary color is #4F46E5', updatedAt: Date.now() - 100000 },
      ],
      activeNoteId: '1',
      setActiveNote: (id) => set({ activeNoteId: id }),
      updateNote: (id, content, title) => set((state) => ({
        notes: state.notes.map(n => n.id === id ? { ...n, content, title: title ?? n.title, updatedAt: Date.now() } : n)
      })),
      addNote: () => set((state) => {
        const id = crypto.randomUUID()
        return {
          notes: [{ id, title: 'Untitled Note', content: '', updatedAt: Date.now() }, ...state.notes],
          activeNoteId: id
        }
      }),
      deleteNote: (id) => set((state) => {
        const remaining = state.notes.filter(n => n.id !== id)
        return {
          notes: remaining,
          activeNoteId: state.activeNoteId === id ? (remaining[0]?.id || null) : state.activeNoteId
        }
      })
    }),
    { name: 'chronos-notes' }
  )
)

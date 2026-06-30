import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TimeBlock {
  id: string
  title: string
  startTime: number // Minutes from midnight (e.g. 540 = 9:00 AM)
  duration: number  // Minutes (e.g. 60)
  color: string
}

interface CalendarState {
  blocks: TimeBlock[]
  addBlock: (block: Omit<TimeBlock, 'id'>) => void
  updateBlock: (id: string, updates: Partial<TimeBlock>) => void
  deleteBlock: (id: string) => void
}

export const useCalendar = create<CalendarState>()(
  persist(
    (set) => ({
      blocks: [
        { id: '1', title: 'Deep Work', startTime: 540, duration: 120, color: 'bg-blue-500/20 text-blue-700 border-blue-500/30' },
        { id: '2', title: 'Team Sync', startTime: 780, duration: 60, color: 'bg-emerald-500/20 text-emerald-700 border-emerald-500/30' },
      ],
      addBlock: (block) => set((state) => ({ blocks: [...state.blocks, { ...block, id: crypto.randomUUID() }] })),
      updateBlock: (id, updates) => set((state) => ({
        blocks: state.blocks.map(b => b.id === id ? { ...b, ...updates } : b)
      })),
      deleteBlock: (id) => set((state) => ({
        blocks: state.blocks.filter(b => b.id !== id)
      }))
    }),
    { name: 'chronos-calendar' }
  )
)

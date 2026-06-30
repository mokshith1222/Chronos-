import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Goal {
  id: string
  title: string
  description: string
  targetDate: number
  progress: number // 0-100
  color: string
}

interface GoalsState {
  goals: Goal[]
  addGoal: (goal: Omit<Goal, 'id' | 'progress'>) => void
  updateProgress: (id: string, progress: number) => void
}

export const useGoals = create<GoalsState>()(
  persist(
    (set) => ({
      goals: [
        { id: '1', title: 'Launch MVP', description: 'Complete the beta release of the productivity platform', targetDate: Date.now() + 86400000 * 30, progress: 65, color: '#3b82f6' },
        { id: '2', title: 'Read 12 Books', description: 'Self-improvement and architecture design', targetDate: Date.now() + 86400000 * 180, progress: 25, color: '#10b981' },
      ],
      addGoal: (goal) => set((state) => ({ 
        goals: [...state.goals, { ...goal, id: Math.random().toString(36).substr(2, 9), progress: 0 }] 
      })),
      updateProgress: (id, progress) => set((state) => ({
        goals: state.goals.map(g => g.id === id ? { ...g, progress } : g)
      })),
    }),
    { name: 'chronos-goals' }
  )
)

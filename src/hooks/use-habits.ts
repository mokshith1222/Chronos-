import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Habit {
  id: string
  title: string
  color: string
  completedDates: string[] // ISO date strings
}

interface HabitsState {
  habits: Habit[]
  addHabit: (title: string, color: string) => void
  toggleHabit: (id: string, date: string) => void
}

export const useHabits = create<HabitsState>()(
  persist(
    (set) => ({
      habits: [
        { id: '1', title: 'Morning Workout', color: '#f59e0b', completedDates: [new Date().toISOString().split('T')[0]] },
        { id: '2', title: 'Read 20 pages', color: '#8b5cf6', completedDates: [] },
      ],
      addHabit: (title, color) => set((state) => ({
        habits: [...state.habits, { id: crypto.randomUUID(), title, color, completedDates: [] }]
      })),
      toggleHabit: (id, date) => set((state) => {
        const habit = state.habits.find(h => h.id === id)
        if (!habit) return state
        const hasCompleted = habit.completedDates.includes(date)
        const newDates = hasCompleted 
          ? habit.completedDates.filter(d => d !== date)
          : [...habit.completedDates, date]
        
        return {
          habits: state.habits.map(h => h.id === id ? { ...h, completedDates: newDates } : h)
        }
      }),
    }),
    { name: 'chronos-habits' }
  )
)

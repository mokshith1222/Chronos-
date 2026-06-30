import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface TimeEntry {
  id: string;
  description: string;
  projectId: string | null;
  taskId: string | null;
  startTime: number;
  endTime: number;
  duration: number; // in milliseconds
}

interface TimeTrackerState {
  isActive: boolean
  isPaused: boolean
  startTime: number | null
  pausedAt: number | null
  totalPausedTime: number // accumulated paused duration for the current session
  description: string
  projectId: string | null
  taskId: string | null
  entries: TimeEntry[]
  
  startTimer: (description?: string, projectId?: string | null, taskId?: string | null) => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: () => void
  setDescription: (description: string) => void
}

export const useTimeTracker = create<TimeTrackerState>()(
  persist(
    (set) => ({
      isActive: false,
      isPaused: false,
      startTime: null,
      pausedAt: null,
      totalPausedTime: 0,
      description: "",
      projectId: null,
      taskId: null,
      entries: [],
      
      startTimer: (description = "", projectId = null, taskId = null) => 
        set({ isActive: true, isPaused: false, startTime: Date.now(), pausedAt: null, totalPausedTime: 0, description, projectId, taskId }),
        
      pauseTimer: () => 
        set((state) => {
          if (!state.isActive || state.isPaused) return state;
          return { isPaused: true, pausedAt: Date.now() }
        }),

      resumeTimer: () => 
        set((state) => {
          if (!state.isActive || !state.isPaused || !state.pausedAt) return state;
          const pauseDuration = Date.now() - state.pausedAt;
          return { isPaused: false, pausedAt: null, totalPausedTime: state.totalPausedTime + pauseDuration }
        }),
        
      stopTimer: () => 
        set((state) => {
          if (!state.isActive || !state.startTime) return state;
          
          let finalPausedTime = state.totalPausedTime;
          if (state.isPaused && state.pausedAt) {
            finalPausedTime += (Date.now() - state.pausedAt);
          }

          const endTime = Date.now();
          const duration = endTime - state.startTime - finalPausedTime;

          const newEntry: TimeEntry = {
            id: crypto.randomUUID(),
            description: state.description,
            projectId: state.projectId,
            taskId: state.taskId,
            startTime: state.startTime,
            endTime,
            duration,
          };
          
          return { 
            isActive: false, 
            isPaused: false,
            startTime: null, 
            pausedAt: null,
            totalPausedTime: 0,
            description: "", 
            projectId: null, 
            taskId: null,
            entries: [newEntry, ...state.entries]
          };
        }),
        
      setDescription: (description) => set({ description }),
    }),
    {
      name: 'chronos-time-tracker',
    }
  )
)

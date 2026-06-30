import { create } from "zustand"
import { persist } from "zustand/middleware"

const WORKSPACE_ID = "cm0q9z8x0000008l4f1h7a3n2"

export type TimerType = "NORMAL" | "POMODORO" | "STOPWATCH" | "COUNTDOWN" | "DEEP_WORK"
export type PomodoroStage = "WORK" | "SHORT_BREAK" | "LONG_BREAK"

interface TimerState {
  // Live Timer State
  activeSessionId: string | null
  isRunning: boolean
  startTime: number | null // timestamp in ms
  elapsedSeconds: number
  timerType: TimerType
  projectId: string | null
  taskId: string | null
  description: string
  tags: string

  // Pomodoro Specific State
  pomodoroStage: PomodoroStage
  pomodoroCycles: number
  pomodoroTargetCycles: number
  pomodoroWorkDuration: number // in seconds
  pomodoroShortBreakDuration: number // in seconds
  pomodoroLongBreakDuration: number // in seconds

  // Countdown Specific State
  countdownDuration: number // in seconds
  countdownRemaining: number // in seconds

  // Stopwatch Specific State
  stopwatchLaps: number[]
  stopwatchMilliseconds: number

  // Core Actions
  startTimer: (type: TimerType, projectId?: string | null, taskId?: string | null) => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: () => void
  resetTimer: () => void
  tick: () => void
  syncWithSession: (session: any) => void

  // Setters
  setProject: (id: string | null) => void
  setTask: (id: string | null) => void
  setDescription: (desc: string) => void
  setTags: (tags: string) => void
  
  // Pomodoro Actions
  setPomodoroDurations: (work: number, short: number, long: number) => void
  setPomodoroTargetCycles: (target: number) => void
  nextPomodoroStage: () => void

  // Countdown Actions
  setCountdownDuration: (seconds: number) => void
}

export const useTimerStore = create<TimerState>()(
  persist(
    (set, get) => ({
      activeSessionId: null,
      isRunning: false,
      startTime: null,
      elapsedSeconds: 0,
      timerType: "NORMAL",
      projectId: null,
      taskId: null,
      description: "",
      tags: "",

      pomodoroStage: "WORK",
      pomodoroCycles: 0,
      pomodoroTargetCycles: 4,
      pomodoroWorkDuration: 25 * 60,
      pomodoroShortBreakDuration: 5 * 60,
      pomodoroLongBreakDuration: 15 * 60,

      countdownDuration: 10 * 60,
      countdownRemaining: 10 * 60,

      stopwatchLaps: [],
      stopwatchMilliseconds: 0,

      startTimer: (type, projectId = null, taskId = null) => {
        const now = Date.now()
        set({
          isRunning: true,
          startTime: now,
          elapsedSeconds: 0,
          timerType: type,
          projectId,
          taskId,
          description: "",
          tags: "",
          countdownRemaining: type === "COUNTDOWN" ? get().countdownDuration : 0,
          stopwatchLaps: [],
          stopwatchMilliseconds: 0,
        })
      },

      pauseTimer: () => {
        if (!get().isRunning) return
        // Save accumulated elapsed seconds
        const currentElapsed = get().elapsedSeconds
        set({
          isRunning: false,
          startTime: null,
          elapsedSeconds: currentElapsed,
        })
      },

      resumeTimer: () => {
        if (get().isRunning) return
        set({
          isRunning: true,
          startTime: Date.now() - (get().elapsedSeconds * 1000),
        })
      },

      stopTimer: () => {
        set({
          activeSessionId: null,
          isRunning: false,
          startTime: null,
          elapsedSeconds: 0,
        })
      },

      resetTimer: () => {
        set({
          isRunning: false,
          startTime: null,
          elapsedSeconds: 0,
          countdownRemaining: get().countdownDuration,
          stopwatchLaps: [],
          stopwatchMilliseconds: 0,
        })
      },

      tick: () => {
        const state = get()
        if (!state.isRunning || !state.startTime) return

        // DRIFT PREVENTION: Calculate elapsed time based on system clock, not setInterval counts
        const now = Date.now()
        const elapsed = Math.floor((now - state.startTime) / 1000)

        if (state.timerType === "COUNTDOWN") {
          const remaining = Math.max(0, state.countdownDuration - elapsed)
          set({ 
            elapsedSeconds: elapsed,
            countdownRemaining: remaining,
          })
          if (remaining === 0) {
            set({ isRunning: false })
            // Stop the session on the server to save the time entry
            fetch(`/api/time/session?workspaceId=${WORKSPACE_ID}`, { method: "DELETE" })
              .catch(err => console.error("Failed to auto-stop session:", err))

            // Trigger browser notification if allowed
            if ("Notification" in window && Notification.permission === "granted") {
              new Notification("Timer finished!", { body: "Your countdown timer has ended." })
            }
          }
        } else if (state.timerType === "POMODORO") {
          const stageDuration = 
            state.pomodoroStage === "WORK" ? state.pomodoroWorkDuration :
            state.pomodoroStage === "SHORT_BREAK" ? state.pomodoroShortBreakDuration :
            state.pomodoroLongBreakDuration

          const remaining = Math.max(0, stageDuration - elapsed)
          set({ 
            elapsedSeconds: elapsed,
            countdownRemaining: remaining, // Use countdownRemaining for Pomodoro progress
          })

          if (remaining === 0) {
            state.nextPomodoroStage()
          }
        } else {
          set({ elapsedSeconds: elapsed })
        }
      },

      syncWithSession: (session) => {
        if (!session) {
          set({
            activeSessionId: null,
            isRunning: false,
            startTime: null,
            elapsedSeconds: 0,
          })
          return
        }

        const startTimestamp = new Date(session.startTime).getTime()
        const now = Date.now()
        const elapsed = Math.floor((now - startTimestamp) / 1000)

        // Auto-detect task estimatedTime and set countdown based on remaining time
        const taskActualSeconds = session.task?.actualTime ? session.task.actualTime * 60 : 0
        const taskEstSeconds = session.task?.estimatedTime 
          ? Math.max(0, session.task.estimatedTime * 60 - taskActualSeconds) 
          : 0
        const isCountdown = session.type === "COUNTDOWN" || (session.type === "NORMAL" && taskEstSeconds > 0)
        const effectiveType = isCountdown ? "COUNTDOWN" : (session.type as TimerType)

        set({
          activeSessionId: session.id,
          isRunning: true,
          startTime: startTimestamp,
          elapsedSeconds: elapsed,
          timerType: effectiveType,
          projectId: session.projectId,
          taskId: session.taskId,
          description: session.description || "",
          tags: session.tags || "",
          countdownDuration: taskEstSeconds > 0 ? taskEstSeconds : get().countdownDuration,
          countdownRemaining: taskEstSeconds > 0 ? Math.max(0, taskEstSeconds - elapsed) : get().countdownRemaining,
        })
      },

      setProject: (id) => set({ projectId: id }),
      setTask: (id) => set({ taskId: id }),
      setDescription: (desc) => set({ description: desc }),
      setTags: (tags) => set({ tags }),

      setPomodoroDurations: (work, short, long) => set({
        pomodoroWorkDuration: work,
        pomodoroShortBreakDuration: short,
        pomodoroLongBreakDuration: long,
      }),

      setPomodoroTargetCycles: (target) => set({ pomodoroTargetCycles: target }),

      nextPomodoroStage: () => {
        const state = get()
        let nextStage: PomodoroStage = "WORK"
        let nextCycles = state.pomodoroCycles

        if (state.pomodoroStage === "WORK") {
          nextCycles += 1
          if (nextCycles % state.pomodoroTargetCycles === 0) {
            nextStage = "LONG_BREAK"
          } else {
            nextStage = "SHORT_BREAK"
          }
        }

        set({
          pomodoroStage: nextStage,
          pomodoroCycles: nextCycles,
          startTime: Date.now(),
          elapsedSeconds: 0,
        })

        if ("Notification" in window && Notification.permission === "granted") {
          const title = nextStage === "WORK" ? "Work Session Started" : "Time for a Break!"
          const body = nextStage === "WORK" ? "Focus on your tasks." : "Relax for a bit."
          new Notification(title, { body })
        }
      },

      setCountdownDuration: (seconds) => set({
        countdownDuration: seconds,
        countdownRemaining: seconds,
      }),
    }),
    {
      name: "fp-timer-store",
      partialize: (state) => ({
        pomodoroWorkDuration: state.pomodoroWorkDuration,
        pomodoroShortBreakDuration: state.pomodoroShortBreakDuration,
        pomodoroLongBreakDuration: state.pomodoroLongBreakDuration,
        pomodoroTargetCycles: state.pomodoroTargetCycles,
        countdownDuration: state.countdownDuration,
      }),
    }
  )
)

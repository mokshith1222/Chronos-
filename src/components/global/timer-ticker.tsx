"use client"

import { useEffect } from "react"
import { useTimerStore } from "@/stores/timer-store"
import { useActiveSession } from "@/hooks/use-time-queries"

export function TimerTicker() {
  const { isRunning, tick, syncWithSession } = useTimerStore()
  const { data: activeSession } = useActiveSession()

  // Sync server-side session with Zustand store
  useEffect(() => {
    syncWithSession(activeSession || null)
  }, [activeSession, syncWithSession])

  // Global ticking loop
  useEffect(() => {
    if (!isRunning) return
    
    const interval = setInterval(() => {
      tick()
    }, 1000)
    
    return () => clearInterval(interval)
  }, [isRunning, tick])

  return null
}

"use client"

import * as React from "react"
import { useTimerStore } from "@/stores/timer-store"
import { useSearchStore } from "@/stores/search-store"

export function useKeyboardShortcuts() {
  const toggleSearch = useSearchStore((state) => state.toggleOpen)
  const { isRunning, startTimer, pauseTimer, resumeTimer } = useTimerStore()

  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // 1. Toggle Command Palette: Cmd+K or Ctrl+K
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        toggleSearch()
      }

      // 2. Toggle Timer: Alt+T
      if (e.key === "t" && e.altKey) {
        e.preventDefault()
        if (isRunning) {
          pauseTimer()
        } else {
          // Resume if we have elapsed time, else start normal stopwatch
          resumeTimer()
        }
      }

      // 3. Quick Add Task: Cmd+Shift+A (handled by QuickAddModal itself, but we document it here)
    }

    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [toggleSearch, isRunning, pauseTimer, resumeTimer])
}

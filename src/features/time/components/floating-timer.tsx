"use client"

import { useEffect, useRef } from "react"
import { motion, useDragControls } from "framer-motion"
import { useTimerStore } from "@/stores/timer-store"
import { useActiveSession, useStopSession } from "@/hooks/use-time-queries"
import { Button } from "@/components/ui/button"
import { Play, Pause, Square, GripHorizontal, Minimize2, Maximize2 } from "lucide-react"
import { cn } from "@/lib/utils"

export function FloatingTimer() {
  const { data: activeSession } = useActiveSession()
  const {
    isRunning,
    elapsedSeconds,
    timerType,
    pomodoroStage,
    countdownRemaining,
    resumeTimer,
    pauseTimer,
    tick,
    syncWithSession,
  } = useTimerStore()
  
  const stopSession = useStopSession()
  const dragControls = useDragControls()
  const constraintsRef = useRef<HTMLDivElement>(null)

  // Sync server session with client store
  useEffect(() => {
    if (activeSession) {
      syncWithSession(activeSession)
    } else {
      syncWithSession(null)
    }
  }, [activeSession, syncWithSession])

  // Run the clock tick interval
  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => {
        tick()
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning, tick])

  if (!activeSession) return null

  const formatTime = (totalSeconds: number) => {
    const hrs = Math.floor(totalSeconds / 3600)
    const mins = Math.floor((totalSeconds % 3600) / 60)
    const secs = totalSeconds % 60
    return [
      hrs > 0 ? String(hrs).padStart(2, "0") : null,
      String(mins).padStart(2, "0"),
      String(secs).padStart(2, "0"),
    ].filter(Boolean).join(":")
  }

  const displayedTime = 
    timerType === "POMODORO" || timerType === "COUNTDOWN"
      ? formatTime(countdownRemaining)
      : formatTime(elapsedSeconds)

  const handlePlayPause = () => {
    if (isRunning) {
      pauseTimer()
    } else {
      resumeTimer()
    }
  }

  const handleStop = () => {
    stopSession.mutate()
  }

  return (
    <div ref={constraintsRef} className="fixed inset-0 pointer-events-none z-50">
      <motion.div
        drag
        dragListener={false}
        dragControls={dragControls}
        dragMomentum={false}
        dragConstraints={constraintsRef}
        initial={{ x: window.innerWidth - 320, y: window.innerHeight - 120 }}
        className="absolute pointer-events-auto flex items-center gap-4 p-3 bg-card/90 backdrop-blur-md border border-border/80 rounded-2xl shadow-xl w-72"
      >
        <div 
          onPointerDown={(e) => dragControls.start(e)}
          className="cursor-grab active:cursor-grabbing text-muted-foreground hover:text-foreground shrink-0"
        >
          <GripHorizontal className="h-4 w-4" />
        </div>

        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center gap-1.5">
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {timerType === "POMODORO" ? `Pomo: ${pomodoroStage}` : timerType}
            </span>
          </div>
          <span className="font-mono text-xl font-bold tracking-tight mt-0.5">
            {displayedTime}
          </span>
          <span className="text-[10px] text-muted-foreground truncate max-w-[160px]">
            {activeSession.description || "No Description"}
          </span>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          <Button 
            variant="outline" 
            size="icon" 
            className="h-8 w-8 rounded-lg"
            onClick={handlePlayPause}
          >
            {isRunning ? <Pause className="h-3.5 w-3.5" /> : <Play className="h-3.5 w-3.5 fill-current" />}
          </Button>
          <Button 
            variant="destructive" 
            size="icon" 
            className="h-8 w-8 rounded-lg"
            onClick={handleStop}
          >
            <Square className="h-3.5 w-3.5 fill-current" />
          </Button>
        </div>
      </motion.div>
    </div>
  )
}

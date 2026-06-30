"use client"

import * as React from "react"
import { useTimeTracker } from "@/hooks/use-time-tracker"
import { motion, AnimatePresence } from "framer-motion"
import { Square } from "lucide-react"
import { Button } from "@/components/ui/button"

function formatDuration(ms: number) {
  const totalSeconds = Math.floor(ms / 1000)
  const hours = Math.floor(totalSeconds / 3600)
  const minutes = Math.floor((totalSeconds % 3600) / 60)
  const seconds = totalSeconds % 60

  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`
}

export function FloatingTimer() {
  const { isActive, startTime, description, stopTimer, setDescription } = useTimeTracker()
  const [elapsed, setElapsed] = React.useState(0)

  React.useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isActive && startTime) {
      setElapsed(Date.now() - startTime)
      interval = setInterval(() => {
        setElapsed(Date.now() - startTime)
      }, 1000)
    } else {
      setElapsed(0)
    }

    return () => clearInterval(interval)
  }, [isActive, startTime])

  return (
    <AnimatePresence>
      {isActive && (
        <motion.div
          initial={{ y: 100, opacity: 0, scale: 0.95 }}
          animate={{ y: 0, opacity: 1, scale: 1 }}
          exit={{ y: 100, opacity: 0, scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className="fixed bottom-8 left-1/2 -translate-x-1/2 z-[100] flex items-center gap-4 rounded-full border bg-card/90 p-2 pl-5 pr-2 shadow-2xl backdrop-blur-xl ring-1 ring-white/10"
        >
          <div className="flex items-center gap-3 border-r pr-4 border-border/50">
            <div className="relative flex h-3 w-3 items-center justify-center">
              <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex h-2 w-2 rounded-full bg-red-500"></span>
            </div>
            <span className="font-mono tabular-nums font-semibold text-sm tracking-widest text-foreground">
              {formatDuration(elapsed)}
            </span>
          </div>
          
          <input
            type="text"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="What are you working on?"
            className="w-56 bg-transparent text-sm font-medium focus-visible:outline-none placeholder:text-muted-foreground/50 transition-colors"
          />
          
          <Button 
            variant="destructive" 
            size="icon" 
            className="size-9 rounded-full ml-2 shadow-sm shrink-0 transition-transform hover:scale-105 active:scale-95"
            onClick={stopTimer}
          >
            <Square className="size-3.5 fill-current" />
            <span className="sr-only">Stop timer</span>
          </Button>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

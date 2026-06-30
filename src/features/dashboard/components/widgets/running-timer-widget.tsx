"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { widgetHover } from "@/lib/animations"
import { Timer, Play, Square, Pause } from "lucide-react"
import { Button } from "@/components/ui/button"
import { useState, useEffect } from "react"

export function RunningTimerWidget() {
  const [isRunning, setIsRunning] = useState(false)
  const [seconds, setSeconds] = useState(0)

  useEffect(() => {
    let interval: NodeJS.Timeout
    if (isRunning) {
      interval = setInterval(() => setSeconds(s => s + 1), 1000)
    }
    return () => clearInterval(interval)
  }, [isRunning])

  const formatTime = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds / 3600)
    const m = Math.floor((totalSeconds % 3600) / 60)
    const s = totalSeconds % 60
    return `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`
  }

  return (
    <motion.div
      variants={widgetHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="h-full"
    >
      <Card className="h-full border-primary/20 bg-primary/5">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Active Session</CardTitle>
          <Timer className="h-4 w-4 text-primary animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-mono font-bold tracking-tight text-primary">
            {formatTime(seconds)}
          </div>
          <p className="text-xs text-muted-foreground mt-1 mb-4">
            Deep Work - Dashboard Implementation
          </p>
          <div className="flex gap-2">
            <Button 
              size="sm" 
              variant={isRunning ? "secondary" : "default"}
              className="flex-1"
              onClick={() => setIsRunning(!isRunning)}
            >
              {isRunning ? <Pause className="h-4 w-4 mr-2" /> : <Play className="h-4 w-4 mr-2" />}
              {isRunning ? "Pause" : "Resume"}
            </Button>
            <Button 
              size="sm" 
              variant="destructive"
              className="px-3"
              onClick={() => { setIsRunning(false); setSeconds(0) }}
            >
              <Square className="h-4 w-4" />
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

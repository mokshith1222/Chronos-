"use client"

import * as React from "react"
import { useQueryClient } from "@tanstack/react-query"
import { eventBus, EVENTS } from "@/lib/event-bus"

export function useIntegration() {
  const queryClient = useQueryClient()

  React.useEffect(() => {
    // 1. Task Events Listener
    const unsubTaskCreated = eventBus.on(EVENTS.TASK_CREATED, () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      queryClient.invalidateQueries({ queryKey: ["reports-analytics"] })
    })

    const unsubTaskCompleted = eventBus.on(EVENTS.TASK_COMPLETED, () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      queryClient.invalidateQueries({ queryKey: ["reports-analytics"] })
    })

    const unsubTaskDeleted = eventBus.on(EVENTS.TASK_DELETED, () => {
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      queryClient.invalidateQueries({ queryKey: ["reports-analytics"] })
    })

    // 2. Timer Events Listener
    const unsubTimerStarted = eventBus.on(EVENTS.TIMER_STARTED, () => {
      queryClient.invalidateQueries({ queryKey: ["time-entries"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
    })

    const unsubTimerStopped = eventBus.on(EVENTS.TIMER_STOPPED, () => {
      queryClient.invalidateQueries({ queryKey: ["time-entries"] })
      queryClient.invalidateQueries({ queryKey: ["tasks"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      queryClient.invalidateQueries({ queryKey: ["reports-analytics"] })
    })

    // 3. Goal Events Listener
    const unsubGoalProgress = eventBus.on(EVENTS.GOAL_PROGRESS_UPDATED, () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
    })

    // 4. Habit Events Listener
    const unsubHabitCompleted = eventBus.on(EVENTS.HABIT_COMPLETED, () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard-stats"] })
      queryClient.invalidateQueries({ queryKey: ["reports-analytics"] })
    })

    return () => {
      unsubTaskCreated()
      unsubTaskCompleted()
      unsubTaskDeleted()
      unsubTimerStarted()
      unsubTimerStopped()
      unsubGoalProgress()
      unsubHabitCompleted()
    }
  }, [queryClient])
}

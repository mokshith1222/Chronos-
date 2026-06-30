"use client"

type EventCallback<T = any> = (data: T) => void

class EventBus {
  private listeners: Record<string, EventCallback[]> = {}

  on<T = any>(event: string, callback: EventCallback<T>): () => void {
    if (!this.listeners[event]) {
      this.listeners[event] = []
    }
    this.listeners[event].push(callback)

    // Return an unsubscribe function
    return () => {
      this.listeners[event] = this.listeners[event].filter((cb) => cb !== callback)
    }
  }

  emit<T = any>(event: string, data?: T): void {
    if (!this.listeners[event]) return
    this.listeners[event].forEach((callback) => {
      try {
        callback(data)
      } catch (err) {
        console.error(`Error in event listener for ${event}:`, err)
      }
    })
  }
}

export const eventBus = new EventBus()

export const EVENTS = {
  TASK_CREATED: "TASK_CREATED",
  TASK_COMPLETED: "TASK_COMPLETED",
  TASK_DELETED: "TASK_DELETED",
  TIMER_STARTED: "TIMER_STARTED",
  TIMER_STOPPED: "TIMER_STOPPED",
  GOAL_PROGRESS_UPDATED: "GOAL_PROGRESS_UPDATED",
  HABIT_COMPLETED: "HABIT_COMPLETED",
} as const

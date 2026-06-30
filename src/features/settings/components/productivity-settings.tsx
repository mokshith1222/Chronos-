"use client"

import * as React from "react"
import { usePreferencesStore } from "@/stores/preferences-store"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Target, Timer, Calendar, CheckSquare } from "lucide-react"

export function ProductivitySettings() {
  const { preferences, updatePreference } = usePreferencesStore()

  // Convert seconds to minutes for display
  const workMins = Math.round(preferences.pomodoroWorkDuration / 60)
  const shortBreakMins = Math.round(preferences.pomodoroShortBreakDuration / 60)
  const longBreakMins = Math.round(preferences.pomodoroLongBreakDuration / 60)

  const handlePomodoroChange = (key: "pomodoroWorkDuration" | "pomodoroShortBreakDuration" | "pomodoroLongBreakDuration", minsStr: string) => {
    const mins = parseInt(minsStr) || 1
    updatePreference(key, mins * 60)
  }

  return (
    <div className="space-y-6">
      {/* 1. Pomodoro Settings */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Timer className="size-4 text-primary" />
            Pomodoro Durations (Minutes)
          </CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Work Block</label>
            <input
              type="number"
              min="1"
              max="180"
              value={workMins}
              onChange={(e) => handlePomodoroChange("pomodoroWorkDuration", e.target.value)}
              className="w-full h-9 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Short Break</label>
            <input
              type="number"
              min="1"
              max="60"
              value={shortBreakMins}
              onChange={(e) => handlePomodoroChange("pomodoroShortBreakDuration", e.target.value)}
              className="w-full h-9 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
          <div className="space-y-1.5">
            <label className="text-[10px] font-bold text-muted-foreground uppercase">Long Break</label>
            <input
              type="number"
              min="1"
              max="120"
              value={longBreakMins}
              onChange={(e) => handlePomodoroChange("pomodoroLongBreakDuration", e.target.value)}
              className="w-full h-9 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
            />
          </div>
        </CardContent>
      </Card>

      {/* 2. Defaults */}
      <Card className="rounded-2xl border bg-card">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Target className="size-4 text-primary" />
            Productivity Defaults
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {/* Default Calendar View */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5">
            <div className="flex items-center gap-2">
              <Calendar className="size-4 text-muted-foreground shrink-0" />
              <div>
                <span className="text-xs font-bold text-foreground">Default Calendar View</span>
                <p className="text-[10px] text-muted-foreground">The landing view when opening the calendar</p>
              </div>
            </div>
            <select
              value={preferences.defaultCalendarView}
              onChange={(e) => updatePreference("defaultCalendarView", e.target.value)}
              className="h-8 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary min-w-[120px]"
            >
              <option value="month">Month View</option>
              <option value="week">Week View</option>
              <option value="day">Day View</option>
              <option value="agenda">Agenda View</option>
            </select>
          </div>

          {/* Default Task Priority */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 py-1.5 border-t border-border/50">
            <div className="flex items-center gap-2">
              <CheckSquare className="size-4 text-muted-foreground shrink-0" />
              <div>
                <span className="text-xs font-bold text-foreground">Default Task Priority</span>
                <p className="text-[10px] text-muted-foreground">Initial priority assigned to new tasks</p>
              </div>
            </div>
            <select
              value={preferences.defaultTaskPriority}
              onChange={(e) => updatePreference("defaultTaskPriority", e.target.value)}
              className="h-8 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary min-w-[120px]"
            >
              <option value="NO_PRIORITY">No Priority</option>
              <option value="LOW">Low</option>
              <option value="MEDIUM">Medium</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

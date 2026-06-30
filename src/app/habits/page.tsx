"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { HabitsList } from "@/features/goals-habits/components/habits-list"
import { HabitsCalendar } from "@/features/goals-habits/components/habits-calendar"
import { StatsDashboard } from "@/features/goals-habits/components/stats-dashboard"
import { Activity, BarChart3 } from "lucide-react"

export default function HabitsPage() {
  const [activeTab, setActiveTab] = React.useState<"tracker" | "stats">("tracker")

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Habit Tracking
            </h1>
            <p className="text-muted-foreground mt-1">
              Build positive routines, break bad habits, and track your daily consistency.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex bg-muted/50 p-1 rounded-xl border self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("tracker")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "tracker"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Activity className="size-3.5" />
              Tracker
            </button>
            <button
              onClick={() => setActiveTab("stats")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "stats"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <BarChart3 className="size-3.5" />
              Analytics
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1">
          {activeTab === "tracker" ? (
            <div className="space-y-8 animate-in fade-in duration-300">
              <HabitsList />
              <HabitsCalendar />
            </div>
          ) : (
            <div className="animate-in fade-in duration-300">
              <StatsDashboard />
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}

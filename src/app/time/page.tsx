"use client"

import { Suspense } from "react"
import { TimeModes } from "@/features/time/components/time-modes"
import { TimerPanel } from "@/features/time/components/timer-panel"
import { TimeHistoryList } from "@/features/time/components/time-history-list"
import { TimeAnalytics } from "@/features/time/components/time-analytics"
import { Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function TimePage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight">Time Tracking</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Monitor your deep work focus hours and Pomodoro metrics.
          </p>
        </div>

        <main className="flex-1 w-full mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Left Column: Timer Config / Controls */}
            <div className="lg:col-span-1 space-y-6">
              <TimeModes />
              <TimerPanel />
            </div>

            {/* Right Column: History & Analytics */}
            <div className="lg:col-span-2 space-y-6">
              <Suspense fallback={<Loader2 className="h-8 w-8 animate-spin mx-auto mt-20" />}>
                <TimeAnalytics />
                <TimeHistoryList />
              </Suspense>
            </div>
          </div>
        </main>
      </div>
    </DashboardLayout>
  )
}

"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { GoalsList } from "@/features/goals-habits/components/goals-list"
import { StatsDashboard } from "@/features/goals-habits/components/stats-dashboard"
import { Target, BarChart3 } from "lucide-react"

export default function GoalsPage() {
  const [activeTab, setActiveTab] = React.useState<"list" | "stats">("list")

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 h-full">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent">
              Goals Management
            </h1>
            <p className="text-muted-foreground mt-1">
              Set, track, and complete your long-term personal and professional objectives.
            </p>
          </div>

          {/* Tab Controls */}
          <div className="flex bg-muted/50 p-1 rounded-xl border self-start sm:self-auto">
            <button
              onClick={() => setActiveTab("list")}
              className={`flex items-center gap-1.5 px-4 py-2 rounded-lg text-xs font-semibold transition-all ${
                activeTab === "list"
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              }`}
            >
              <Target className="size-3.5" />
              Goals Board
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
          {activeTab === "list" ? <GoalsList /> : <StatsDashboard />}
        </div>
      </div>
    </DashboardLayout>
  )
}

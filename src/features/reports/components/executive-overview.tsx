"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Clock, CheckSquare, Activity, ShieldAlert, Target } from "lucide-react"

interface ExecutiveOverviewProps {
  summary: {
    totalHours: number
    productiveHours: number
    deepWorkHours: number
    tasksCompleted: number
    tasksCreated: number
    habitsCompleted: number
    habitsTotal: number
  }
  overallScore: number
}

export function ExecutiveOverview({ summary, overallScore }: ExecutiveOverviewProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
      {/* 1. Overall Productivity Index Card */}
      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-5">
          <Target className="size-24" />
        </div>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Productivity Index
          </CardTitle>
          <Target className="size-4 text-primary animate-pulse" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{overallScore}%</div>
          <div className="flex items-center gap-1.5 mt-1.5">
            <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
              <div
                className="h-full bg-primary rounded-full transition-all duration-1000"
                style={{ width: `${overallScore}%` }}
              />
            </div>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1.5">
            Weighted index of focus, completion, & habits
          </p>
        </CardContent>
      </Card>

      {/* 2. Tracked Time Card */}
      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tracked Time
          </CardTitle>
          <Clock className="size-4 text-amber-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">{summary.totalHours}h</div>
          <p className="text-xs text-muted-foreground mt-1.5">
            <span className="font-semibold text-foreground">{summary.productiveHours}h</span> productive focus hours
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            {summary.deepWorkHours}h logged as Deep Work / Pomodoro
          </p>
        </CardContent>
      </Card>

      {/* 3. Task Completions Card */}
      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Tasks Completed
          </CardTitle>
          <CheckSquare className="size-4 text-emerald-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {summary.tasksCompleted}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Compared to <span className="font-semibold text-foreground">{summary.tasksCreated}</span> new tasks created
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Completion rate: {summary.tasksCreated > 0 ? Math.round((summary.tasksCompleted / summary.tasksCreated) * 100) : 0}%
          </p>
        </CardContent>
      </Card>

      {/* 4. Habit consistency Card */}
      <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Habit Routine
          </CardTitle>
          <Activity className="size-4 text-rose-500" />
        </CardHeader>
        <CardContent>
          <div className="text-3xl font-bold">
            {summary.habitsCompleted}
          </div>
          <p className="text-xs text-muted-foreground mt-1.5">
            Total habit checks across {summary.habitsTotal} active habits
          </p>
          <p className="text-[10px] text-muted-foreground mt-0.5">
            Maintaining a daily structured routine
          </p>
        </CardContent>
      </Card>
    </div>
  )
}

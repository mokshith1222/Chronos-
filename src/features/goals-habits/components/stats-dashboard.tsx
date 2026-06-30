"use client"

import * as React from "react"
import { useGetStatsQuery } from "@/hooks/use-goals-queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart as RechartsBarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts"
import {
  Target,
  Activity,
  Flame,
  Award,
  TrendingUp,
  PieChart,
  BarChart,
} from "lucide-react"

export function StatsDashboard() {
  const { data: stats, isLoading, isError } = useGetStatsQuery()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 animate-pulse">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="h-24 rounded-2xl bg-muted" />
        ))}
      </div>
    )
  }

  if (isError || !stats) {
    return (
      <div className="text-center p-8 text-muted-foreground text-sm">
        Failed to load statistics
      </div>
    )
  }

  const { goals, habits } = stats

  const goalCompletionRate = goals.total > 0 
    ? Math.round((goals.completed / goals.total) * 100) 
    : 0

  return (
    <div className="space-y-6">
      {/* Overview Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Goal Completion
            </CardTitle>
            <Target className="size-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goalCompletionRate}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              {goals.completed} of {goals.total} goals completed
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Habit Consistency
            </CardTitle>
            <Activity className="size-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habits.consistencyScore}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Based on the last 30 days of tracking
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Best Streak
            </CardTitle>
            <Flame className="size-4 text-orange-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{habits.bestStreak} Days</div>
            <p className="text-xs text-muted-foreground mt-1">
              Your record habit streak!
            </p>
          </CardContent>
        </Card>

        <Card className="rounded-2xl border bg-card shadow-sm hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-xs font-bold uppercase tracking-wider text-muted-foreground">
              Avg Goal Progress
            </CardTitle>
            <Award className="size-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{goals.averageProgress}%</div>
            <p className="text-xs text-muted-foreground mt-1">
              Average across all active goals
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Habit Completion Trend */}
        <Card className="lg:col-span-2 rounded-2xl border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <BarChart className="size-4 text-primary" />
              Habit Completion Trend (Last 7 Days)
            </CardTitle>
          </CardHeader>
          <CardContent className="h-64">
            <ResponsiveContainer width="100%" height="100%">
              <RechartsBarChart data={habits.completionsByDay} margin={{ top: 10, right: 10, left: -25, bottom: 0 }}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                <XAxis dataKey="day" tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
                <YAxis allowDecimals={false} tick={{ fontSize: 10 }} stroke="currentColor" opacity={0.5} />
                <Tooltip
                  cursor={{ fill: "rgba(120, 120, 120, 0.08)" }}
                  contentStyle={{
                    backgroundColor: "hsl(var(--card))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                    boxShadow: "0 4px 24px rgba(0,0,0,0.10)"
                  }}
                />
                <Bar dataKey="completions" fill="var(--color-primary, #3b82f6)" radius={[4, 4, 0, 0]} maxBarSize={40} />
              </RechartsBarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        {/* Goal Categories & Breakdown */}
        <Card className="rounded-2xl border bg-card shadow-sm">
          <CardHeader>
            <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
              <PieChart className="size-4 text-primary" />
              Goal Category Breakdown
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {Object.keys(goals.byCategory).length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-12">No data available</p>
            ) : (
              <div className="space-y-3">
                {Object.entries(goals.byCategory).map(([category, count]) => {
                  const percentage = Math.round((count / goals.total) * 100)
                  return (
                    <div key={category} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-muted-foreground">{category}</span>
                        <span>
                          {count} ({percentage}%)
                        </span>
                      </div>
                      <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                        <div
                          className="h-full bg-primary rounded-full"
                          style={{ width: `${percentage}%` }}
                        />
                      </div>
                    </div>
                  )
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

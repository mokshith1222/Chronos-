"use client"

import { useTimeStats } from "@/hooks/use-time-queries"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from "recharts"
import { Skeleton } from "@/components/ui/skeleton"
import { Award, Clock, Flame, Zap } from "lucide-react"

export function TimeAnalytics() {
  const { data: stats, isLoading, isError } = useTimeStats()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 animate-pulse">
        {[...Array(4)].map((_, i) => (
          <Skeleton key={i} className="h-24 rounded-xl" />
        ))}
      </div>
    )
  }

  if (isError || !stats) {
    return null
  }

  const statCards = [
    { label: "Focus Hours", value: `${stats.totalHours}h`, icon: Clock, color: "text-blue-500" },
    { label: "Productivity", value: `${stats.productivityScore}%`, icon: Award, color: "text-emerald-500" },
    { label: "Deep Work", value: `${stats.deepWorkHours}h`, icon: Zap, color: "text-amber-500" },
    { label: "Pomodoros", value: stats.pomodorosCompleted, icon: Flame, color: "text-orange-500" },
  ]

  return (
    <div className="space-y-6">
      {/* Metric Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {statCards.map((card, i) => {
          const Icon = card.icon
          return (
            <Card key={i} className="border-border/50 bg-card/40">
              <CardContent className="p-4 flex items-center justify-between">
                <div className="space-y-1">
                  <span className="text-xs text-muted-foreground font-medium">{card.label}</span>
                  <p className="text-xl font-bold tracking-tight text-foreground">{card.value}</p>
                </div>
                <div className={`${card.color} p-2 rounded-lg bg-background/50`}>
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Weekly Focus Bar Chart */}
        <Card className="md:col-span-2 border-border/50 bg-card/40">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Weekly Activity Curve
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[260px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.dailyActivity} margin={{ top: 10, right: 5, left: -25, bottom: 0 }}>
                  <XAxis dataKey="name" fontSize={11} tickLine={false} axisLine={false} />
                  <YAxis fontSize={11} tickLine={false} axisLine={false} tickFormatter={(v) => `${v}h`} />
                  <Tooltip
                    cursor={{ fill: "rgba(120, 120, 120, 0.08)" }}
                    contentStyle={{ borderRadius: "8px", border: "1px solid hsl(var(--border))", backgroundColor: "hsl(var(--background))" }}
                  />
                  <Bar dataKey="hours" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        {/* Project Distribution Pie Chart */}
        <Card className="border-border/50 bg-card/40">
          <CardHeader>
            <CardTitle className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Project Distribution
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center justify-center">
            {stats.projectDistribution.length === 0 ? (
              <div className="h-[260px] flex items-center justify-center text-xs text-muted-foreground">
                No project data this week
              </div>
            ) : (
              <>
                <div className="h-[180px] w-full">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stats.projectDistribution}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={80}
                        paddingAngle={2}
                        dataKey="value"
                      >
                        {stats.projectDistribution.map((entry: any, index: number) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="w-full space-y-1.5 mt-4">
                  {stats.projectDistribution.map((entry: any, index: number) => (
                    <div key={index} className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5 min-w-0">
                        <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: entry.color }} />
                        <span className="truncate text-muted-foreground">{entry.name}</span>
                      </div>
                      <span className="font-semibold text-foreground">{entry.value}h</span>
                    </div>
                  ))}
                </div>
              </>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

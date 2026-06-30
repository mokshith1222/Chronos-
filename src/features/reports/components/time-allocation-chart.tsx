"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Legend,
} from "recharts"
import { Clock } from "lucide-react"

interface TimeAllocationChartProps {
  allocation: {
    projects: { id: string; name: string; value: number; color: string }[]
    tasks: { id: string; title: string; value: number }[]
  }
}

export function TimeAllocationChart({ allocation }: TimeAllocationChartProps) {
  const hasProjects = allocation.projects.length > 0
  const hasTasks = allocation.tasks.length > 0

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Project Time Allocation (Donut) */}
      <Card className="rounded-2xl border bg-card shadow-sm h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            Project Time Allocation (Hours)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          {!hasProjects ? (
            <div className="text-xs text-muted-foreground text-center py-12 select-none">
              No time entries logged for projects in this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={allocation.projects}
                  cx="50%"
                  cy="50%"
                  innerRadius="60%"
                  outerRadius="80%"
                  paddingAngle={3}
                  dataKey="value"
                  nameKey="name"
                >
                  {allocation.projects.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color || "#3b82f6"} />
                  ))}
                </Pie>
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value} hours`]}
                />
                <Legend
                  verticalAlign="bottom"
                  height={36}
                  iconType="circle"
                  iconSize={8}
                  wrapperStyle={{ fontSize: "10px" }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>

      {/* 2. Top Tasks (Horizontal Bar) */}
      <Card className="rounded-2xl border bg-card shadow-sm h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Clock className="size-4 text-primary" />
            Top Tasks by Time Spent (Hours)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64 flex items-center justify-center">
          {!hasTasks ? (
            <div className="text-xs text-muted-foreground text-center py-12 select-none">
              No time entries logged for tasks in this period.
            </div>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                layout="vertical"
                data={allocation.tasks}
                margin={{ top: 5, right: 10, left: 10, bottom: 5 }}
              >
                <XAxis type="number" stroke="currentColor" opacity={0.5} tick={{ fontSize: 10 }} />
                <YAxis
                  type="category"
                  dataKey="title"
                  stroke="currentColor"
                  opacity={0.5}
                  tick={{ fontSize: 9 }}
                  width={90}
                />
                <Tooltip
                  contentStyle={{
                    backgroundColor: "hsl(var(--popover))",
                    borderColor: "hsl(var(--border))",
                    borderRadius: "12px",
                    fontSize: "12px",
                  }}
                  formatter={(value) => [`${value} hours`]}
                />
                <Bar dataKey="value" fill="var(--color-primary, #3b82f6)" radius={[0, 4, 4, 0]} maxBarSize={24} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts"
import { Flame } from "lucide-react"

interface PeakHoursHeatmapProps {
  peakTime: {
    bestHour: string
    bestDay: string
    hourly: { hour: string; hours: number }[]
    daily: { day: string; hours: number }[]
  }
}

export function PeakHoursHeatmap({ peakTime }: PeakHoursHeatmapProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      {/* 1. Daily Distribution */}
      <Card className="rounded-2xl border bg-card shadow-sm h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Flame className="size-4 text-primary animate-pulse" />
            Activity by Day of Week (Hours)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={peakTime.daily}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="day" tick={{ fontSize: 9 }} stroke="currentColor" opacity={0.5} />
              <YAxis tick={{ fontSize: 9 }} stroke="currentColor" opacity={0.5} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value} hours`]}
              />
              <Bar dataKey="hours" fill="#eab308" radius={[4, 4, 0, 0]} maxBarSize={36} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* 2. Hourly Distribution */}
      <Card className="rounded-2xl border bg-card shadow-sm h-full flex flex-col justify-between">
        <CardHeader>
          <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
            <Flame className="size-4 text-primary animate-pulse" />
            Activity by Hour of Day (Hours)
          </CardTitle>
        </CardHeader>
        <CardContent className="h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={peakTime.hourly}
              margin={{ top: 10, right: 10, left: -25, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
              <XAxis dataKey="hour" tick={{ fontSize: 8 }} stroke="currentColor" opacity={0.5} />
              <YAxis tick={{ fontSize: 9 }} stroke="currentColor" opacity={0.5} />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--popover))",
                  borderColor: "hsl(var(--border))",
                  borderRadius: "12px",
                  fontSize: "12px",
                }}
                formatter={(value) => [`${value} hours`]}
              />
              <Bar dataKey="hours" fill="#f97316" radius={[2, 2, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}

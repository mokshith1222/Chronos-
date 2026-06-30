"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  AreaChart,
  Area,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts"
import { TrendingUp } from "lucide-react"

interface ProductivityTrendsProps {
  trends: {
    date: string
    productive: number
    unproductive: number
    tasks: number
  }[]
}

export function ProductivityTrends({ trends }: ProductivityTrendsProps) {
  return (
    <Card className="rounded-2xl border bg-card shadow-sm h-full flex flex-col justify-between">
      <CardHeader>
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <TrendingUp className="size-4 text-primary" />
          Productivity Trends over Time
        </CardTitle>
      </CardHeader>
      <CardContent className="h-72">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart
            data={trends}
            margin={{ top: 10, right: -10, left: -25, bottom: 0 }}
          >
            <defs>
              <linearGradient id="colorProductive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#10b981" stopOpacity={0.25} />
                <stop offset="95%" stopColor="#10b981" stopOpacity={0.0} />
              </linearGradient>
              <linearGradient id="colorUnproductive" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#6b7280" stopOpacity={0.15} />
                <stop offset="95%" stopColor="#6b7280" stopOpacity={0.0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" opacity={0.1} />
            <XAxis dataKey="date" tick={{ fontSize: 9 }} stroke="currentColor" opacity={0.5} />
            
            <YAxis
              yAxisId="left"
              tick={{ fontSize: 9 }}
              stroke="currentColor"
              opacity={0.5}
              label={{ value: "Hours", angle: -90, position: "insideLeft", fontSize: 9, offset: 10 }}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fontSize: 9 }}
              stroke="currentColor"
              opacity={0.5}
              label={{ value: "Tasks Completed", angle: 90, position: "insideRight", fontSize: 9, offset: 10 }}
            />

            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Legend
              verticalAlign="top"
              height={36}
              iconType="circle"
              iconSize={8}
              wrapperStyle={{ fontSize: "10px" }}
            />

            {/* Productive Time Area */}
            <Area
              yAxisId="left"
              type="monotone"
              name="Productive Hours"
              dataKey="productive"
              stroke="#10b981"
              fillOpacity={1}
              fill="url(#colorProductive)"
              stackId="1"
            />

            {/* Unproductive Time Area */}
            <Area
              yAxisId="left"
              type="monotone"
              name="Unproductive Hours"
              dataKey="unproductive"
              stroke="#6b7280"
              fillOpacity={1}
              fill="url(#colorUnproductive)"
              stackId="1"
            />

            {/* Tasks Completed Line */}
            <Line
              yAxisId="right"
              type="monotone"
              name="Tasks Completed"
              dataKey="tasks"
              stroke="var(--color-primary, #3b82f6)"
              strokeWidth={2.5}
              dot={{ r: 3 }}
              activeDot={{ r: 5 }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { widgetHover } from "@/lib/animations"
import { Bar, BarChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts"
import { useDashboardAnalytics } from "@/hooks/use-dashboard-queries"
import { useDashboardStore } from "@/stores/dashboard-store"
import { Skeleton } from "@/components/ui/skeleton"

export function WeeklyProductivityChart() {
  const { data, isLoading, isError } = useDashboardAnalytics()
  const { timeRange } = useDashboardStore()

  const titleMap: Record<string, string> = {
    today: "Today's Activity",
    yesterday: "Yesterday's Activity",
    thisWeek: "This Week's Productivity",
    thisMonth: "This Month's Productivity",
  }
  const chartTitle = titleMap[timeRange] || "Productivity"

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full flex items-center justify-center">
            <Skeleton className="h-full w-full rounded-2xl" />
          </div>
        </CardContent>
      </Card>
    )
  }

  if (isError || !data) {
    return (
      <Card className="h-full">
        <CardContent className="flex h-[260px] items-center justify-center text-sm text-destructive">
          Failed to load productivity data
        </CardContent>
      </Card>
    )
  }

  const chartData = data.weeklyProductivity

  return (
    <motion.div
      variants={widgetHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="h-full"
    >
      <Card className="h-full overflow-visible">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium">{chartTitle}</CardTitle>
        </CardHeader>
        <CardContent className="overflow-visible">
          <div className="h-[200px] w-full overflow-visible">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                <XAxis 
                  dataKey="day" 
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                />
                <YAxis
                  stroke="#888888"
                  fontSize={12}
                  tickLine={false}
                  axisLine={false}
                  tickFormatter={(value) => `${value}h`}
                />
                <Tooltip 
                  cursor={{ fill: 'rgba(120, 120, 120, 0.08)' }}
                  contentStyle={{ 
                    borderRadius: '12px', 
                    border: '1px solid hsl(var(--border))', 
                    backgroundColor: 'hsl(var(--card))',
                    fontSize: '12px',
                    boxShadow: '0 4px 24px rgba(0,0,0,0.10)'
                  }}
                  wrapperStyle={{ zIndex: 50 }}
                  allowEscapeViewBox={{ x: false, y: true }}
                  formatter={(value: any) => [`${value}h`, 'Hours']}
                />
                <Bar 
                  dataKey="hours" 
                  fill="hsl(var(--primary))" 
                  radius={[4, 4, 0, 0]}
                  animationDuration={1500}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

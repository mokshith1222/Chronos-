"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  Radar,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  ResponsiveContainer,
  Tooltip,
} from "recharts"
import { Target } from "lucide-react"

interface ProductivityScoreRadarProps {
  scores: {
    focus: number
    consistency: number
    completion: number
    deepWork: number
    planning: number
    overall: number
  }
}

export function ProductivityScoreRadar({ scores }: ProductivityScoreRadarProps) {
  const data = React.useMemo(() => {
    return [
      { subject: "Focus", score: scores.focus, fullMark: 100 },
      { subject: "Consistency", score: scores.consistency, fullMark: 100 },
      { subject: "Completion", score: scores.completion, fullMark: 100 },
      { subject: "Deep Work", score: scores.deepWork, fullMark: 100 },
      { subject: "Planning", score: scores.planning, fullMark: 100 },
    ]
  }, [scores])

  return (
    <Card className="rounded-2xl border bg-card shadow-sm h-full flex flex-col justify-between">
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <Target className="size-4 text-primary" />
          Productivity Dimensions
        </CardTitle>
      </CardHeader>
      <CardContent className="h-64 flex items-center justify-center pt-2">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart cx="50%" cy="50%" outerRadius="75%" data={data}>
            <PolarGrid stroke="currentColor" opacity={0.15} />
            <PolarAngleAxis
              dataKey="subject"
              tick={{ fontSize: 10, fontWeight: "bold" }}
              stroke="currentColor"
              opacity={0.6}
            />
            <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 8 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--popover))",
                borderColor: "hsl(var(--border))",
                borderRadius: "12px",
                fontSize: "12px",
              }}
            />
            <Radar
              name="Score"
              dataKey="score"
              stroke="var(--color-primary, #3b82f6)"
              fill="var(--color-primary, #3b82f6)"
              fillOpacity={0.25}
            />
          </RadarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}

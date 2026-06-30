"use client"

import * as React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Sparkles, Lightbulb, CheckCircle2, ArrowRight } from "lucide-react"

interface InsightsPanelProps {
  insights: string[]
  peakTime: {
    bestHour: string
    bestDay: string
  }
}

export function InsightsPanel({ insights, peakTime }: InsightsPanelProps) {
  return (
    <Card className="rounded-2xl border bg-card shadow-sm h-full flex flex-col justify-between overflow-hidden relative">
      <div className="absolute top-0 right-0 p-6 opacity-[0.03] text-primary select-none pointer-events-none">
        <Sparkles className="size-32" />
      </div>

      <CardHeader>
        <CardTitle className="text-sm font-bold text-foreground flex items-center gap-2">
          <Sparkles className="size-4 text-primary animate-pulse" />
          Productivity Insights
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        {/* Peak Stats Summary */}
        <div className="grid grid-cols-2 gap-4 p-3 bg-muted/40 border border-border/50 rounded-2xl">
          <div>
            <div className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider">Most Active Day</div>
            <div className="text-foreground text-sm font-bold mt-0.5">{peakTime.bestDay}</div>
          </div>
          <div>
            <div className="text-muted-foreground text-[9px] uppercase font-bold tracking-wider">Peak Focus Hour</div>
            <div className="text-foreground text-sm font-bold mt-0.5">{peakTime.bestHour}</div>
          </div>
        </div>

        {/* Actionable Recommendations List */}
        <div className="space-y-3.5 pt-2">
          {insights.map((insight, index) => {
            const isSuccess = insight.startsWith("Excellent")
            
            return (
              <div key={index} className="flex gap-3 items-start p-3 bg-background/40 border rounded-2xl shadow-xs hover:shadow-sm transition-shadow duration-200">
                <div className="mt-0.5">
                  {isSuccess ? (
                    <CheckCircle2 className="size-4 text-emerald-500 fill-emerald-500/10 shrink-0" />
                  ) : (
                    <Lightbulb className="size-4 text-amber-500 shrink-0" />
                  )}
                </div>
                <div className="space-y-1">
                  <p className="text-xs font-medium text-foreground leading-relaxed">
                    {insight}
                  </p>
                  {!isSuccess && (
                    <span className="text-[10px] font-bold text-primary flex items-center gap-1 hover:underline cursor-pointer">
                      Action Item <ArrowRight className="size-3" />
                    </span>
                  )}
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
}

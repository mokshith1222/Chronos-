"use client"

import { useDashboardStore } from "@/stores/dashboard-store"
import { Button } from "@/components/ui/button"
import { Sliders } from "lucide-react"
import { cn } from "@/lib/utils"

export function DashboardFilters() {
  const { timeRange, setTimeRange, isEditingLayout, setIsEditingLayout } = useDashboardStore()

  const filters = [
    { id: "today", label: "Today" },
    { id: "yesterday", label: "Yesterday" },
    { id: "thisWeek", label: "This Week" },
    { id: "thisMonth", label: "This Month" },
  ] as const

  return (
    <div className="flex items-center gap-3 flex-wrap">
      <div className="flex items-center gap-2 p-1 bg-muted/50 rounded-lg border w-fit">
        {filters.map((filter) => (
          <Button
            key={filter.id}
            variant={timeRange === filter.id ? "default" : "ghost"}
            size="sm"
            className="h-7 text-xs px-3 rounded-md"
            onClick={() => setTimeRange(filter.id)}
          >
            {filter.label}
          </Button>
        ))}
      </div>

      <Button
        variant={isEditingLayout ? "secondary" : "outline"}
        size="sm"
        className={cn(
          "h-9 rounded-lg text-xs font-semibold gap-1.5 border-border/60 shadow-sm",
          isEditingLayout && "bg-primary/10 border-primary/30 text-primary hover:bg-primary/20"
        )}
        onClick={() => setIsEditingLayout(!isEditingLayout)}
      >
        <Sliders className="size-3.5" />
        <span>Customize</span>
      </Button>
    </div>
  )
}

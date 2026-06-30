"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { useProjects } from "@/hooks/use-projects-queries"
import { Calendar, Download, Printer, Filter } from "lucide-react"

interface ReportFiltersProps {
  onFilterChange: (filters: { startDate: string; endDate: string; projectId?: string }) => void
  onExport: (format: "csv" | "json" | "print") => void
}

export function ReportFilters({ onFilterChange, onExport }: ReportFiltersProps) {
  const { data: projects } = useProjects()
  const [preset, setPreset] = React.useState<"week" | "month" | "month-last" | "year" | "custom">("week")
  
  const [startDate, setStartDate] = React.useState("")
  const [endDate, setEndDate] = React.useState("")
  const [projectId, setProjectId] = React.useState("")

  const applyPreset = (selectedPreset: typeof preset) => {
    setPreset(selectedPreset)
    const end = new Date()
    const start = new Date()

    if (selectedPreset === "week") {
      start.setDate(end.getDate() - 7)
    } else if (selectedPreset === "month") {
      start.setDate(end.getDate() - 30)
    } else if (selectedPreset === "month-last") {
      start.setDate(end.getDate() - 60)
      end.setDate(end.getDate() - 30)
    } else if (selectedPreset === "year") {
      start.setDate(end.getDate() - 365)
    }

    const startStr = start.toISOString().split("T")[0]
    const endStr = end.toISOString().split("T")[0]
    
    setStartDate(startStr)
    setEndDate(endStr)

    onFilterChange({
      startDate: startStr,
      endDate: endStr,
      projectId: projectId || undefined,
    })
  }

  // Initialize with last 7 days
  React.useEffect(() => {
    applyPreset("week")
  }, [])

  const handleCustomDateChange = (start: string, end: string) => {
    setStartDate(start)
    setEndDate(end)
    if (start && end) {
      onFilterChange({
        startDate: start,
        endDate: end,
        projectId: projectId || undefined,
      })
    }
  }

  const handleProjectChange = (id: string) => {
    setProjectId(id)
    onFilterChange({
      startDate,
      endDate,
      projectId: id || undefined,
    })
  }

  return (
    <div className="flex flex-col gap-4 p-4 border bg-card/40 rounded-2xl print:hidden">
      <div className="flex flex-col lg:flex-row gap-4 justify-between items-start lg:items-center">
        {/* Preset buttons */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-muted/50 border rounded-xl">
          <button
            onClick={() => applyPreset("week")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              preset === "week"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Last 7 Days
          </button>
          <button
            onClick={() => applyPreset("month")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              preset === "month"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Last 30 Days
          </button>
          <button
            onClick={() => applyPreset("month-last")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              preset === "month-last"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Previous Month
          </button>
          <button
            onClick={() => applyPreset("year")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              preset === "year"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Last Year
          </button>
          <button
            onClick={() => setPreset("custom")}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
              preset === "custom"
                ? "bg-background text-foreground shadow-sm"
                : "text-muted-foreground hover:text-foreground"
            }`}
          >
            Custom Range
          </button>
        </div>

        {/* Action Buttons (Export/Print) */}
        <div className="flex gap-2 w-full lg:w-auto justify-end">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport("csv")}
            className="rounded-xl text-xs flex items-center gap-1.5"
          >
            <Download className="size-3.5" />
            Export CSV
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport("json")}
            className="rounded-xl text-xs flex items-center gap-1.5"
          >
            <Download className="size-3.5" />
            JSON
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => onExport("print")}
            className="rounded-xl text-xs flex items-center gap-1.5"
          >
            <Printer className="size-3.5" />
            Print Report
          </Button>
        </div>
      </div>

      {/* Custom range & project selector */}
      {(preset === "custom" || projectId) && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-3 border-t border-border/50 animate-in slide-in-from-top-2 duration-300">
          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3" /> Start Date
            </label>
            <input
              type="date"
              value={startDate}
              onChange={(e) => handleCustomDateChange(e.target.value, endDate)}
              disabled={preset !== "custom"}
              className="w-full h-9 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              <Calendar className="size-3" /> End Date
            </label>
            <input
              type="date"
              value={endDate}
              onChange={(e) => handleCustomDateChange(startDate, e.target.value)}
              disabled={preset !== "custom"}
              className="w-full h-9 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] uppercase font-bold text-muted-foreground flex items-center gap-1">
              <Filter className="size-3" /> Filter Project
            </label>
            <select
              value={projectId}
              onChange={(e) => handleProjectChange(e.target.value)}
              className="w-full h-9 px-3 bg-background border border-input rounded-xl text-xs outline-none focus:ring-1 focus:ring-primary"
            >
              <option value="">All Projects</option>
              {projects?.map((p: any) => (
                <option key={p.id} value={p.id}>
                  {p.name}
                </option>
              ))}
            </select>
          </div>
        </div>
      )}
    </div>
  )
}

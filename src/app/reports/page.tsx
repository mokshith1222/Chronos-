"use client"

import * as React from "react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { ReportFilters } from "@/features/reports/components/report-filters"
import { ExecutiveOverview } from "@/features/reports/components/executive-overview"
import { ProductivityScoreRadar } from "@/features/reports/components/productivity-score-radar"
import { TimeAllocationChart } from "@/features/reports/components/time-allocation-chart"
import { ProductivityTrends } from "@/features/reports/components/productivity-trends"
import { PeakHoursHeatmap } from "@/features/reports/components/peak-hours-heatmap"
import { InsightsPanel } from "@/features/reports/components/insights-panel"
import { useGetAnalyticsQuery } from "@/hooks/use-reports-queries"
import { AlertCircle, BarChart3 } from "lucide-react"

export default function ReportsPage() {
  const [filters, setFilters] = React.useState<{
    startDate: string
    endDate: string
    projectId?: string
  }>({
    startDate: "",
    endDate: "",
  })

  const { data, isLoading, isError, refetch } = useGetAnalyticsQuery(filters)

  const handleExport = (format: "csv" | "json" | "print") => {
    if (!data) return

    if (format === "print") {
      window.print()
      return
    }

    let fileContent = ""
    let fileName = `chronos-report-${filters.startDate}-to-${filters.endDate}`
    let mimeType = ""

    if (format === "csv") {
      // Create CSV of project allocation
      const headers = ["Project Name", "Hours Spent"]
      const rows = data.allocation.projects.map((p) => [p.name, p.value.toString()])
      
      fileContent = [
        headers.join(","),
        ...rows.map((r) => r.map(val => `"${val}"`).join(",")),
      ].join("\n")

      fileName += ".csv"
      mimeType = "text/csv;charset=utf-8;"
    } else if (format === "json") {
      fileContent = JSON.stringify(data, null, 2)
      fileName += ".json"
      mimeType = "application/json;charset=utf-8;"
    }

    const blob = new Blob([fileContent], { type: mimeType })
    const link = document.createElement("a")
    if (link.download !== undefined) {
      const url = URL.createObjectURL(blob)
      link.setAttribute("href", url)
      link.setAttribute("download", fileName)
      link.style.visibility = "hidden"
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    }
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6 h-full print:p-0 print:gap-4">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b pb-5 print:border-b-0 print:pb-0">
          <div>
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-foreground to-foreground/70 bg-clip-text text-transparent flex items-center gap-2">
              <BarChart3 className="size-8 text-primary print:hidden" />
              Reports & Analytics
            </h1>
            <p className="text-muted-foreground mt-1 text-sm print:hidden">
              Analyze your work trends, focus scores, and time allocation.
            </p>
            <p className="hidden print:block text-xs text-muted-foreground">
              Chronos Performance Report: {filters.startDate} to {filters.endDate}
            </p>
          </div>
        </div>

        {/* Filters */}
        <ReportFilters onFilterChange={setFilters} onExport={handleExport} />

        {/* Main Content Dashboard */}
        {isLoading ? (
          <div className="space-y-6 animate-pulse">
            <div className="grid grid-cols-4 gap-4 h-24 bg-muted rounded-2xl" />
            <div className="grid grid-cols-3 gap-6 h-72">
              <div className="col-span-2 bg-muted rounded-2xl" />
              <div className="bg-muted rounded-2xl" />
            </div>
            <div className="grid grid-cols-2 gap-6 h-64">
              <div className="bg-muted rounded-2xl" />
              <div className="bg-muted rounded-2xl" />
            </div>
          </div>
        ) : isError || !data ? (
          <div className="text-center p-16 border border-dashed rounded-3xl bg-card/10">
            <AlertCircle className="size-16 text-destructive mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-foreground">Failed to Load Analytics</h3>
            <p className="text-muted-foreground text-sm mt-1">
              Please check your connection or database status and try again.
            </p>
          </div>
        ) : (
          <div className="space-y-6 animate-in fade-in duration-500 print:space-y-4">
            {/* Top scorecards */}
            <ExecutiveOverview summary={data.summary} overallScore={data.scores.overall} />

            {/* Trends & Radar */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3">
              <div className="lg:col-span-2 print:col-span-2">
                <ProductivityTrends trends={data.trends} />
              </div>
              <div>
                <ProductivityScoreRadar scores={data.scores} />
              </div>
            </div>

            {/* Time Allocation (Projects & Tasks) */}
            <TimeAllocationChart allocation={data.allocation} />

            {/* Peak Hours & Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 print:grid-cols-3">
              <div className="lg:col-span-2 print:col-span-2">
                <PeakHoursHeatmap peakTime={data.peakTime} />
              </div>
              <div>
                <InsightsPanel insights={data.insights} peakTime={data.peakTime} />
              </div>
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}

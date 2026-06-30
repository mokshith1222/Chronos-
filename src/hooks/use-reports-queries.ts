import { useQuery } from "@tanstack/react-query"

const WORKSPACE_ID = "cm0q9z8x0000008l4f1h7a3n2"

export interface AnalyticsData {
  summary: {
    totalHours: number
    productiveHours: number
    deepWorkHours: number
    tasksCompleted: number
    tasksCreated: number
    habitsCompleted: number
    habitsTotal: number
  }
  scores: {
    focus: number
    consistency: number
    completion: number
    deepWork: number
    planning: number
    overall: number
  }
  allocation: {
    projects: { id: string; name: string; value: number; color: string }[]
    tasks: { id: string; title: string; value: number }[]
  }
  trends: {
    date: string
    productive: number
    unproductive: number
    tasks: number
  }[]
  peakTime: {
    bestHour: string
    bestDay: string
    hourly: { hour: string; hours: number }[]
    daily: { day: string; hours: number }[]
  }
  insights: string[]
}

export function useGetAnalyticsQuery(filters?: {
  startDate?: string
  endDate?: string
  projectId?: string
}) {
  const queryParams = new URLSearchParams({ workspaceId: WORKSPACE_ID })
  if (filters?.startDate) queryParams.append("startDate", filters.startDate)
  if (filters?.endDate) queryParams.append("endDate", filters.endDate)
  if (filters?.projectId) queryParams.append("projectId", filters.projectId)

  return useQuery<AnalyticsData>({
    queryKey: ["reports-analytics", filters],
    queryFn: async () => {
      const res = await fetch(`/api/reports/analytics?${queryParams.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch analytics data")
      return res.json()
    },
  })
}

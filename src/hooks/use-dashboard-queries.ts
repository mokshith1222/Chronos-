import { useQuery } from "@tanstack/react-query"
import { useDashboardStore } from "@/stores/dashboard-store"

// Hardcoded for demo/initial implementation. 
// In a real app, this comes from an Auth Provider (e.g. Supabase session)
const WORKSPACE_ID = "cm0q9z8x0000008l4f1h7a3n2" 

interface DashboardOverview {
  activeProjects: number
  tasksCompletedToday: number
  totalHoursToday: number
  productivityScore: number
  avgGoalProgress: number
}

export function useDashboardOverview() {
  const { timeRange } = useDashboardStore()
  return useQuery<DashboardOverview>({
    queryKey: ["dashboard", "overview", WORKSPACE_ID, timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/overview?workspaceId=${WORKSPACE_ID}&timeRange=${timeRange}`)
      if (!res.ok) {
        throw new Error("Failed to fetch dashboard overview")
      }
      return res.json()
    },
    refetchInterval: 60000, // Refetch every minute
  })
}

export function useDashboardNotes() {
  return useQuery({
    queryKey: ["dashboard", "notes", WORKSPACE_ID],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/notes?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch notes")
      return res.json()
    }
  })
}

export function useDashboardPinned() {
  return useQuery({
    queryKey: ["dashboard", "pinned", WORKSPACE_ID],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/pinned?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch pinned")
      return res.json()
    }
  })
}

export function useDashboardProjects() {
  return useQuery({
    queryKey: ["dashboard", "projects", WORKSPACE_ID],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/projects?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch projects")
      return res.json()
    }
  })
}

export function useDashboardTasks() {
  const { timeRange } = useDashboardStore()
  return useQuery({
    queryKey: ["dashboard", "tasks", WORKSPACE_ID, timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/tasks?workspaceId=${WORKSPACE_ID}&timeRange=${timeRange}`)
      if (!res.ok) throw new Error("Failed to fetch tasks")
      return res.json()
    }
  })
}

export function useDashboardGoals() {
  return useQuery({
    queryKey: ["dashboard", "goals", WORKSPACE_ID],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/goals?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch goals")
      return res.json()
    }
  })
}

export function useDashboardHabits() {
  return useQuery({
    queryKey: ["dashboard", "habits", WORKSPACE_ID],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/habits?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch habits")
      return res.json()
    }
  })
}

export function useDashboardActivity() {
  return useQuery({
    queryKey: ["dashboard", "activity", WORKSPACE_ID],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/activity?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch activity")
      return res.json()
    }
  })
}

export function useDashboardCalendar() {
  return useQuery({
    queryKey: ["dashboard", "calendar", WORKSPACE_ID],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/calendar?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch calendar")
      return res.json()
    }
  })
}

export function useDashboardAnalytics() {
  const { timeRange } = useDashboardStore()
  return useQuery<{
    weeklyProductivity: { day: string; hours: number }[]
    projectDistribution: { name: string; value: number; color: string }[]
  }>({
    queryKey: ["dashboard", "analytics", WORKSPACE_ID, timeRange],
    queryFn: async () => {
      const res = await fetch(`/api/dashboard/analytics?workspaceId=${WORKSPACE_ID}&timeRange=${timeRange}`)
      if (!res.ok) throw new Error("Failed to fetch analytics")
      return res.json()
    }
  })
}

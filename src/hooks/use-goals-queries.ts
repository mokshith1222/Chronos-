import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { toast } from "sonner"

const WORKSPACE_ID = "cm0q9z8x0000008l4f1h7a3n2"

export interface Milestone {
  id: string
  goalId: string
  title: string
  status: "TODO" | "IN_PROGRESS" | "COMPLETED"
  isCompleted: boolean
  dueDate: string | null
  position: number
}

export interface Goal {
  id: string
  workspaceId: string
  title: string
  description: string | null
  category: "PERSONAL" | "STUDY" | "WORK" | "HEALTH" | "FITNESS" | "FINANCIAL" | "READING" | "LEARNING" | "CUSTOM"
  priority: "LOW" | "MEDIUM" | "HIGH" | "URGENT"
  status: "ACTIVE" | "COMPLETED" | "ARCHIVED" | "ABANDONED"
  targetDate: string | null
  progress: number
  currentValue: number
  targetValue: number | null
  units: string | null
  color: string
  icon: string
  tags: string | null
  notes: string | null
  projectId: string | null
  taskId: string | null
  milestones: Milestone[]
  project?: {
    id: string
    name: string
    color: string | null
  }
  task?: {
    id: string
    title: string
    status: string
  }
}

export interface HabitHistory {
  id: string
  habitId: string
  status: "COMPLETED" | "SKIPPED" | "MISSED"
  count: number
  date: string
  notes: string | null
}

export interface Habit {
  id: string
  workspaceId: string
  title: string
  description: string | null
  frequency: "DAILY" | "WEEKLY" | "MONTHLY" | "CUSTOM"
  customDays: string | null // comma-separated e.g. "1,3,5"
  targetCount: number
  isNegative: boolean
  status: "ACTIVE" | "ARCHIVED" | "PAUSED"
  color: string
  icon: string
  currentStreak: number
  longestStreak: number
  projectId: string | null
  taskId: string | null
  history: HabitHistory[]
}

export interface Stats {
  goals: {
    total: number
    completed: number
    active: number
    averageProgress: number
    byCategory: Record<string, number>
    byPriority: Record<string, number>
  }
  habits: {
    total: number
    active: number
    averageStreak: number
    bestStreak: number
    consistencyScore: number
    completionsByDay: { day: string; completions: number }[]
  }
}

// --- Goals Hooks ---

export function useGetGoalsQuery(filters?: {
  status?: string
  category?: string
  priority?: string
  search?: string
}) {
  const queryParams = new URLSearchParams({ workspaceId: WORKSPACE_ID })
  if (filters?.status) queryParams.append("status", filters.status)
  if (filters?.category) queryParams.append("category", filters.category)
  if (filters?.priority) queryParams.append("priority", filters.priority)
  if (filters?.search) queryParams.append("search", filters.search)

  return useQuery<Goal[]>({
    queryKey: ["goals", filters],
    queryFn: async () => {
      const res = await fetch(`/api/goals?${queryParams.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch goals")
      return res.json()
    },
  })
}

export function useCreateGoalMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Goal> & { milestones?: { title: string; dueDate?: string }[] }) => {
      const res = await fetch("/api/goals", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, workspaceId: WORKSPACE_ID }),
      })
      if (!res.ok) throw new Error("Failed to create goal")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "goals"] })
      queryClient.invalidateQueries({ queryKey: ["goals-stats"] })
      toast.success("Goal created successfully")
    },
  })
}

export function useUpdateGoalMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Goal> & { id: string }) => {
      const res = await fetch(`/api/goals/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update goal")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "goals"] })
      queryClient.invalidateQueries({ queryKey: ["goals-stats"] })
      toast.success("Goal updated")
    },
  })
}

export function useDeleteGoalMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/goals/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete goal")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "goals"] })
      queryClient.invalidateQueries({ queryKey: ["goals-stats"] })
      toast.success("Goal deleted")
    },
  })
}

// --- Milestones Hooks ---

export function useCreateMilestoneMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ goalId, title, dueDate }: { goalId: string; title: string; dueDate?: string }) => {
      const res = await fetch(`/api/goals/${goalId}/milestones`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, dueDate }),
      })
      if (!res.ok) throw new Error("Failed to create milestone")
      return res.json()
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["goals-stats"] })
      toast.success("Milestone added")
    },
  })
}

export function useUpdateMilestoneMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      goalId,
      milestoneId,
      ...data
    }: {
      goalId: string
      milestoneId: string
      title?: string
      isCompleted?: boolean
      dueDate?: string | null
      delete?: boolean
    }) => {
      const res = await fetch(`/api/goals/${goalId}/milestones`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ milestoneId, ...data }),
      })
      if (!res.ok) throw new Error("Failed to update milestone")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["goals"] })
      queryClient.invalidateQueries({ queryKey: ["goals-stats"] })
    },
  })
}

// --- Habits Hooks ---

export function useGetHabitsQuery(status?: string) {
  const queryParams = new URLSearchParams({ workspaceId: WORKSPACE_ID })
  if (status) queryParams.append("status", status)

  return useQuery<Habit[]>({
    queryKey: ["habits", status],
    queryFn: async () => {
      const res = await fetch(`/api/habits?${queryParams.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch habits")
      return res.json()
    },
  })
}

export function useCreateHabitMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: Partial<Habit>) => {
      const res = await fetch("/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, workspaceId: WORKSPACE_ID }),
      })
      if (!res.ok) throw new Error("Failed to create habit")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "habits"] })
      queryClient.invalidateQueries({ queryKey: ["goals-stats"] })
      toast.success("Habit created successfully")
    },
  })
}

export function useUpdateHabitMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, ...data }: Partial<Habit> & { id: string }) => {
      const res = await fetch(`/api/habits/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      })
      if (!res.ok) throw new Error("Failed to update habit")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "habits"] })
      queryClient.invalidateQueries({ queryKey: ["goals-stats"] })
      toast.success("Habit updated")
    },
  })
}

export function useDeleteHabitMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/habits/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete habit")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "habits"] })
      queryClient.invalidateQueries({ queryKey: ["goals-stats"] })
      toast.success("Habit deleted")
    },
  })
}

export function useLogHabitMutation() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({
      habitId,
      date,
      status,
      count,
      notes,
    }: {
      habitId: string
      date: string
      status: "COMPLETED" | "SKIPPED" | "MISSED" | "DELETE"
      count?: number
      notes?: string
    }) => {
      const res = await fetch(`/api/habits/${habitId}/history`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ date, status, count, notes }),
      })
      if (!res.ok) throw new Error("Failed to log habit")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["habits"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "overview"] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "habits"] })
      queryClient.invalidateQueries({ queryKey: ["goals-stats"] })
    },
  })
}

// --- Stats Hook ---

export function useGetStatsQuery() {
  return useQuery<Stats>({
    queryKey: ["goals-stats"],
    queryFn: async () => {
      const res = await fetch(`/api/goals/stats?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch statistics")
      return res.json()
    },
  })
}

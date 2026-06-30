import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { ProjectInput, ProjectUpdateInput } from "@/lib/validations/project"

// Using a hardcoded workspace for now as per dashboard spec, but this should come from auth
const WORKSPACE_ID = "cm0q9z8x0000008l4f1h7a3n2"

export function useProjects() {
  return useQuery({
    queryKey: ["projects", WORKSPACE_ID],
    queryFn: async () => {
      const res = await fetch(`/api/projects?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch projects")
      return res.json()
    }
  })
}

export function useProject(id: string) {
  return useQuery({
    queryKey: ["project", id],
    queryFn: async () => {
      const res = await fetch(`/api/projects/${id}`)
      if (!res.ok) throw new Error("Failed to fetch project")
      return res.json()
    }
  })
}

export function useCreateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: ProjectInput) => {
      const res = await fetch(`/api/projects?workspaceId=${WORKSPACE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to create project")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", WORKSPACE_ID] })
    }
  })
}

export function useUpdateProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string, data: ProjectUpdateInput }) => {
      const res = await fetch(`/api/projects/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to update project")
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["project", data.id] })
    }
  })
}

export function useDeleteProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/projects/${id}`, { method: "DELETE" })
      if (!res.ok) throw new Error("Failed to delete project")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["projects", WORKSPACE_ID] })
    }
  })
}

export function useArchiveProject() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, isArchived }: { id: string, isArchived: boolean }) => {
      const res = await fetch(`/api/projects/${id}/archive`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isArchived })
      })
      if (!res.ok) throw new Error("Failed to archive project")
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["projects", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["project", data.id] })
    }
  })
}

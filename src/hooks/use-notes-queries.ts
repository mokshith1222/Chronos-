import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"

const WORKSPACE_ID = "cm0q9z8x0000008l4f1h7a3n2"

export function useNotes(filters?: { folderId?: string | null; search?: string; isFavorite?: boolean; isArchived?: boolean; isTrash?: boolean }) {
  return useQuery({
    queryKey: ["notes", WORKSPACE_ID, filters],
    queryFn: async () => {
      const params = new URLSearchParams({ workspaceId: WORKSPACE_ID })
      if (filters?.folderId) params.append("folderId", filters.folderId)
      if (filters?.search) params.append("search", filters.search)
      if (filters?.isFavorite) params.append("isFavorite", "true")
      if (filters?.isArchived) params.append("isArchived", "true")
      if (filters?.isTrash) params.append("isTrash", "true")

      const res = await fetch(`/api/notes?${params.toString()}`)
      if (!res.ok) throw new Error("Failed to fetch notes")
      return res.json()
    }
  })
}

export function useNote(id: string | null) {
  return useQuery({
    queryKey: ["note", id],
    queryFn: async () => {
      if (!id) return null
      const res = await fetch(`/api/notes/${id}`)
      if (!res.ok) throw new Error("Failed to fetch note")
      return res.json()
    },
    enabled: !!id,
  })
}

export function useFolders() {
  return useQuery({
    queryKey: ["folders", WORKSPACE_ID],
    queryFn: async () => {
      const res = await fetch(`/api/notes/folders?workspaceId=${WORKSPACE_ID}`)
      if (!res.ok) throw new Error("Failed to fetch folders")
      return res.json()
    }
  })
}

export function useCreateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { title?: string; content?: string; folderId?: string | null; isPinned?: boolean; isFavorite?: boolean; isArchived?: boolean; isTrash?: boolean }) => {
      const res = await fetch(`/api/notes?workspaceId=${WORKSPACE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to create note")
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["folders", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "notes", WORKSPACE_ID] })
    }
  })
}

export function useUpdateNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async ({ id, data }: { id: string; data: { title?: string; content?: string; folderId?: string | null; isPinned?: boolean; isFavorite?: boolean; isArchived?: boolean; isTrash?: boolean } }) => {
      const res = await fetch(`/api/notes/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to update note")
      return res.json()
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ["notes", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["note", data.id] })
      queryClient.invalidateQueries({ queryKey: ["folders", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "notes", WORKSPACE_ID] })
    }
  })
}

export function useDeleteNote() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notes/${id}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete note")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notes", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["folders", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["dashboard", "notes", WORKSPACE_ID] })
    }
  })
}

export function useCreateFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (data: { name: string; parentId?: string | null }) => {
      const res = await fetch(`/api/notes/folders?workspaceId=${WORKSPACE_ID}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to create folder")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders", WORKSPACE_ID] })
    }
  })
}

export function useDeleteFolder() {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (id: string) => {
      const res = await fetch(`/api/notes/folders?id=${id}`, {
        method: "DELETE"
      })
      if (!res.ok) throw new Error("Failed to delete folder")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["folders", WORKSPACE_ID] })
      queryClient.invalidateQueries({ queryKey: ["notes", WORKSPACE_ID] })
    }
  })
}

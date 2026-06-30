import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import { useWorkspaceStore } from "@/stores/workspace-store"

interface UserProfile {
  id: string
  name: string | null
  email: string
}

export function useUser() {
  const userId = useWorkspaceStore((state) => state.userId)

  return useQuery<UserProfile>({
    queryKey: ["user", userId],
    queryFn: async () => {
      const url = userId ? `/api/user?userId=${userId}` : "/api/user"
      const res = await fetch(url)
      if (!res.ok) throw new Error("Failed to fetch user profile")
      return res.json()
    },
    enabled: !!userId,
  })
}

export function useUpdateUser() {
  const queryClient = useQueryClient()
  const userId = useWorkspaceStore((state) => state.userId)

  return useMutation({
    mutationFn: async (data: { name?: string; email?: string }) => {
      const url = userId ? `/api/user?userId=${userId}` : "/api/user"
      const res = await fetch(url, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data)
      })
      if (!res.ok) throw new Error("Failed to update user profile")
      return res.json()
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["user", userId] })
    }
  })
}

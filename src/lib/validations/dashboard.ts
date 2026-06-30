import * as z from "zod"

export const dashboardOverviewSchema = z.object({
  workspaceId: z.string().cuid(),
  dateRange: z.object({
    from: z.string().datetime(),
    to: z.string().datetime(),
  }).optional(),
})

export type DashboardOverviewInput = z.infer<typeof dashboardOverviewSchema>

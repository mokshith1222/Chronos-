import * as z from "zod"

export const taskSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().nullable(),
  status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "DONE", "CANCELED"]).default("TODO"),
  priority: z.enum(["NO_PRIORITY", "LOW", "MEDIUM", "HIGH", "URGENT"]).default("NO_PRIORITY"),
  dueDate: z.string().datetime().optional().nullable(),
  projectId: z.string().optional().nullable(),
  estimatedTime: z.number().int().nonnegative().optional().nullable(), // in minutes
  actualTime: z.number().int().nonnegative().optional().nullable(), // in minutes
})

export const taskUpdateSchema = taskSchema.partial().extend({
  position: z.number().optional(),
  isFavorite: z.boolean().optional(),
})

export const taskReorderSchema = z.object({
  taskIds: z.array(z.string()),
  status: z.enum(["BACKLOG", "TODO", "IN_PROGRESS", "DONE", "CANCELED"]).optional(),
})

export type TaskInput = z.infer<typeof taskSchema>
export type TaskUpdateInput = z.infer<typeof taskUpdateSchema>
export type TaskReorderInput = z.infer<typeof taskReorderSchema>

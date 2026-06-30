import * as z from "zod"

export const projectSchema = z.object({
  name: z.string().min(1, "Project name is required").max(100),
  color: z.string().regex(/^hsl\(\d+ \d+% \d+%\)$|^#[0-9A-Fa-f]{6}$/, "Must be a valid HSL or HEX color").optional().nullable(),
  status: z.enum(["ACTIVE", "COMPLETED", "ON_HOLD", "CANCELLED"]).default("ACTIVE"),
})

export const projectUpdateSchema = projectSchema.partial()

export type ProjectInput = z.infer<typeof projectSchema>
export type ProjectUpdateInput = z.infer<typeof projectUpdateSchema>

import * as z from "zod"

export const calendarEventSchema = z.object({
  title: z.string().min(1, "Title is required").max(200),
  description: z.string().optional().nullable(),
  startTime: z.string().datetime("Invalid start time format"),
  endTime: z.string().datetime("Invalid end time format"),
  location: z.string().optional().nullable(),
  color: z.string().regex(/^hsl\(\d+ \d+% \d+%\)$|^#[0-9A-Fa-f]{6}$/, "Must be a valid HSL or HEX color").optional().nullable(),
  isAllDay: z.boolean().default(false),
  type: z.enum(["EVENT", "TIME_BLOCK"]).default("EVENT"),
})

export const calendarEventUpdateSchema = calendarEventSchema.partial()

export type CalendarEventInput = z.infer<typeof calendarEventSchema>
export type CalendarEventUpdateInput = z.infer<typeof calendarEventUpdateSchema>

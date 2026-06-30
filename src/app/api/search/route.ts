import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId")
    const query = searchParams.get("q") || ""
    const type = searchParams.get("type") // e.g., "tasks", "notes"

    if (!workspaceId) {
      return NextResponse.json({ error: "workspaceId is required" }, { status: 400 })
    }

    if (!query.trim()) {
      return NextResponse.json({
        projects: [],
        tasks: [],
        notes: [],
        goals: [],
        habits: [],
        calendarEvents: [],
      })
    }

    const searchCondition = { contains: query, mode: "insensitive" as const }

    // Run queries in parallel
    const [projects, tasks, notes, goals, habits, calendarEvents] = await Promise.all([
      // 1. Projects
      (!type || type === "projects")
        ? db.project.findMany({
            where: { workspaceId, name: searchCondition, isArchived: false, deletedAt: null },
            take: 5,
          })
        : Promise.resolve([]),
      // 2. Tasks
      (!type || type === "tasks")
        ? db.task.findMany({
            where: { workspaceId, title: searchCondition, isArchived: false, deletedAt: null },
            include: { project: { select: { id: true, name: true, color: true } } },
            take: 5,
          })
        : Promise.resolve([]),
      // 3. Notes
      (!type || type === "notes")
        ? db.note.findMany({
            where: { workspaceId, title: searchCondition, isArchived: false, isTrash: false },
            take: 5,
          })
        : Promise.resolve([]),
      // 4. Goals
      (!type || type === "goals")
        ? db.goal.findMany({
            where: { workspaceId, title: searchCondition, status: "ACTIVE" },
            take: 5,
          })
        : Promise.resolve([]),
      // 5. Habits
      (!type || type === "habits")
        ? db.habit.findMany({
            where: { workspaceId, title: searchCondition, status: "ACTIVE" },
            take: 5,
          })
        : Promise.resolve([]),
      // 6. Calendar Events
      (!type || type === "calendarEvents")
        ? db.calendarEvent.findMany({
            where: { workspaceId, title: searchCondition },
            take: 5,
          })
        : Promise.resolve([]),
    ])

    return NextResponse.json({
      projects,
      tasks,
      notes,
      goals,
      habits,
      calendarEvents,
    })
  } catch (error) {
    console.error("[GLOBAL_SEARCH_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

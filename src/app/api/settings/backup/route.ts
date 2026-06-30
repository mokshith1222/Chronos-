import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"

const WORKSPACE_ID = "cm0q9z8x0000008l4f1h7a3n2"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const workspaceId = searchParams.get("workspaceId") || WORKSPACE_ID

    // Fetch all workspace data in parallel
    const [
      projects,
      tasks,
      timeEntries,
      goals,
      habits,
      notes,
      calendarEvents,
    ] = await Promise.all([
      db.project.findMany({ where: { workspaceId } }),
      db.task.findMany({ where: { workspaceId } }),
      db.timeEntry.findMany({ where: { workspaceId } }),
      db.goal.findMany({ where: { workspaceId }, include: { milestones: true } }),
      db.habit.findMany({ where: { workspaceId }, include: { history: true } }),
      db.note.findMany({ where: { workspaceId } }),
      db.calendarEvent.findMany({ where: { workspaceId } }),
    ])

    const backup = {
      version: "1.0",
      exportedAt: new Date().toISOString(),
      workspaceId,
      data: {
        projects,
        tasks,
        timeEntries,
        goals,
        habits,
        notes,
        calendarEvents,
      },
    }

    return NextResponse.json(backup)
  } catch (error) {
    console.error("[BACKUP_EXPORT_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { data, workspaceId = WORKSPACE_ID } = body

    if (!data) {
      return NextResponse.json({ error: "Invalid backup data" }, { status: 400 })
    }

    // Execute restore inside a transaction to prevent partial updates on failure
    await db.$transaction(async (tx) => {
      // 1. Clear existing workspace data
      await tx.timeEntry.deleteMany({ where: { workspaceId } })
      
      await tx.taskDependency.deleteMany({
        where: {
          OR: [
            { task: { workspaceId } },
            { dependsOnTask: { workspaceId } }
          ]
        },
      })
      
      await tx.checklistItem.deleteMany({
        where: {
          task: { workspaceId },
        },
      })
      
      // Nullify parentTaskIds to avoid self-referencing foreign key violations
      await tx.task.updateMany({
        where: { workspaceId },
        data: { parentTaskId: null }
      })
      
      await tx.task.deleteMany({ where: { workspaceId } })
      await tx.project.deleteMany({ where: { workspaceId } })
      
      await tx.goalMilestone.deleteMany({
        where: {
          goal: { workspaceId },
        },
      })
      
      await tx.goal.deleteMany({ where: { workspaceId } })
      
      await tx.habitHistory.deleteMany({
        where: {
          habit: { workspaceId },
        },
      })
      
      await tx.habit.deleteMany({ where: { workspaceId } })
      await tx.note.deleteMany({ where: { workspaceId } })
      
      // Nullify folder parentIds and delete folders
      await tx.folder.updateMany({
        where: { workspaceId },
        data: { parentId: null }
      })
      await tx.folder.deleteMany({ where: { workspaceId } })
      
      await tx.calendarEvent.deleteMany({ where: { workspaceId } })

      // 2. Restore Projects
      if (data.projects && data.projects.length > 0) {
        await tx.project.createMany({
          data: data.projects.map((p: any) => ({
            id: p.id,
            workspaceId,
            name: p.name,
            color: p.color,
            status: p.status,
            createdAt: new Date(p.createdAt),
            updatedAt: new Date(p.updatedAt),
            isArchived: p.isArchived,
            deletedAt: p.deletedAt ? new Date(p.deletedAt) : null,
          })),
        })
      }

      // 3. Restore Tasks
      if (data.tasks && data.tasks.length > 0) {
        await tx.task.createMany({
          data: data.tasks.map((t: any) => ({
            id: t.id,
            workspaceId,
            projectId: t.projectId,
            parentTaskId: t.parentTaskId,
            title: t.title,
            description: t.description,
            status: t.status,
            priority: t.priority,
            position: t.position,
            dueDate: t.dueDate ? new Date(t.dueDate) : null,
            completedAt: t.completedAt ? new Date(t.completedAt) : null,
            estimatedTime: t.estimatedTime,
            actualTime: t.actualTime,
            recurrenceRule: t.recurrenceRule,
            isFavorite: t.isFavorite,
            createdAt: new Date(t.createdAt),
            updatedAt: new Date(t.updatedAt),
            isArchived: t.isArchived,
            deletedAt: t.deletedAt ? new Date(t.deletedAt) : null,
          })),
        })
      }

      // 4. Restore Time Entries
      if (data.timeEntries && data.timeEntries.length > 0) {
        await tx.timeEntry.createMany({
          data: data.timeEntries.map((te: any) => ({
            id: te.id,
            workspaceId,
            projectId: te.projectId,
            taskId: te.taskId,
            description: te.description,
            startTime: new Date(te.startTime),
            endTime: te.endTime ? new Date(te.endTime) : null,
            duration: te.duration,
            isProductive: te.isProductive,
            type: te.type,
            mood: te.mood,
            energyLevel: te.energyLevel,
            productivityRating: te.productivityRating,
            notes: te.notes,
            tags: te.tags,
            createdAt: new Date(te.createdAt),
            updatedAt: new Date(te.updatedAt),
          })),
        })
      }

      // 5. Restore Goals & Milestones
      if (data.goals && data.goals.length > 0) {
        for (const g of data.goals) {
          await tx.goal.create({
            data: {
              id: g.id,
              workspaceId,
              title: g.title,
              description: g.description,
              category: g.category || "PERSONAL",
              priority: g.priority || "MEDIUM",
              status: g.status,
              targetDate: g.targetDate ? new Date(g.targetDate) : null,
              progress: g.progress,
              currentValue: g.currentValue || 0,
              targetValue: g.targetValue,
              units: g.units,
              color: g.color || "#3b82f6",
              icon: g.icon || "Target",
              tags: g.tags,
              notes: g.notes,
              projectId: g.projectId,
              taskId: g.taskId,
              createdAt: new Date(g.createdAt),
              updatedAt: new Date(g.updatedAt),
              milestones: g.milestones && g.milestones.length > 0 ? {
                create: g.milestones.map((m: any) => ({
                  id: m.id,
                  title: m.title,
                  status: m.status,
                  dueDate: m.dueDate ? new Date(m.dueDate) : null,
                  isCompleted: m.isCompleted,
                  position: m.position,
                  createdAt: new Date(m.createdAt),
                  updatedAt: new Date(m.updatedAt),
                })),
              } : undefined,
            },
          })
        }
      }

      // 6. Restore Habits & History
      if (data.habits && data.habits.length > 0) {
        for (const h of data.habits) {
          await tx.habit.create({
            data: {
              id: h.id,
              workspaceId,
              title: h.title,
              description: h.description,
              frequency: h.frequency,
              customDays: h.customDays,
              targetCount: h.targetCount,
              isNegative: h.isNegative,
              status: h.status,
              color: h.color,
              icon: h.icon,
              currentStreak: h.currentStreak,
              longestStreak: h.longestStreak,
              projectId: h.projectId,
              taskId: h.taskId,
              createdAt: new Date(h.createdAt),
              updatedAt: new Date(h.updatedAt),
              history: h.history && h.history.length > 0 ? {
                create: h.history.map((hist: any) => ({
                  id: hist.id,
                  status: hist.status,
                  count: hist.count,
                  date: new Date(hist.date),
                  notes: hist.notes,
                  createdAt: new Date(hist.createdAt),
                })),
              } : undefined,
            },
          })
        }
      }

      // 7. Restore Notes
      if (data.notes && data.notes.length > 0) {
        await tx.note.createMany({
          data: data.notes.map((n: any) => ({
            id: n.id,
            workspaceId,
            folderId: n.folderId,
            title: n.title,
            content: n.content,
            isPinned: n.isPinned,
            isFavorite: n.isFavorite,
            isArchived: n.isArchived,
            isTrash: n.isTrash,
            createdAt: new Date(n.createdAt),
            updatedAt: new Date(n.updatedAt),
          })),
        })
      }

      // 8. Restore Calendar Events
      if (data.calendarEvents && data.calendarEvents.length > 0) {
        await tx.calendarEvent.createMany({
          data: data.calendarEvents.map((ce: any) => ({
            id: ce.id,
            workspaceId,
            title: ce.title,
            description: ce.description,
            startTime: new Date(ce.startTime),
            endTime: new Date(ce.endTime),
            location: ce.location,
            color: ce.color,
            isAllDay: ce.isAllDay,
            type: ce.type,
            createdAt: new Date(ce.createdAt),
            updatedAt: new Date(ce.updatedAt),
          })),
        })
      }
    }, {
      timeout: 20000 // 20 seconds
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("[BACKUP_RESTORE_POST]", error)
    return NextResponse.json({ error: "Failed to restore backup" }, { status: 500 })
  }
}

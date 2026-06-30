import { NextRequest, NextResponse } from "next/server"
import { db } from "@/lib/db"
import { startOfDay, subDays } from "date-fns"

interface RouteContext {
  params: Promise<{ id: string }>
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    
    const [project, completedTasksCount, totalDurationSum, timeEntries] = await Promise.all([
      db.project.findUnique({
        where: { id },
        include: {
          _count: {
            select: { tasks: true, timeEntries: true }
          }
        }
      }),
      db.task.count({
        where: { projectId: id, status: "DONE" }
      }),
      db.timeEntry.aggregate({
        where: { projectId: id },
        _sum: { duration: true }
      }),
      db.timeEntry.findMany({
        where: {
          projectId: id,
          startTime: {
            gte: subDays(startOfDay(new Date()), 6)
          }
        }
      })
    ])

    if (!project) {
      return NextResponse.json({ error: "Project not found" }, { status: 404 })
    }

    // Calculate Weekly Time Distribution
    const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"]
    const weeklyMap: Record<string, number> = {}

    // Initialize map for the last 7 days with 0 hours
    for (let i = 0; i < 7; i++) {
      const date = subDays(new Date(), i)
      const dayName = daysOfWeek[date.getDay()]
      weeklyMap[dayName] = 0
    }

    timeEntries.forEach((entry) => {
      const dayName = daysOfWeek[new Date(entry.startTime).getDay()]
      if (weeklyMap[dayName] !== undefined) {
        const durationHours = (entry.duration || 0) / 3600
        weeklyMap[dayName] += durationHours
      }
    })

    // Convert map to ordered array from 7 days ago to today
    const timeDistribution = []
    for (let i = 6; i >= 0; i--) {
      const date = subDays(new Date(), i)
      const dayName = daysOfWeek[date.getDay()]
      timeDistribution.push({
        name: dayName,
        hours: Number(weeklyMap[dayName].toFixed(1)),
      })
    }

    const totalHours = Number(((totalDurationSum._sum.duration || 0) / 3600).toFixed(1))

    const stats = {
      totalTasks: project._count.tasks,
      completedTasks: completedTasksCount,
      totalTimeEntries: project._count.timeEntries,
      totalNotes: 0, // Notes do not have a projectId in the Prisma schema
      totalHours,
      timeDistribution,
    }

    return NextResponse.json(stats)
  } catch (error) {
    console.error("[PROJECT_STATISTICS_GET]", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}

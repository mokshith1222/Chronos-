import { db } from "@/lib/db"

export class IntegrationService {
  /**
   * Handles task completion side effects:
   * 1. Updates task status and completedAt.
   * 2. Recalculates associated Goal progress.
   * 3. Stops any active timers running for this task.
   */
  static async handleTaskCompletion(taskId: string, status: string) {
    const isCompleted = status === "DONE"
    const completedAt = isCompleted ? new Date() : null

    return await db.$transaction(async (tx) => {
      // 1. Update the task
      const task = await tx.task.update({
        where: { id: taskId },
        data: {
          status,
          completedAt,
        },
      })

      // 2. Handle Goal Progress Recalculation if linked
      const linkedGoals = await tx.goal.findMany({
        where: { taskId },
      })

      for (const goal of linkedGoals) {
        await tx.goal.update({
          where: { id: goal.id },
          data: {
            progress: isCompleted ? 100 : 0,
            status: isCompleted ? "COMPLETED" : "ACTIVE",
            currentValue: isCompleted ? (goal.targetValue || 1) : 0,
          },
        })
      }

      // 3. Stop active timer if running for this task
      const activeTimer = await tx.timeEntry.findFirst({
        where: {
          taskId,
          endTime: null,
        },
      })

      if (activeTimer) {
        const endTime = new Date()
        const duration = Math.max(0, Math.floor((endTime.getTime() - new Date(activeTimer.startTime).getTime()) / 1000))
        
        await tx.timeEntry.update({
          where: { id: activeTimer.id },
          data: {
            endTime,
            duration,
          },
        })

        // Recalculate task actual time immediately
        const allCompletedTimers = await tx.timeEntry.findMany({
          where: {
            taskId,
            endTime: { not: null },
          },
        })
        const totalDuration = allCompletedTimers.reduce((acc, curr) => acc + (curr.duration || 0), 0) + duration

        await tx.task.update({
          where: { id: taskId },
          data: {
            actualTime: Math.round(totalDuration / 60),
          },
        })
      }

      return task
    })
  }

  /**
   * Handles time entry stopping side effects:
   * 1. Recalculates and updates the actualTime on the associated Task.
   */
  static async handleTimeEntryStop(timeEntryId: string) {
    return await db.$transaction(async (tx) => {
      const timeEntry = await tx.timeEntry.findUnique({
        where: { id: timeEntryId },
      })

      if (!timeEntry || !timeEntry.taskId) return timeEntry

      // Get all completed time entries for the task
      const allCompletedTimers = await tx.timeEntry.findMany({
        where: {
          taskId: timeEntry.taskId,
          endTime: { not: null },
        },
      })

      const totalDuration = allCompletedTimers.reduce((acc, curr) => acc + (curr.duration || 0), 0)

      await tx.task.update({
        where: { id: timeEntry.taskId },
        data: {
          actualTime: Math.round(totalDuration / 60),
        },
      })

      return timeEntry
    })
  }

  /**
   * Handles goal milestone completion side-effects:
   * 1. Updates milestone status.
   * 2. Recalculates associated Goal progress.
   */
  static async handleMilestoneToggle(milestoneId: string, isCompleted: boolean) {
    return await db.$transaction(async (tx) => {
      const milestone = await tx.goalMilestone.update({
        where: { id: milestoneId },
        data: {
          isCompleted,
          status: isCompleted ? "COMPLETED" : "PENDING",
        },
      })

      // Recalculate Goal Progress
      const allMilestones = await tx.goalMilestone.findMany({
        where: { goalId: milestone.goalId },
      })
      const completedMilestones = allMilestones.filter((m) => m.isCompleted).length
      const totalMilestones = allMilestones.length

      const progress = totalMilestones > 0
        ? Math.round((completedMilestones / totalMilestones) * 100)
        : 0

      await tx.goal.update({
        where: { id: milestone.goalId },
        data: {
          progress,
        },
      })

      return milestone
    })
  }
}

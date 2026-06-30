"use client"

import { useState } from "react"
import { useTasksStore } from "@/stores/tasks-store"
import { TasksToolbar } from "@/features/tasks/components/tasks-toolbar"
import { TasksList } from "@/features/tasks/components/tasks-list"
import { TasksKanban } from "@/features/tasks/components/tasks-kanban"
import { CreateTaskModal } from "@/features/tasks/components/create-task-modal"
import { TaskDetailsSheet } from "@/features/tasks/components/task-details-sheet"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export default function TasksPage() {
  const { viewMode } = useTasksStore()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [createInitialStatus, setCreateInitialStatus] = useState<string>("TODO")

  const handleNewTask = () => {
    setCreateInitialStatus("TODO")
    setIsCreateOpen(true)
  }

  const handleNewTaskWithStatus = (status: string) => {
    setCreateInitialStatus(status)
    setIsCreateOpen(true)
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold tracking-tight">Tasks</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Manage, prioritize, and track your daily work items.
          </p>
        </div>

        <main className="flex-1 w-full mx-auto">
          <TasksToolbar onNewTask={handleNewTask} />

          {viewMode === "list" ? (
            <TasksList />
          ) : (
            <TasksKanban onNewTaskWithStatus={handleNewTaskWithStatus} />
          )}
        </main>
      </div>

      {/* Slide out Task Details Drawer */}
      <TaskDetailsSheet />

      {/* Create Task Modal */}
      <CreateTaskModal 
        open={isCreateOpen} 
        onOpenChange={setIsCreateOpen} 
        initialStatus={createInitialStatus} 
      />
    </DashboardLayout>
  )
}

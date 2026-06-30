"use client"

import { useDeleteTask } from "@/hooks/use-tasks-queries"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Loader2, AlertTriangle } from "lucide-react"

interface DeleteTaskModalProps {
  taskId: string | null
  taskTitle: string | null
  open: boolean
  onOpenChange: (open: boolean) => void
  onSuccess?: () => void
}

export function DeleteTaskModal({ taskId, taskTitle, open, onOpenChange, onSuccess }: DeleteTaskModalProps) {
  const deleteTask = useDeleteTask()
  
  const onDelete = () => {
    if (!taskId) return
    deleteTask.mutate(taskId, {
      onSuccess: () => {
        onOpenChange(false)
        if (onSuccess) onSuccess()
      }
    })
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Delete Task</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to permanently delete <strong className="text-foreground">{taskTitle || "this task"}</strong>? 
            This will also delete all checklists and subtasks associated with it. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={deleteTask.isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete} disabled={deleteTask.isPending}>
            {deleteTask.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Permanently Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

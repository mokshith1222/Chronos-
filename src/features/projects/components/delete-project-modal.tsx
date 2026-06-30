"use client"

import { useDeleteProject } from "@/hooks/use-projects-queries"
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

interface DeleteProjectModalProps {
  project: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function DeleteProjectModal({ project, open, onOpenChange }: DeleteProjectModalProps) {
  const deleteProject = useDeleteProject()
  
  const onDelete = () => {
    if (!project) return
    deleteProject.mutate(project.id, {
      onSuccess: () => {
        onOpenChange(false)
      }
    })
  }

  if (!project) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-4 mb-2">
            <div className="w-10 h-10 rounded-full bg-destructive/10 flex items-center justify-center shrink-0">
              <AlertTriangle className="h-5 w-5 text-destructive" />
            </div>
            <DialogTitle>Delete Project</DialogTitle>
          </div>
          <DialogDescription>
            Are you sure you want to permanently delete <strong className="text-foreground">{project.name}</strong>? 
            This will also delete all associated tasks, time entries, and notes. This action cannot be undone.
          </DialogDescription>
        </DialogHeader>
        
        <DialogFooter className="mt-4">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={deleteProject.isPending}>
            Cancel
          </Button>
          <Button type="button" variant="destructive" onClick={onDelete} disabled={deleteProject.isPending}>
            {deleteProject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Permanently Delete
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

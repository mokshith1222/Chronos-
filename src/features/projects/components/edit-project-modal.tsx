"use client"

import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { projectSchema, ProjectInput } from "@/lib/validations/project"
import { useUpdateProject } from "@/hooks/use-projects-queries"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface EditProjectModalProps {
  project: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

const PRESET_COLORS = [
  "hsl(var(--primary))",
  "#ef4444", "#f97316", "#f59e0b", "#10b981", 
  "#06b6d4", "#3b82f6", "#8b5cf6", "#d946ef", "#f43f5e"
]

export function EditProjectModal({ project, open, onOpenChange }: EditProjectModalProps) {
  const updateProject = useUpdateProject()
  
  const form = useForm<ProjectInput>({
    resolver: zodResolver(projectSchema) as any,
    defaultValues: {
      name: "",
      color: PRESET_COLORS[0],
      status: "ACTIVE"
    }
  })

  // Reset form when project changes
  useEffect(() => {
    if (project) {
      form.reset({
        name: project.name,
        color: project.color || PRESET_COLORS[0],
        status: project.status,
      })
    }
  }, [project, form])

  const onSubmit = (data: ProjectInput) => {
    if (!project) return

    updateProject.mutate({ id: project.id, data }, {
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
          <DialogTitle>Edit Project</DialogTitle>
          <DialogDescription>
            Make changes to your project settings.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-6 pt-4">
          <div className="space-y-2">
            <Label htmlFor="edit-name">Project Name</Label>
            <Input
              id="edit-name"
              placeholder="e.g. Website Redesign"
              {...form.register("name")}
              disabled={updateProject.isPending}
            />
            {form.formState.errors.name && (
              <p className="text-xs text-destructive">{form.formState.errors.name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Project Color</Label>
            <div className="flex flex-wrap gap-2">
              {PRESET_COLORS.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`w-8 h-8 rounded-full border-2 transition-all ${
                    form.watch("color") === color 
                      ? "border-primary scale-110 shadow-sm" 
                      : "border-transparent hover:scale-105"
                  }`}
                  style={{ backgroundColor: color }}
                  onClick={() => form.setValue("color", color, { shouldDirty: true })}
                  disabled={updateProject.isPending}
                />
              ))}
            </div>
            {form.formState.errors.color && (
              <p className="text-xs text-destructive">{form.formState.errors.color.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label>Status</Label>
            <Select 
              disabled={updateProject.isPending} 
              value={form.watch("status")} 
              onValueChange={(val: any) => form.setValue("status", val, { shouldDirty: true })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select a status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ACTIVE">Active</SelectItem>
                <SelectItem value="ON_HOLD">On Hold</SelectItem>
                <SelectItem value="COMPLETED">Completed</SelectItem>
                <SelectItem value="CANCELLED">Cancelled</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={updateProject.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={updateProject.isPending || !form.formState.isDirty}>
              {updateProject.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Changes
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

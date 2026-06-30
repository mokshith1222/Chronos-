"use client"

import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { taskSchema, TaskInput } from "@/lib/validations/task"
import { useCreateTask } from "@/hooks/use-tasks-queries"
import { useProjects } from "@/hooks/use-projects-queries"
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
import { Textarea } from "@/components/ui/textarea"
import { Loader2, Calendar as CalendarIcon } from "lucide-react"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"

import { useTasksStore } from "@/stores/tasks-store"
import { useEffect } from "react"

interface CreateTaskModalProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  initialStatus?: string
}

export function CreateTaskModal({ open, onOpenChange, initialStatus = "TODO" }: CreateTaskModalProps) {
  const createTask = useCreateTask()
  const { data: projects } = useProjects()
  const { projectFilter } = useTasksStore()
  
  const form = useForm<TaskInput>({
    resolver: zodResolver(taskSchema) as any,
    defaultValues: {
      title: "",
      description: "",
      status: initialStatus as any,
      priority: "NO_PRIORITY",
      projectId: null,
      estimatedTime: null,
      dueDate: null,
    }
  })

  // Auto-populate active project filter & reset form on open
  useEffect(() => {
    if (open) {
      form.reset({
        title: "",
        description: "",
        status: initialStatus as any,
        priority: "NO_PRIORITY",
        projectId: projectFilter || null,
        estimatedTime: null,
        dueDate: null,
      })
    }
  }, [open, initialStatus, projectFilter, form])

  const onSubmit = (data: TaskInput) => {
    createTask.mutate(data, {
      onSuccess: () => {
        form.reset()
        onOpenChange(false)
      }
    })
  }

  const selectedDate = form.watch("dueDate")

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Create Task</DialogTitle>
          <DialogDescription>
            Add a new task to your workspace.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={form.handleSubmit(onSubmit as any)} className="space-y-4 pt-2">
          <div className="space-y-1">
            <Label htmlFor="title">Task Title</Label>
            <Input
              id="title"
              placeholder="e.g. Design landing page"
              {...form.register("title")}
              disabled={createTask.isPending}
            />
            {form.formState.errors.title && (
              <p className="text-xs text-destructive">{form.formState.errors.title.message}</p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              placeholder="Add details about this task..."
              rows={3}
              {...form.register("description")}
              disabled={createTask.isPending}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Status</Label>
              <Select 
                disabled={createTask.isPending} 
                value={form.watch("status")} 
                onValueChange={(val: any) => form.setValue("status", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="BACKLOG">Backlog</SelectItem>
                  <SelectItem value="TODO">Todo</SelectItem>
                  <SelectItem value="IN_PROGRESS">In Progress</SelectItem>
                  <SelectItem value="DONE">Done</SelectItem>
                  <SelectItem value="CANCELED">Canceled</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1">
              <Label>Priority</Label>
              <Select 
                disabled={createTask.isPending} 
                value={form.watch("priority")} 
                onValueChange={(val: any) => form.setValue("priority", val)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="NO_PRIORITY">No Priority</SelectItem>
                  <SelectItem value="LOW">Low</SelectItem>
                  <SelectItem value="MEDIUM">Medium</SelectItem>
                  <SelectItem value="HIGH">High</SelectItem>
                  <SelectItem value="URGENT">Urgent</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-1">
              <Label>Project</Label>
              <Select 
                disabled={createTask.isPending} 
                value={form.watch("projectId") || "none"} 
                onValueChange={(val) => form.setValue("projectId", val === "none" ? null : val)}
              >
                <SelectTrigger>
                  <SelectValue>
                    {form.watch("projectId")
                      ? (projects?.find((p: any) => p.id === form.watch("projectId"))?.name || "No Project")
                      : "No Project"
                    }
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none" label="No Project">No Project</SelectItem>
                  {projects?.map((project: any) => (
                    <SelectItem key={project.id} value={project.id} label={project.name}>
                      {project.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-1 flex flex-col">
              <Label className="mb-1">Due Date</Label>
              <Popover>
                <PopoverTrigger
                  render={
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal h-9",
                        !selectedDate && "text-muted-foreground"
                      )}
                      disabled={createTask.isPending}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {selectedDate ? format(new Date(selectedDate), "PPP") : <span>Pick a date</span>}
                    </Button>
                  }
                />
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={selectedDate ? new Date(selectedDate) : undefined}
                    onSelect={(date) => form.setValue("dueDate", date ? date.toISOString() : null)}
                  />
                </PopoverContent>
              </Popover>
            </div>
          </div>

          <div className="space-y-1">
            <Label htmlFor="estimatedTime">Estimate (Minutes)</Label>
            <Input
              id="estimatedTime"
              type="number"
              placeholder="e.g. 60"
              disabled={createTask.isPending}
              onChange={(e) => {
                const val = e.target.value ? parseInt(e.target.value, 10) : null
                form.setValue("estimatedTime", val)
              }}
            />
          </div>

          <DialogFooter className="pt-2">
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)} disabled={createTask.isPending}>
              Cancel
            </Button>
            <Button type="submit" disabled={createTask.isPending}>
              {createTask.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Create Task
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

"use client"

import { useState, useEffect } from "react"
import { useTask, useUpdateTask, useCreateChecklistItem, useToggleChecklistItem, useDeleteChecklistItem, useCreateTask } from "@/hooks/use-tasks-queries"
import { useProjects } from "@/hooks/use-projects-queries"
import { useTasksStore } from "@/stores/tasks-store"
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Checkbox } from "@/components/ui/checkbox"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { Calendar } from "@/components/ui/calendar"
import { cn } from "@/lib/utils"
import { format } from "date-fns"
import { Calendar as CalendarIcon, Clock, Plus, Trash2, CheckSquare, ListTodo, CornerDownRight } from "lucide-react"

export function TaskDetailsSheet() {
  const { selectedTaskId, setSelectedTaskId } = useTasksStore()
  const { data: task, isLoading } = useTask(selectedTaskId)
  const { data: projects } = useProjects()
  
  const updateTask = useUpdateTask()
  const createTask = useCreateTask()
  const createChecklistItem = useCreateChecklistItem()
  const toggleChecklistItem = useToggleChecklistItem()
  const deleteChecklistItem = useDeleteChecklistItem()

  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [newChecklistTitle, setNewChecklistTitle] = useState("")
  const [newSubtaskTitle, setNewSubtaskTitle] = useState("")

  useEffect(() => {
    if (task) {
      setTitle(task.title)
      setDescription(task.description || "")
    }
  }, [task])

  if (!selectedTaskId) return null

  const handleTitleBlur = () => {
    if (task && title !== task.title && title.trim() !== "") {
      updateTask.mutate({ id: task.id, data: { title } })
    }
  }

  const handleDescriptionBlur = () => {
    if (task && description !== (task.description || "")) {
      updateTask.mutate({ id: task.id, data: { description } })
    }
  }

  const handleAddChecklistItem = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newChecklistTitle.trim() || !task) return
    createChecklistItem.mutate({ taskId: task.id, title: newChecklistTitle.trim() })
    setNewChecklistTitle("")
  }

  const handleAddSubtask = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newSubtaskTitle.trim() || !task) return
    createTask.mutate({
      title: newSubtaskTitle.trim(),
      projectId: task.projectId,
      status: task.status,
      priority: "NO_PRIORITY",
      // Custom property to bind parentTaskId
      ...({ parentTaskId: task.id } as any)
    } as any)
    setNewSubtaskTitle("")
  }

  const selectedDate = task?.dueDate ? new Date(task.dueDate) : null

  return (
    <Sheet open={!!selectedTaskId} onOpenChange={(open) => !open && setSelectedTaskId(null)}>
      <SheetContent className="w-full sm:max-w-[550px] overflow-y-auto sm:border-l border-border bg-card">
        {isLoading || !task ? (
          <div className="space-y-6 py-6 animate-pulse">
            <div className="h-8 bg-muted rounded w-3/4" />
            <div className="h-24 bg-muted rounded w-full" />
            <div className="space-y-3">
              <div className="h-6 bg-muted rounded w-1/2" />
              <div className="h-6 bg-muted rounded w-1/2" />
            </div>
          </div>
        ) : (
          <div className="space-y-6 py-4">
            <SheetHeader className="space-y-2 text-left">
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                onBlur={handleTitleBlur}
                className="text-lg font-bold border-transparent hover:border-input focus:border-input bg-transparent hover:bg-background/50 focus:bg-background px-2 -ml-2 h-auto py-1 w-full transition-all"
              />
            </SheetHeader>

            {/* Meta Properties Grid */}
            <div className="grid grid-cols-2 gap-4 border-y py-4 border-border/60">
              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Status</Label>
                <Select
                  value={task.status}
                  onValueChange={(val: any) => updateTask.mutate({ id: task.id, data: { status: val } })}
                >
                  <SelectTrigger className="h-8 text-xs bg-background/40">
                    <SelectValue />
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
                <Label className="text-xs text-muted-foreground">Priority</Label>
                <Select
                  value={task.priority}
                  onValueChange={(val: any) => updateTask.mutate({ id: task.id, data: { priority: val } })}
                >
                  <SelectTrigger className="h-8 text-xs bg-background/40">
                    <SelectValue />
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

              <div className="space-y-1">
                <Label className="text-xs text-muted-foreground">Project</Label>
                <Select
                  value={task.projectId || "none"}
                  onValueChange={(val) => updateTask.mutate({ id: task.id, data: { projectId: val === "none" ? null : val } })}
                >
                  <SelectTrigger className="h-8 text-xs bg-background/40">
                    <SelectValue>
                      {task.projectId
                        ? (projects?.find((p: any) => p.id === task.projectId)?.name || "No Project")
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
                <Label className="text-xs text-muted-foreground mb-1">Due Date</Label>
                <Popover>
                  <PopoverTrigger
                    render={
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal h-8 text-xs bg-background/40",
                          !selectedDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-3.5 w-3.5" />
                        {selectedDate ? format(selectedDate, "PPP") : <span>No Due Date</span>}
                      </Button>
                    }
                  />
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={selectedDate || undefined}
                      onSelect={(date) => updateTask.mutate({ id: task.id, data: { dueDate: date ? date.toISOString() : null } })}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            {/* Description */}
            <div className="space-y-2">
              <Label className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Notes</Label>
              <Textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                onBlur={handleDescriptionBlur}
                placeholder="Add notes or task details here..."
                rows={4}
                className="resize-none bg-background/30 focus:bg-background border-border/50 text-sm"
              />
            </div>

            {/* Checklist Section */}
            <div className="space-y-3">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <CheckSquare className="w-4 h-4" />
                <span>Checklist</span>
              </div>
              
              <div className="space-y-2">
                {task.checklists?.map((item: any) => (
                  <div key={item.id} className="flex items-center justify-between group/item p-1 hover:bg-accent/30 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Checkbox
                        checked={item.isCompleted}
                        onCheckedChange={(checked) =>
                          toggleChecklistItem.mutate({ taskId: task.id, itemId: item.id, isCompleted: !!checked })
                        }
                      />
                      <span className={cn("text-sm", item.isCompleted && "line-through text-muted-foreground")}>
                        {item.title}
                      </span>
                    </div>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 opacity-0 group-hover/item:opacity-100 text-destructive hover:text-destructive hover:bg-destructive/10 transition-opacity"
                      onClick={() => deleteChecklistItem.mutate({ taskId: task.id, itemId: item.id })}
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                ))}

                <form onSubmit={handleAddChecklistItem} className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Add checklist item..."
                    value={newChecklistTitle}
                    onChange={(e) => setNewChecklistTitle(e.target.value)}
                    className="h-8 text-xs bg-background/20"
                  />
                  <Button type="submit" size="sm" className="h-8 px-3 shrink-0">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                  </Button>
                </form>
              </div>
            </div>

            {/* Subtasks Section */}
            <div className="space-y-3 pt-2">
              <div className="flex items-center gap-2 text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                <ListTodo className="w-4 h-4" />
                <span>Subtasks</span>
              </div>

              <div className="space-y-2">
                {task.subtasks?.map((subtask: any) => (
                  <div 
                    key={subtask.id} 
                    className="flex items-center gap-3 p-2 hover:bg-accent/40 rounded-lg cursor-pointer border border-transparent hover:border-border/40"
                    onClick={() => setSelectedTaskId(subtask.id)}
                  >
                    <CornerDownRight className="w-4 h-4 text-muted-foreground shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className={cn("text-sm font-medium truncate", subtask.status === "DONE" && "line-through text-muted-foreground")}>
                        {subtask.title}
                      </p>
                    </div>
                    <Badge variant="outline" className="text-[10px] bg-background">
                      {subtask.status}
                    </Badge>
                  </div>
                ))}

                <form onSubmit={handleAddSubtask} className="flex items-center gap-2 mt-2">
                  <Input
                    placeholder="Add subtask..."
                    value={newSubtaskTitle}
                    onChange={(e) => setNewSubtaskTitle(e.target.value)}
                    className="h-8 text-xs bg-background/20"
                  />
                  <Button type="submit" size="sm" className="h-8 px-3 shrink-0">
                    <Plus className="w-3.5 h-3.5 mr-1" />
                    Add
                  </Button>
                </form>
              </div>
            </div>
          </div>
        )}
      </SheetContent>
    </Sheet>
  )
}

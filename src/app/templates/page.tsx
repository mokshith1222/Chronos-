"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Button } from "@/components/ui/button"
import { Plus, CheckSquare, FileText, Folder } from "lucide-react"
import { useOrganization } from "@/hooks/use-organization"
import { toast } from "sonner"
import { useRouter } from "next/navigation"

export default function TemplatesPage() {
  const { addProject, addTask } = useOrganization()
  const router = useRouter()

  const useProjectTemplate = () => {
    addProject("New Product Launch", "#3b82f6")
    toast.success("Template Applied", { description: "Project 'Product Launch' created." })
    setTimeout(() => router.push('/projects'), 1000)
  }

  const useTaskTemplate = (title: string) => {
    addTask(title, null)
    toast.success("Template Applied", { description: `Task '${title}' added to your inbox.` })
  }

  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 h-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Templates</h1>
            <p className="text-muted-foreground mt-1">Reusable blueprints for your workflows.</p>
          </div>
          <Button size="lg" className="rounded-full shadow-md" onClick={() => toast("Template builder coming soon!")}>
            <Plus className="mr-2 size-4" />
            Create Template
          </Button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="rounded-2xl border bg-card p-6 flex flex-col gap-4 group hover:border-primary/50 transition-colors cursor-pointer" onClick={useProjectTemplate}>
            <div className="h-12 w-12 rounded-xl bg-blue-500/10 text-blue-500 flex items-center justify-center">
              <Folder className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Product Launch</h3>
              <p className="text-sm text-muted-foreground mt-1">Complete project structure with pre-defined tasks for software releases.</p>
            </div>
            <Button variant="outline" className="mt-auto w-full group-hover:bg-primary group-hover:text-primary-foreground">Use Template</Button>
          </div>
          
          <div className="rounded-2xl border bg-card p-6 flex flex-col gap-4 group hover:border-primary/50 transition-colors cursor-pointer" onClick={() => useTaskTemplate("Weekly Review: Focus & Planning")}>
            <div className="h-12 w-12 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
              <FileText className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Weekly Review</h3>
              <p className="text-sm text-muted-foreground mt-1">Task blueprint for Sunday reflections and planning.</p>
            </div>
            <Button variant="outline" className="mt-auto w-full group-hover:bg-primary group-hover:text-primary-foreground">Use Template</Button>
          </div>

          <div className="rounded-2xl border bg-card p-6 flex flex-col gap-4 group hover:border-primary/50 transition-colors cursor-pointer" onClick={() => useTaskTemplate("BUG: [Title] - [Severity]")}>
            <div className="h-12 w-12 rounded-xl bg-purple-500/10 text-purple-500 flex items-center justify-center">
              <CheckSquare className="size-6" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Bug Report</h3>
              <p className="text-sm text-muted-foreground mt-1">Standardized task format for reporting and tracking issues.</p>
            </div>
            <Button variant="outline" className="mt-auto w-full group-hover:bg-primary group-hover:text-primary-foreground">Use Template</Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}

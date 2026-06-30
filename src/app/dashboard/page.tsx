import { Suspense } from "react"
import { DashboardClientLayout } from "@/features/dashboard/components/dashboard-client-layout"
import { DashboardFilters } from "@/features/dashboard/components/dashboard-filters"
import { DashboardSearch } from "@/features/dashboard/components/dashboard-search"
import { Loader2 } from "lucide-react"
import { DashboardLayout } from "@/components/layout/dashboard-layout"

export const metadata = {
  title: "Dashboard | Focused Planck",
  description: "Your daily productivity command center.",
}

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-6">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div className="flex items-center gap-6">
            <h1 className="text-xl font-bold tracking-tight">Dashboard</h1>
            <div className="hidden md:block">
              <DashboardFilters />
            </div>
          </div>
          <div className="flex items-center gap-4 w-full md:w-auto">
            <DashboardSearch />
          </div>
          {/* Mobile filters below search on small screens */}
          <div className="md:hidden block">
            <DashboardFilters />
          </div>
        </div>

        <main className="flex-1 overflow-x-hidden">
          <Suspense 
            fallback={
              <div className="flex flex-col items-center justify-center min-h-[50vh] text-muted-foreground gap-4">
                <Loader2 className="h-8 w-8 animate-spin" />
                <p className="text-sm font-medium animate-pulse">Loading Command Center...</p>
              </div>
            }
          >
            <DashboardClientLayout />
          </Suspense>
        </main>
      </div>
    </DashboardLayout>
  )
}

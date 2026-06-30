"use client"

import { motion, AnimatePresence } from "framer-motion"
import { dashboardVariants } from "@/lib/animations"
import { useDashboardStore, ALL_WIDGETS } from "@/stores/dashboard-store"
import { ProductivityScoreWidget } from "./widgets/productivity-score-widget"
import { RunningTimerWidget } from "./widgets/running-timer-widget"
import { QuickActionsWidget } from "./widgets/quick-actions-widget"
import { RecentTasksWidget } from "./widgets/recent-tasks-widget"
import { WeeklyProductivityChart } from "./charts/weekly-productivity-chart"
import { ProjectDistributionChart } from "./charts/project-distribution-chart"
import { CalendarWidget } from "./widgets/calendar-widget"
import { GoalsProgressWidget } from "./widgets/goals-progress-widget"
import { HabitProgressWidget } from "./widgets/habit-progress-widget"
import { RecentNotesWidget } from "./widgets/recent-notes-widget"
import { PinnedItemsWidget } from "./widgets/pinned-items-widget"
import { RecentProjectsWidget } from "./widgets/recent-projects-widget"
import { ActivityFeedWidget } from "./widgets/activity-feed-widget"
import { Button } from "@/components/ui/button"
import { Trash2, Plus, Check, Sliders, Layout } from "lucide-react"

export function DashboardClientLayout() {
  const { activeWidgets, isEditingLayout, toggleWidget, setIsEditingLayout } = useDashboardStore()

  const inactiveWidgets = ALL_WIDGETS.filter((w) => !activeWidgets.includes(w.id))

  const RemoveOverlay = ({ widgetId }: { widgetId: string }) => (
    <div className="absolute inset-0 bg-background/80 backdrop-blur-[2px] rounded-3xl border-2 border-dashed border-destructive/50 flex flex-col items-center justify-center gap-3 z-30 p-4 animate-in fade-in duration-200">
      <p className="text-xs font-bold text-destructive uppercase tracking-wider">Widget Active</p>
      <Button
        variant="destructive"
        size="sm"
        className="rounded-xl font-semibold shadow-md gap-1.5"
        onClick={() => toggleWidget(widgetId)}
      >
        <Trash2 className="size-4" /> Hide Widget
      </Button>
    </div>
  )

  return (
    <div className="space-y-6">
      {/* Edit Mode Customization Toolbar */}
      <AnimatePresence>
        {isEditingLayout && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="mx-6 p-5 rounded-2xl border border-primary/20 bg-primary/5 backdrop-blur-md space-y-4"
          >
            <div className="flex items-center justify-between gap-4 flex-wrap">
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-primary uppercase tracking-wider flex items-center gap-2">
                  <Layout className="size-4" /> Customize Workspace Layout
                </h3>
                <p className="text-xs text-muted-foreground">
                  Hide active widgets using the overlays below, or click any widget below to add it back to your dashboard.
                </p>
              </div>
              <Button
                size="sm"
                className="rounded-xl font-semibold gap-1.5 shadow-md shadow-primary/15"
                onClick={() => setIsEditingLayout(false)}
              >
                <Check className="size-4" /> Save Layout
              </Button>
            </div>

            {/* Inactive Widgets List */}
            {inactiveWidgets.length > 0 ? (
              <div className="flex flex-wrap gap-2.5 pt-2">
                {inactiveWidgets.map((widget) => (
                  <Button
                    key={widget.id}
                    variant="outline"
                    size="sm"
                    className="rounded-xl text-xs font-semibold gap-1.5 border-border/60 bg-background/50 hover:bg-background"
                    onClick={() => toggleWidget(widget.id)}
                  >
                    <Plus className="size-3.5 text-primary" />
                    <span>{widget.label}</span>
                    <span className="text-[9px] text-muted-foreground uppercase tracking-wider bg-muted px-1.5 py-0.5 rounded ml-1">
                      {widget.category}
                    </span>
                  </Button>
                ))}
              </div>
            ) : (
              <p className="text-xs text-muted-foreground italic pt-2">All available widgets are currently active on your dashboard.</p>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      <motion.div
        variants={dashboardVariants}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6 px-6 pb-6 max-w-[1600px] mx-auto"
      >
        {/* Row 1: Immediate Action & Time */}
        {activeWidgets.includes("score") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-1 min-h-[12rem] flex relative group">
            <div className="w-full h-full"><ProductivityScoreWidget /></div>
            {isEditingLayout && <RemoveOverlay widgetId="score" />}
          </motion.div>
        )}
        {activeWidgets.includes("timer") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-1 min-h-[12rem] flex relative group">
            <div className="w-full h-full"><RunningTimerWidget /></div>
            {isEditingLayout && <RemoveOverlay widgetId="timer" />}
          </motion.div>
        )}
        {activeWidgets.includes("actions") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-2 min-h-[12rem] flex relative group">
            <div className="w-full h-full"><QuickActionsWidget /></div>
            {isEditingLayout && <RemoveOverlay widgetId="actions" />}
          </motion.div>
        )}

        {/* Row 2: Today's Focus */}
        {activeWidgets.includes("calendar") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-1 min-h-[25rem] flex relative group">
            <div className="w-full h-full"><CalendarWidget /></div>
            {isEditingLayout && <RemoveOverlay widgetId="calendar" />}
          </motion.div>
        )}
        {activeWidgets.includes("tasks") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-2 min-h-[25rem] flex relative group">
            <div className="w-full h-full"><RecentTasksWidget /></div>
            {isEditingLayout && <RemoveOverlay widgetId="tasks" />}
          </motion.div>
        )}
        {activeWidgets.includes("habits") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-1 min-h-[25rem] flex relative group">
            <div className="w-full h-full"><HabitProgressWidget /></div>
            {isEditingLayout && <RemoveOverlay widgetId="habits" />}
          </motion.div>
        )}

        {/* Row 3: Analytics & Planning */}
        {activeWidgets.includes("productivity") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-2 min-h-[22rem] flex relative group">
            <div className="w-full h-full"><WeeklyProductivityChart /></div>
            {isEditingLayout && <RemoveOverlay widgetId="productivity" />}
          </motion.div>
        )}
        {activeWidgets.includes("distribution") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-1 min-h-[22rem] flex relative group">
            <div className="w-full h-full"><ProjectDistributionChart /></div>
            {isEditingLayout && <RemoveOverlay widgetId="distribution" />}
          </motion.div>
        )}
        {activeWidgets.includes("goals") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-1 min-h-[22rem] flex relative group">
            <div className="w-full h-full"><GoalsProgressWidget /></div>
            {isEditingLayout && <RemoveOverlay widgetId="goals" />}
          </motion.div>
        )}

        {/* Row 4: Workspace Navigation & History */}
        {activeWidgets.includes("pinned") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-1 h-[220px] flex relative group">
            <div className="w-full h-full"><PinnedItemsWidget /></div>
            {isEditingLayout && <RemoveOverlay widgetId="pinned" />}
          </motion.div>
        )}
        {activeWidgets.includes("projects") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-1 h-[220px] flex relative group">
            <div className="w-full h-full"><RecentProjectsWidget /></div>
            {isEditingLayout && <RemoveOverlay widgetId="projects" />}
          </motion.div>
        )}
        {activeWidgets.includes("notes") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-1 h-[220px] flex relative group">
            <div className="w-full h-full"><RecentNotesWidget /></div>
            {isEditingLayout && <RemoveOverlay widgetId="notes" />}
          </motion.div>
        )}
        {activeWidgets.includes("activity") && (
          <motion.div variants={dashboardVariants.item} className="xl:col-span-1 h-[220px] flex relative group">
            <div className="w-full h-full"><ActivityFeedWidget /></div>
            {isEditingLayout && <RemoveOverlay widgetId="activity" />}
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

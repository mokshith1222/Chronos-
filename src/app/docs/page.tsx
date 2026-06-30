"use client"

import * as React from "react"
import Link from "next/link"
import { motion } from "framer-motion"
import { 
  Clock, ArrowLeft, BookOpen, LayoutDashboard, Folder, CheckSquare, 
  Calendar, FileText, Target, Activity, LayoutTemplate, BarChart, 
  HelpCircle, Shield, Sparkles, ChevronRight, Info
} from "lucide-react"
import { Button } from "@/components/ui/button"

const docSections = [
  {
    id: "getting-started",
    title: "Getting Started",
    icon: BookOpen,
    description: "Learn about Chronos' local-first architecture and how your data is stored.",
    content: (
      <div className="space-y-4">
        <p>
          Welcome to <strong>Chronos</strong>, a local-first, private productivity workspace designed for high-performance workflows. Unlike traditional cloud platforms, Chronos puts you in complete control of your data.
        </p>
        <div className="p-4 bg-primary/5 border border-primary/10 rounded-2xl flex gap-3">
          <Shield className="size-5 text-primary shrink-0 mt-0.5" />
          <div className="text-xs space-y-1">
            <span className="font-bold text-foreground">Local-First Philosophy</span>
            <p className="text-muted-foreground leading-relaxed">
              Every task, note, habit, and logged second is stored locally on your device using a secure browser database. We do not run background trackers, and your data never leaves your machine unless you choose to export a backup.
            </p>
          </div>
        </div>
        <h4 className="font-bold text-sm text-foreground pt-2">Key Features:</h4>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
          <li><strong>Offline Capability</strong>: Work from anywhere. Chronos requires zero internet connection to function.</li>
          <li><strong>Zero Tracking</strong>: No telemetry, no analytics, and no commercial SaaS limitations.</li>
          <li><strong>Instant Backups</strong>: Export your entire database as a single JSON file from the settings panel at any time.</li>
        </ul>
      </div>
    )
  },
  {
    id: "dashboard",
    title: "Dashboard & Customization",
    icon: LayoutDashboard,
    description: "Organize and customize your productivity widgets to fit your daily routine.",
    content: (
      <div className="space-y-4">
        <p>
          The Dashboard is your command center. It aggregates metrics from your tasks, goals, habits, and time logs into a single, cohesive interface.
        </p>
        <h4 className="font-bold text-sm text-foreground pt-2">Customizing Your Layout:</h4>
        <ol className="list-decimal pl-5 space-y-2 text-xs text-muted-foreground">
          <li>Click the <strong>"Customize"</strong> button at the top right of the dashboard.</li>
          <li>In Edit Mode, you can hide any widget by clicking its remove icon, or add widgets using the top selection bar.</li>
          <li>Click <strong>"Save Layout"</strong> to lock in your custom layout. Your configuration is saved locally.</li>
        </ol>
        <h4 className="font-bold text-sm text-foreground pt-2">Available Widgets:</h4>
        <ul className="list-disc pl-5 space-y-1.5 text-xs text-muted-foreground">
          <li><strong>Productivity Score</strong>: Measures the ratio of productive focus time versus distraction time.</li>
          <li><strong>Weekly Activity</strong>: Visualizes your tracked hours over the last 7 days.</li>
          <li><strong>Active Tasks & Goals</strong>: Quick access to your immediate priorities.</li>
        </ul>
      </div>
    )
  },
  {
    id: "time-tracker",
    title: "Time Tracker",
    icon: Clock,
    description: "Log your focus sessions and classify your productivity levels.",
    content: (
      <div className="space-y-4">
        <p>
          The Time Tracker helps you audit your attention. You can track time in real-time or log past sessions manually.
        </p>
        <h4 className="font-bold text-sm text-foreground pt-2">Tracking Modes:</h4>
        <ul className="list-disc pl-5 space-y-2 text-xs text-muted-foreground">
          <li><strong>Normal Timer</strong>: A standard stopwatch that logs continuous work. Good for open-ended tasks.</li>
          <li><strong>Pomodoro Timer</strong>: A structured interval timer (25 minutes of work followed by a 5-minute break). Helps sustain focus and prevent burnout.</li>
        </ul>
        <h4 className="font-bold text-sm text-foreground pt-2">Productivity Classification:</h4>
        <p className="text-xs text-muted-foreground">
          When starting a session, you can toggle the <strong>"Productive"</strong> switch. Classifying sessions as productive or unproductive feeds directly into your dashboard's <em>Productivity Score</em>, helping you identify time-wasting patterns.
        </p>
      </div>
    )
  },
  {
    id: "tasks",
    title: "Tasks & Kanban Board",
    icon: CheckSquare,
    description: "Manage your backlog with a flexible drag-and-drop Kanban board.",
    content: (
      <div className="space-y-4">
        <p>
          Chronos features a fully interactive Kanban board for task management, split into columns: <em>To Do</em>, <em>In Progress</em>, and <em>Done</em>.
        </p>
        <h4 className="font-bold text-sm text-foreground pt-2">Advanced Task Features:</h4>
        <ul className="list-disc pl-5 space-y-2 text-xs text-muted-foreground">
          <li><strong>Checklists</strong>: Break complex tasks down into smaller sub-tasks. Progress bars update automatically.</li>
          <li><strong>Priority Levels</strong>: Categorize tasks by priority (Low, Medium, High) to highlight critical objectives.</li>
          <li><strong>Project Connections</strong>: Assign tasks to specific projects. The task creation modal automatically pre-populates your active project filter so new tasks are immediately visible.</li>
        </ul>
      </div>
    )
  },
  {
    id: "habits",
    title: "Habit Tracker",
    icon: Activity,
    description: "Build long-term consistency with habit grids and streak metrics.",
    content: (
      <div className="space-y-4">
        <p>
          The Habit Tracker uses a GitHub-style consistency heatmap to visualize your daily routines over the course of the year.
        </p>
        <h4 className="font-bold text-sm text-foreground pt-2">How it works:</h4>
        <ul className="list-disc pl-5 space-y-2 text-xs text-muted-foreground">
          <li><strong>Local Timezone Lock</strong>: Habits are tracked using your local device date, ensuring completions never shift backwards by a day.</li>
          <li><strong>Streaks</strong>: Shows your current streak and best streak. Missing a day resets the current streak, encouraging daily discipline.</li>
          <li><strong>Future Days</strong>: Future days of the current week are rendered as faint placeholder dots, keeping the grid visually complete and aligned.</li>
        </ul>
      </div>
    )
  },
  {
    id: "notes",
    title: "Notes & Documents",
    icon: FileText,
    description: "Write distraction-free notes in a rich, translucent document editor.",
    content: (
      <div className="space-y-4">
        <p>
          The Notes module provides a clean writing space for documentation, meeting records, or daily logging.
        </p>
        <h4 className="font-bold text-sm text-foreground pt-2">Key Features:</h4>
        <ul className="list-disc pl-5 space-y-2 text-xs text-muted-foreground">
          <li><strong>Folder Organization</strong>: Group related notes into custom folders to keep your sidebar clean.</li>
          <li><strong>Favorites & Archive</strong>: Star important notes for quick access, or archive completed notes to hide them from your main list.</li>
          <li><strong>Rich Editor</strong>: A clean markdown-friendly editor designed for distraction-free writing.</li>
        </ul>
      </div>
    )
  }
]

export default function DocsPage() {
  const [activeSection, setActiveSection] = React.useState("getting-started")

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-x-hidden">
      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-gradient-to-b from-primary/5 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/40 bg-background/60 px-6 backdrop-blur-xl">
        <Link href="/" className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
            <Clock className="size-5" />
          </div>
          <span>Chronos Docs</span>
        </Link>
        <Link href="/">
          <span className="text-sm font-semibold text-muted-foreground hover:text-foreground flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="size-4" /> Back to Home
          </span>
        </Link>
      </header>

      <main className="flex-1 max-w-6xl w-full mx-auto px-6 py-12 md:py-16 flex flex-col md:flex-row gap-10 items-start">
        {/* Left Sidebar Navigation */}
        <aside className="w-full md:w-64 shrink-0 space-y-2 md:sticky md:top-24">
          <div className="px-3 py-2 text-xs font-bold uppercase tracking-wider text-muted-foreground">
            Documentation
          </div>
          <div className="space-y-1">
            {docSections.map((sec) => {
              const Icon = sec.icon
              const isActive = activeSection === sec.id
              return (
                <button
                  key={sec.id}
                  onClick={() => setActiveSection(sec.id)}
                  className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-left text-xs font-semibold transition-all cursor-pointer ${
                    isActive 
                      ? "bg-primary/10 text-primary shadow-sm" 
                      : "text-muted-foreground hover:text-foreground hover:bg-muted/50"
                  }`}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{sec.title}</span>
                  {isActive && <ChevronRight className="size-3.5 ml-auto text-primary" />}
                </button>
              )
            })}
          </div>
        </aside>

        {/* Right Content Area */}
        <section className="flex-1 min-w-0 bg-card/40 border rounded-3xl p-6 md:p-10 backdrop-blur-xl shadow-xl space-y-6">
          {docSections.map((sec) => {
            if (sec.id !== activeSection) return null
            const Icon = sec.icon
            return (
              <motion.div
                key={sec.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
                className="space-y-6"
              >
                <div className="flex items-center gap-3 border-b border-border/40 pb-6">
                  <div className="size-12 rounded-2xl bg-primary/10 text-primary flex items-center justify-center">
                    <Icon className="size-6" />
                  </div>
                  <div>
                    <h1 className="text-2xl font-black tracking-tight">{sec.title}</h1>
                    <p className="text-xs text-muted-foreground mt-0.5">{sec.description}</p>
                  </div>
                </div>

                <div className="text-sm text-muted-foreground leading-relaxed">
                  {sec.content}
                </div>
              </motion.div>
            )
          })}
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 py-8 text-center text-xs text-muted-foreground mt-auto">
        <p>© 2026 Chronos. All rights reserved.</p>
      </footer>
    </div>
  )
}

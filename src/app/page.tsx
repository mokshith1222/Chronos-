import type { Metadata } from "next"
import Link from "next/link"
import Script from "next/script"
import { ArrowRight, Clock, Shield, Zap, LayoutGrid, BarChart3, ChevronRight, Play, Pause, Square, CheckSquare, Calendar, Folder, FileText } from "lucide-react"
import { Button } from "@/components/ui/button"
import { FAQAccordion } from "@/components/marketing/faq-accordion"

export const metadata: Metadata = {
  title: "Chronos | Standalone Time Tracker & Productivity Platform",
  description: "Boost your focus with Chronos. A local-first, standalone time tracker, Pomodoro timer, Kanban task board, and analytics dashboard designed for high-performance workflows.",
  keywords: [
    "time tracker",
    "productivity app",
    "pomodoro timer",
    "task management",
    "kanban board",
    "developer tools",
    "focus timer",
    "chronos",
    "offline-first",
    "time tracking software",
    "time tracker for developers",
    "best time tracking app",
    "personal time tracker",
    "focus timer online",
    "task manager with timer",
    "kanban board with time tracking",
    "local first time tracker",
    "private productivity app",
    "pomodoro timer online",
    "time block calendar",
    "productivity dashboard",
    "weekly time auditor",
    "habit tracker streak",
    "chronos productivity",
    "focused planck",
    "deep work tracker",
    "distraction free timer",
    "developer productivity tools",
    "time tracker csv export",
    "freelancer time tracker"
  ],
}

export default function MarketingLandingPage() {
  const faqItems = [
    {
      question: "What is Chronos and how does it improve productivity?",
      answer: "Chronos is a standalone productivity platform combining real-time time tracking, Pomodoro focus sessions, task management (Kanban), and deep analytics. By centralizing your workflow, Chronos eliminates context-switching and helps you analyze exactly where your time goes."
    },
    {
      question: "How does the real-time time tracker work?",
      answer: "The Chronos time tracker offers three modes: a standard Stopwatch, a Pomodoro timer, and a custom Countdown. When you start tracking, it records sessions directly to the database. Pausing or stopping immediately syncs with the server to guarantee 100% accurate time logs without drift."
    },
    {
      question: "Is Chronos fully local and private?",
      answer: "Yes. Chronos is designed as a standalone, private workspace. All your productivity logs, notes, and task details are stored securely with enterprise-grade encryption. We never sell your data, and you have complete control over your local database."
    },
    {
      question: "Can I integrate Chronos with my existing calendar?",
      answer: "Absolutely. Chronos includes a built-in calendar view that syncs with your tasks and time blocks, allowing you to drag-and-drop tasks directly onto your schedule for seamless time blocking."
    }
  ]

  // Structured Data (JSON-LD) for SEO
  const jsonLd = {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "@id": "https://chronos-lime-six.vercel.app/#website",
        "url": "https://chronos-lime-six.vercel.app/",
        "name": "Chronos",
        "description": "Standalone Time Tracker & Productivity Platform",
        "publisher": {
          "@type": "Organization",
          "name": "Chronos Inc."
        }
      },
      {
        "@type": "SoftwareApplication",
        "@id": "https://chronos-lime-six.vercel.app/#software",
        "name": "Chronos",
        "applicationCategory": "BusinessApplication",
        "operatingSystem": "Web",
        "offers": {
          "@type": "Offer",
          "price": "0",
          "priceCurrency": "USD"
        }
      },
      {
        "@type": "FAQPage",
        "@id": "https://chronos-lime-six.vercel.app/#faq",
        "mainEntity": faqItems.map((item) => ({
          "@type": "Question",
          "name": item.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": item.answer
          }
        }))
      }
    ]
  }

  return (
    <div className="flex min-h-screen flex-col bg-background text-foreground overflow-x-hidden">
      <Script
        id="structured-data"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Decorative background glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-gradient-to-b from-primary/10 via-transparent to-transparent blur-3xl pointer-events-none -z-10" />

      {/* Header */}
      <header className="sticky top-0 z-50 flex h-16 items-center justify-between border-b border-border/40 bg-background/60 px-6 backdrop-blur-xl">
        <div className="flex items-center gap-2.5 font-bold text-xl tracking-tight">
          <div className="size-9 rounded-xl bg-gradient-to-br from-primary to-indigo-500 flex items-center justify-center text-primary-foreground shadow-lg shadow-primary/25">
            <Clock className="size-5" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80">Chronos</span>
        </div>
        <nav className="hidden md:flex gap-8 text-sm font-semibold text-muted-foreground">
          <a href="#features" className="hover:text-primary transition-colors">Features</a>
          <a href="#faq" className="hover:text-primary transition-colors">FAQ</a>
        </nav>
        <div className="flex items-center gap-4">
          <Link href="/dashboard">
            <Button className="rounded-full font-semibold shadow-lg shadow-primary/20 hover:shadow-primary/30 transition-all bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-primary-foreground border-0">
              Open App
            </Button>
          </Link>
        </div>
      </header>

      {/* Visual Breadcrumbs */}
      <div className="bg-muted/30 border-b border-border/40 py-2 px-6">
        <div className="mx-auto max-w-5xl flex items-center gap-2 text-xs text-muted-foreground font-medium">
          <Link href="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight className="size-3" />
          <span className="text-foreground font-semibold">Productivity Platform</span>
        </div>
      </div>

      <main className="flex-1">
        {/* Hero Section */}
        <section className="px-6 pt-20 pb-16 md:pt-28 md:pb-20 text-center">
          <div className="mx-auto max-w-[900px] space-y-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full bg-primary/10 border border-primary/20 text-xs font-semibold text-primary tracking-wide uppercase">
              <Zap className="size-3.5" /> Standalone Workspace
            </div>
            <h1 className="text-5xl md:text-8xl font-black tracking-tight leading-[1.05]">
              Time tracking for the <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-indigo-400 to-purple-500 drop-shadow-sm">
                obsessive.
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-muted-foreground leading-relaxed max-w-[700px] mx-auto font-medium">
              Chronos is a premium, standalone productivity platform built for professionals who demand extreme performance, beautiful design, and local privacy.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
              <Link href="/dashboard">
                <Button size="lg" className="rounded-full h-14 px-8 text-lg font-semibold shadow-2xl shadow-primary/30 hover:-translate-y-0.5 transition-all bg-gradient-to-r from-primary to-indigo-500 hover:from-primary/90 hover:to-indigo-500/90 text-primary-foreground border-0">
                  Launch Chronos <ArrowRight className="ml-2 size-5" />
                </Button>
              </Link>
            </div>
          </div>

          {/* DETAILED REALISTIC MOCKUP */}
          <div className="mx-auto max-w-5xl mt-16 md:mt-24 p-2 rounded-3xl border border-border/50 bg-muted/20 backdrop-blur-3xl shadow-2xl relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-primary to-indigo-500 rounded-3xl blur opacity-20 group-hover:opacity-30 transition duration-1000" />
            <div className="relative bg-background rounded-[22px] overflow-hidden border border-border/50 shadow-inner p-5 flex flex-col md:flex-row gap-4 aspect-[16/10] text-left">
              
              {/* Fake Sidebar */}
              <div className="w-full md:w-48 shrink-0 border-r border-border/40 pr-4 flex flex-col justify-between py-2">
                <div className="space-y-6">
                  <div className="flex items-center gap-2 font-bold text-sm px-2">
                    <Clock className="size-4 text-primary" />
                    <span>Chronos Workspace</span>
                  </div>
                  <nav className="space-y-1">
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-primary/10 text-primary text-xs font-semibold">
                      <LayoutGrid className="size-3.5" /> Dashboard
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground text-xs font-semibold">
                      <Clock className="size-3.5" /> Time Tracker
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground text-xs font-semibold">
                      <CheckSquare className="size-3.5" /> Tasks
                    </div>
                    <div className="flex items-center gap-2 px-3 py-2 rounded-lg text-muted-foreground hover:text-foreground text-xs font-semibold">
                      <Calendar className="size-3.5" /> Calendar
                    </div>
                  </nav>
                </div>
                <div className="flex items-center gap-2 px-2 pt-4 border-t border-border/30">
                  <div className="size-6 rounded-full bg-primary/20 flex items-center justify-center text-[10px] font-bold text-primary">JD</div>
                  <span className="text-xs font-semibold truncate">Jane Doe</span>
                </div>
              </div>

              {/* Fake App Body */}
              <div className="flex-1 flex flex-col gap-4 py-2 overflow-hidden">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <h3 className="text-base font-bold">Workspace Dashboard</h3>
                    <p className="text-[11px] text-muted-foreground">Monitor your deep work focus hours.</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold px-2.5 py-1 bg-muted rounded-lg border">Today</span>
                  </div>
                </div>

                {/* Dashboard Widgets */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 flex-1 overflow-hidden">
                  
                  {/* Active Timer Widget */}
                  <div className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col justify-between shadow-sm">
                    <div>
                      <span className="text-[10px] font-bold text-primary uppercase tracking-wider">Active Session</span>
                      <h4 className="text-sm font-bold mt-1 truncate">Refactoring Landing Page</h4>
                      <p className="text-[11px] text-muted-foreground mt-0.5">Project: Chronos Suite</p>
                    </div>
                    <div className="my-3 font-mono text-3xl font-black text-foreground">01:14:52</div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-7 text-[10px] rounded-lg gap-1 px-2.5">
                        <Pause className="size-3" /> Pause
                      </Button>
                      <Button variant="destructive" size="sm" className="h-7 text-[10px] rounded-lg gap-1 px-2.5">
                        <Square className="size-2.5 fill-current" /> Stop
                      </Button>
                    </div>
                  </div>

                  {/* Weekly Chart Widget */}
                  <div className="bg-card/40 border border-border/50 rounded-xl p-4 flex flex-col justify-between shadow-sm md:col-span-2">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold text-muted-foreground uppercase tracking-wider">Weekly Activity Curve</span>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">100% Productive</span>
                    </div>
                    <div className="flex items-end justify-between h-28 gap-2 pt-4 border-b border-border/20">
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full bg-primary/20 rounded-t h-[40%]" />
                        <span className="text-[9px] text-muted-foreground">Mon</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full bg-primary/20 rounded-t h-[60%]" />
                        <span className="text-[9px] text-muted-foreground">Tue</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full bg-primary/20 rounded-t h-[30%]" />
                        <span className="text-[9px] text-muted-foreground">Wed</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full bg-primary/20 rounded-t h-[80%]" />
                        <span className="text-[9px] text-muted-foreground">Thu</span>
                      </div>
                      <div className="flex-1 flex flex-col items-center gap-1.5 h-full justify-end">
                        <div className="w-full bg-primary rounded-t h-[95%]" />
                        <span className="text-[9px] text-foreground font-semibold">Fri</span>
                      </div>
                    </div>
                  </div>

                </div>
              </div>

            </div>
          </div>
        </section>

        {/* Feature Grid (SEO Keyword Targeted) */}
        <section id="features" className="px-6 py-24 bg-muted/30 border-y border-border/40 relative">
          <div className="mx-auto max-w-5xl space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Built for elite workflows</h2>
              <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                Everything you need to track time, manage tasks, and optimize your focus in a single premium experience.
              </p>
            </div>

            <div className="grid gap-8 md:grid-cols-3">
              {/* Feature 1 */}
              <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
                <div className="size-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary shadow-inner">
                  <Clock className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Precision Time Tracking</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Track deep work hours with our advanced stopwatch, Pomodoro timer, and countdown. Syncs instantly to prevent server-side drift.
                </p>
              </div>

              {/* Feature 2 */}
              <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
                <div className="size-12 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 shadow-inner">
                  <LayoutGrid className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Integrated Kanban Tasks</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Organize tasks with a drag-and-drop Kanban board. Click play directly on any task card to start tracking time immediately.
                </p>
              </div>

              {/* Feature 3 */}
              <div className="flex flex-col gap-4 p-6 rounded-2xl border border-border/50 bg-card/50 backdrop-blur-md hover:-translate-y-1 transition-all duration-300">
                <div className="size-12 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-400 shadow-inner">
                  <BarChart3 className="size-6" />
                </div>
                <h3 className="text-xl font-bold">Analytics & Time Audits</h3>
                <p className="text-muted-foreground leading-relaxed text-sm">
                  Understand your productivity with weekly activity curves, project distribution charts, and granular time entry reports.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section id="faq" className="px-6 py-24 bg-muted/30 border-t border-border/40">
          <div className="mx-auto max-w-5xl space-y-16">
            <div className="text-center space-y-4">
              <h2 className="text-3xl md:text-5xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg max-w-[600px] mx-auto">
                Got questions about Chronos? Find quick answers here to optimize your setup.
              </p>
            </div>

            <FAQAccordion items={faqItems} />
          </div>
        </section>
      </main>

      {/* Footer / Directory Sitemap (SEO Backlinks) */}
      <footer className="border-t border-border/40 bg-card/20 backdrop-blur-md py-16 px-6">
        <div className="mx-auto max-w-5xl space-y-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            <div className="space-y-4 col-span-2 md:col-span-1">
              <div className="flex items-center gap-2.5 font-bold text-lg">
                <div className="size-7 rounded-lg bg-primary flex items-center justify-center text-primary-foreground shadow-md">
                  <Clock className="size-4" />
                </div>
                <span>Chronos</span>
              </div>
              <p className="text-xs text-muted-foreground leading-relaxed">
                Chronos is a professional productivity platform featuring advanced time tracking, task management, and deep analytics.
              </p>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Platform</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/dashboard" className="hover:text-primary transition-colors">Dashboard</Link></li>
                <li><Link href="/time" className="hover:text-primary transition-colors">Time Tracker</Link></li>
                <li><Link href="/tasks" className="hover:text-primary transition-colors">Kanban Tasks</Link></li>
                <li><Link href="/calendar" className="hover:text-primary transition-colors">Calendar</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Features</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/notes" className="hover:text-primary transition-colors">Notes & Logs</Link></li>
                <li><Link href="/goals" className="hover:text-primary transition-colors">Goals & Milestones</Link></li>
                <li><Link href="/habits" className="hover:text-primary transition-colors">Habit Tracker</Link></li>
                <li><Link href="/reports" className="hover:text-primary transition-colors">Analytics Reports</Link></li>
              </ul>
            </div>
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-foreground">Legal & Support</h4>
              <ul className="space-y-2 text-xs text-muted-foreground">
                <li><Link href="/docs" className="hover:text-primary transition-colors">How it Works</Link></li>
                <li><Link href="/help" className="hover:text-primary transition-colors">Help & Guides</Link></li>
                <li><Link href="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
                <li><Link href="/terms" className="hover:text-primary transition-colors">Terms of Service</Link></li>
                <li><Link href="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link></li>
              </ul>
            </div>
          </div>

          <div className="border-t border-border/20 pt-8 flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-muted-foreground">
            <p>© 2026 Chronos Inc. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}

"use client"

import { DashboardLayout } from "@/components/layout/dashboard-layout"
import { Keyboard, LifeBuoy } from "lucide-react"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function HelpPage() {
  return (
    <DashboardLayout>
      <div className="flex flex-col gap-8 h-full max-w-4xl mx-auto">
        <div className="text-center py-10">
          <h1 className="text-4xl font-bold tracking-tight">How can we help?</h1>
          <p className="text-muted-foreground mt-3 text-lg">Search documentation, view shortcuts, or contact support.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Card 1: Keyboard Shortcuts */}
          <div className="rounded-2xl border bg-card p-8 flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <Keyboard className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Keyboard Shortcuts</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Master the platform without touching your mouse.</p>
              <div className="space-y-2">
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span>Command Palette</span>
                  <kbd className="bg-muted px-2 py-1 rounded border font-mono text-xs text-muted-foreground">⌘ K</kbd>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span>Quick Add Task</span>
                  <kbd className="bg-muted px-2 py-1 rounded border font-mono text-xs text-muted-foreground">⌘ ⇧ A</kbd>
                </div>
                <div className="flex justify-between items-center text-sm border-b pb-2">
                  <span>Mark Task Done</span>
                  <kbd className="bg-muted px-2 py-1 rounded border font-mono text-xs text-muted-foreground">⌘ D</kbd>
                </div>
              </div>
            </div>
          </div>

          {/* Card 2: Contact Support */}
          <div className="rounded-2xl border bg-card p-8 flex gap-4">
            <div className="h-10 w-10 shrink-0 rounded-full bg-primary/10 text-primary flex items-center justify-center">
              <LifeBuoy className="size-5" />
            </div>
            <div>
              <h3 className="font-semibold text-lg">Contact Support</h3>
              <p className="text-sm text-muted-foreground mt-1 mb-4">Get in touch with us for questions, feedback, or support.</p>
              <div className="space-y-4">
                <div className="text-sm">
                  <span className="text-muted-foreground block text-xs font-bold uppercase tracking-wider">Email Support</span>
                  <a href="mailto:mokshithnaik932@gmail.com" className="text-primary font-semibold hover:underline mt-1 block">
                    mokshithnaik932@gmail.com
                  </a>
                </div>
                <Link href="/contact" className="block">
                  <Button size="sm" className="rounded-xl font-semibold w-full sm:w-auto">
                    Go to Contact Form
                  </Button>
                </Link>
              </div>
            </div>
          </div>
          
        </div>
      </div>
    </DashboardLayout>
  )
}

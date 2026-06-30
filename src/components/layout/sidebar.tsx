"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { useState, useEffect } from "react"
import { LayoutDashboard, Clock, Folder, CheckSquare, BarChart, Settings, Calendar, FileText, UserCircle, Target, Activity, LayoutTemplate, HelpCircle, Home, BookOpen } from "lucide-react"
import { cn } from "@/lib/utils"
import { useUser, useUpdateUser } from "@/hooks/use-user-queries"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"

const navigation = [
  { name: "Home", href: "/", icon: Home },
  { name: "Dashboard", href: "/dashboard", icon: LayoutDashboard },
  { name: "Time Tracker", href: "/time", icon: Clock },
  { name: "Projects", href: "/projects", icon: Folder },
  { name: "Tasks", href: "/tasks", icon: CheckSquare },
  { name: "Calendar", href: "/calendar", icon: Calendar },
  { name: "Notes", href: "/notes", icon: FileText },
  { name: "Goals", href: "/goals", icon: Target },
  { name: "Habits", href: "/habits", icon: Activity },
  { name: "Templates", href: "/templates", icon: LayoutTemplate },
  { name: "Reports", href: "/reports", icon: BarChart },
  { name: "Documentation", href: "/docs", icon: BookOpen },
]

export function SidebarContent() {
  const pathname = usePathname()
  const { data: user } = useUser()
  const updateUser = useUpdateUser()
  const [name, setName] = useState("")
  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    if (user?.name) {
      setName(user.name)
    }
  }, [user])

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault()
    updateUser.mutate({ name }, {
      onSuccess: () => {
        setIsOpen(false)
      }
    })
  }

  const displayName = user?.name || "Jane Doe"

  return (
    <div className="flex h-full flex-col">
      {/* Brand Header */}
      <div className="flex h-20 shrink-0 items-center px-6 border-b border-border/20">
        <Link href="/" className="flex items-center gap-3 font-heading font-bold text-lg tracking-tight hover:opacity-85 transition-opacity duration-200">
          <div className="size-9 rounded-xl bg-gradient-to-tr from-primary to-primary/80 flex items-center justify-center text-primary-foreground shadow-[0_0_20px_0_var(--primary)]/30 border border-white/10">
            <Clock className="size-5 animate-pulse" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/80 font-extrabold tracking-tight">
            Chronos
          </span>
        </Link>
      </div>

      {/* Navigation Links */}
      <div className="flex flex-1 flex-col gap-1.5 px-4 py-6 overflow-y-auto">
        {navigation.map((item) => {
          const isActive = pathname === item.href
          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium transition-all duration-300 hover:translate-x-1 border border-transparent",
                isActive 
                  ? "bg-primary/10 text-primary border-primary/20 shadow-[0_2px_12px_-4px_var(--primary)]" 
                  : "text-muted-foreground hover:bg-primary/5 hover:text-foreground"
              )}
            >
              <item.icon className={cn("size-4.5 transition-transform duration-300 group-hover:scale-110", isActive ? "text-primary" : "text-muted-foreground group-hover:text-foreground")} />
              {item.name}
            </Link>
          )
        })}
      </div>

      {/* Footer Settings & Help */}
      <div className="mt-auto p-4 border-t border-border/20 bg-muted/10">
        <div className="space-y-1">
          <Link
            href="/help"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-primary/5 hover:text-foreground"
          >
            <HelpCircle className="h-4 w-4" />
            Help & Shortcuts
          </Link>
          <Link
            href="/settings"
            className="flex items-center gap-3 rounded-xl px-3.5 py-2.5 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-primary/5 hover:text-foreground"
          >
            <Settings className="h-4 w-4" />
            Settings
          </Link>
        </div>
        
        {/* User Card */}
        <div 
          onClick={() => setIsOpen(true)}
          className="mt-4 flex items-center gap-3 rounded-2xl border border-border/30 bg-card/40 p-3 shadow-sm transition-all duration-300 hover:shadow-md hover:border-primary/20 cursor-pointer"
        >
          <UserCircle className="size-8 text-muted-foreground" />
          <div className="flex flex-col">
            <span className="text-sm font-semibold leading-none mb-1 text-foreground">{displayName}</span>
            <span className="text-[10px] uppercase font-bold tracking-wider text-primary leading-none">Workspace Owner</span>
          </div>
        </div>

        {/* Edit Profile Dialog */}
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogContent className="sm:max-w-[400px]">
            <form onSubmit={handleSave} className="space-y-4">
              <DialogHeader>
                <DialogTitle>Edit Profile</DialogTitle>
              </DialogHeader>
              <div className="space-y-1.5">
                <Label htmlFor="profile-name">Full Name</Label>
                <Input
                  id="profile-name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Enter your name"
                  className="bg-background/40"
                  required
                />
              </div>
              <DialogFooter className="pt-2">
                <Button type="button" variant="outline" onClick={() => setIsOpen(false)}>
                  Cancel
                </Button>
                <Button type="submit" disabled={updateUser.isPending}>
                  Save Changes
                </Button>
              </DialogFooter>
            </form>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}

export function Sidebar() {
  return (
    <aside className="fixed inset-y-6 left-6 z-50 w-60 flex-col rounded-3xl border border-white/10 dark:border-white/5 bg-card/25 backdrop-blur-2xl shadow-[0_8px_32px_0_rgba(0,0,0,0.08)] hidden md:flex overflow-hidden">
      <SidebarContent />
    </aside>
  )
}

"use client"

import * as React from "react"
import { Bell } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet"

export function NotificationDrawer() {
  const [notifications, setNotifications] = React.useState([
    { id: 1, title: "New Feature Available", description: "Check out the new Calendar view.", time: "2h ago", unread: true },
    { id: 2, title: "Goal Completed", description: "You hit your weekly target!", time: "5h ago", unread: true },
    { id: 3, title: "System Update", description: "Chronos v2.0 is now live.", time: "1d ago", unread: false },
  ])

  const unreadCount = notifications.filter(n => n.unread).length

  const markAllRead = () => {
    setNotifications(prev => prev.map(n => ({ ...n, unread: false })))
    toast.success("Notifications cleared")
  }

  return (
    <Sheet>
      <SheetTrigger render={<Button variant="ghost" size="icon" className="relative rounded-full text-muted-foreground hover:text-foreground" />}>
        <Bell className="size-4" />
        {unreadCount > 0 && (
          <span className="absolute right-2 top-2 size-2 rounded-full bg-primary" />
        )}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-sm flex flex-col p-0">
        <SheetHeader className="px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <SheetTitle>Notifications</SheetTitle>
            {unreadCount > 0 && (
              <Button variant="ghost" size="sm" className="text-xs h-auto p-2" onClick={markAllRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </SheetHeader>
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="p-8 text-center text-muted-foreground text-sm">
              You're all caught up!
            </div>
          ) : (
            <div className="flex flex-col divide-y">
              {notifications.map((notif) => (
                <div key={notif.id} className={`p-4 px-6 flex flex-col gap-1 hover:bg-muted/30 transition-colors ${notif.unread ? 'bg-muted/10' : ''}`}>
                  <div className="flex items-center justify-between">
                    <p className={`text-sm font-medium ${notif.unread ? 'text-foreground' : 'text-muted-foreground'}`}>{notif.title}</p>
                    {notif.unread && <div className="size-2 rounded-full bg-primary" />}
                  </div>
                  <p className="text-xs text-muted-foreground">{notif.description}</p>
                  <p className="text-[10px] text-muted-foreground mt-1 opacity-50">{notif.time}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </SheetContent>
    </Sheet>
  )
}

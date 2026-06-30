"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { widgetHover } from "@/lib/animations"
import { Plus, Timer, Calendar, FileText, LayoutDashboard, Zap } from "lucide-react"
import { Button } from "@/components/ui/button"
import { toast } from "sonner"

export function QuickActionsWidget() {
  const actions = [
    { icon: <Plus size={18} />, label: "New Task", color: "text-blue-500", bg: "bg-blue-500/10" },
    { icon: <Timer size={18} />, label: "Start Timer", color: "text-orange-500", bg: "bg-orange-500/10" },
    { icon: <Calendar size={18} />, label: "Event", color: "text-purple-500", bg: "bg-purple-500/10" },
    { icon: <FileText size={18} />, label: "New Note", color: "text-emerald-500", bg: "bg-emerald-500/10" },
    { icon: <LayoutDashboard size={18} />, label: "Project", color: "text-pink-500", bg: "bg-pink-500/10" },
    { icon: <Zap size={18} />, label: "Focus", color: "text-yellow-500", bg: "bg-yellow-500/10" },
  ]

  const handleAction = (label: string) => {
    toast.success(`Action triggered: ${label}`)
  }

  return (
    <motion.div
      variants={widgetHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="h-full"
    >
      <Card className="h-full">
        <CardHeader className="pb-4">
          <CardTitle className="text-sm font-medium flex items-center">
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-3 gap-2">
            {actions.map((action, i) => (
              <Button
                key={i}
                variant="outline"
                className="h-20 flex flex-col items-center justify-center gap-2 border-dashed hover:border-solid hover:bg-accent transition-all duration-300"
                onClick={() => handleAction(action.label)}
              >
                <div className={`p-2 rounded-full ${action.bg} ${action.color}`}>
                  {action.icon}
                </div>
                <span className="text-[10px] font-medium text-muted-foreground">{action.label}</span>
              </Button>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

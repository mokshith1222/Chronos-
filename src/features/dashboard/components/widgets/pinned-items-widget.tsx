"use client"

import { motion } from "framer-motion"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { widgetHover } from "@/lib/animations"
import { Pin } from "lucide-react"
import { useDashboardPinned } from "@/hooks/use-dashboard-queries"
import { Skeleton } from "@/components/ui/skeleton"

export function PinnedItemsWidget() {
  const { data: pinnedItems, isLoading, isError } = useDashboardPinned()

  if (isLoading) {
    return (
      <Card className="h-full">
        <CardHeader className="pb-4">
          <Skeleton className="h-4 w-32" />
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-5/6" />
        </CardContent>
      </Card>
    )
  }

  if (isError || !pinnedItems) {
    return (
      <Card className="h-full border-destructive/50">
        <CardContent className="flex h-full items-center justify-center text-sm text-destructive">
          Failed to load pinned items
        </CardContent>
      </Card>
    )
  }

  return (
    <motion.div
      variants={widgetHover}
      initial="rest"
      whileHover="hover"
      whileTap="tap"
      className="h-full"
    >
      <Card className="h-full flex flex-col bg-primary/5 border-primary/20">
        <CardHeader className="pb-4 flex flex-row items-center justify-between space-y-0 shrink-0">
          <CardTitle className="text-sm font-medium">Pinned Items</CardTitle>
          <Pin className="h-4 w-4 text-primary fill-primary" />
        </CardHeader>
        <CardContent className="flex-1 overflow-y-auto pr-2">
          <div className="space-y-3">
            {pinnedItems.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-4">Nothing pinned yet</p>
            ) : (
              pinnedItems.map((item: any) => (
                <div key={item.id} className="flex items-center gap-3 group cursor-pointer">
                  <div className="w-1.5 h-1.5 rounded-full bg-primary" />
                  <div className="flex flex-col">
                    <span className="text-sm font-medium group-hover:text-primary transition-colors">Pinned {item.itemType}</span>
                    <span className="text-xs text-muted-foreground truncate max-w-[200px]">ID: {item.itemId}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  )
}

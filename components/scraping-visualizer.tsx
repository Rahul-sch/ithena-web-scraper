"use client"

import { useEffect, useRef, useState } from "react"
import { cn } from "@/lib/utils"
import { Database, ArrowRight, Sparkles } from "lucide-react"

interface ScrapedItem {
  exhibitor: string
  booth: string
}

interface ScrapingVisualizerProps {
  isActive: boolean
  items: ScrapedItem[]
  totalCount: number
  sheetsConnected: boolean
}

export function ScrapingVisualizer({ isActive, items, totalCount, sheetsConnected }: ScrapingVisualizerProps) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [displayCount, setDisplayCount] = useState(0)

  // Animate count up
  useEffect(() => {
    if (totalCount > displayCount) {
      const timer = setTimeout(() => {
        setDisplayCount((prev) => Math.min(prev + 1, totalCount))
      }, 50)
      return () => clearTimeout(timer)
    }
  }, [totalCount, displayCount])

  // Auto-scroll to bottom
  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight
    }
  }, [items])

  const latestItem = items[items.length - 1]

  return (
    <div className="glass-card rounded-2xl p-6 lg:p-8 border border-border/50 relative overflow-hidden">
      {/* Scanning effect when active */}
      {isActive && (
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute inset-x-0 h-px bg-gradient-to-r from-transparent via-primary to-transparent animate-[scan-line_2s_linear_infinite]" />
        </div>
      )}

      <div className="space-y-6 relative">
        {/* Header with live counter */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div
              className={cn(
                "flex h-10 w-10 items-center justify-center rounded-xl border transition-all duration-300",
                isActive ? "bg-primary/20 border-primary/40 animate-pulse-glow" : "bg-secondary border-border/50",
              )}
            >
              <Database
                className={cn("h-5 w-5 transition-colors", isActive ? "text-primary" : "text-muted-foreground")}
              />
            </div>
            <div>
              <h3 className="text-lg font-semibold text-foreground">Live Scraper</h3>
              <p className="text-sm text-muted-foreground">{isActive ? "Extracting data..." : "Waiting for input"}</p>
            </div>
          </div>

          {/* Live counter */}
          <div
            className={cn(
              "flex items-center gap-2 px-4 py-2 rounded-xl border transition-all duration-300",
              isActive ? "bg-primary/10 border-primary/30" : "bg-secondary border-border/50",
            )}
          >
            <span className="text-sm text-muted-foreground">Companies:</span>
            <span
              className={cn(
                "text-xl font-mono font-bold tabular-nums transition-colors",
                isActive ? "text-primary" : "text-foreground",
              )}
            >
              {displayCount}
            </span>
          </div>
        </div>

        {/* Latest item notification */}
        {latestItem && (
          <div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-accent/10 border border-accent/20 animate-slide-up">
            <Sparkles className="h-4 w-4 text-accent" />
            <span className="text-sm font-medium text-accent">{latestItem.exhibitor} added</span>
            <ArrowRight className="h-4 w-4 text-accent/60 ml-auto" />
          </div>
        )}

        {/* Data table */}
        <div className="rounded-xl border border-border/50 overflow-hidden bg-secondary/30">
          {/* Table header */}
          <div className="grid grid-cols-2 gap-4 px-4 py-3 bg-secondary/50 border-b border-border/50">
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Exhibitor</div>
            <div className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Booth #</div>
          </div>

          {/* Table body */}
          <div ref={scrollRef} className="max-h-[300px] overflow-y-auto">
            {items.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
                <Database className="h-8 w-8 mb-3 opacity-30" />
                <p className="text-sm">No data yet. Start scraping to see results.</p>
              </div>
            ) : (
              items.map((item, index) => (
                <div
                  key={`${item.exhibitor}-${item.booth}-${index}`}
                  className={cn(
                    "grid grid-cols-2 gap-4 px-4 py-3 border-b border-border/30 animate-slide-up",
                    index === items.length - 1 && isActive && "bg-primary/5",
                  )}
                  style={{ animationDelay: `${index * 50}ms` }}
                >
                  <div className="flex items-center gap-2">
                    <div
                      className={cn(
                        "h-1.5 w-1.5 rounded-full",
                        index === items.length - 1 && isActive ? "bg-primary animate-pulse" : "bg-green-500",
                      )}
                    />
                    <span className="text-sm font-medium text-foreground truncate">{item.exhibitor}</span>
                  </div>
                  <div className="text-sm font-mono text-muted-foreground">{item.booth}</div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Sheets sync indicator */}
        {sheetsConnected && items.length > 0 && (
          <div className="flex items-center gap-2 text-xs text-green-400">
            <div className="h-1.5 w-1.5 rounded-full bg-green-500 animate-pulse" />
            Syncing to Google Sheets in real-time
          </div>
        )}
      </div>
    </div>
  )
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Globe, Play, Square, FileSpreadsheet, Check, Loader2, Zap } from "lucide-react"
import { cn } from "@/lib/utils"

interface InputPanelProps {
  onStartScrape: (url: string) => void
  onStopScrape: () => void
  onConnectSheets: () => void
  isScrapingActive: boolean
  sheetsConnected: boolean
}

export function InputPanel({
  onStartScrape,
  onStopScrape,
  onConnectSheets,
  isScrapingActive,
  sheetsConnected,
}: InputPanelProps) {
  const [url, setUrl] = useState("")
  const [isConnecting, setIsConnecting] = useState(false)

  const handleStartScrape = () => {
    if (url.trim()) {
      onStartScrape(url)
    }
  }

  const handleConnectSheets = async () => {
    setIsConnecting(true)
    await onConnectSheets()
    setIsConnecting(false)
  }

  return (
    <div className="glass-card rounded-2xl p-6 lg:p-8 border border-border/50">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10 border border-primary/20">
            <Zap className="h-5 w-5 text-primary" />
          </div>
          <div>
            <h3 className="text-lg font-semibold text-foreground">Input Configuration</h3>
            <p className="text-sm text-muted-foreground">Configure your scraping target</p>
          </div>
        </div>

        {/* URL Input */}
        <div className="space-y-3">
          <label className="text-sm font-medium text-foreground">Target URL</label>
          <div className="relative group">
            <Globe className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground group-focus-within:text-primary transition-colors" />
            <Input
              type="url"
              placeholder="Paste any website (IMTS, Interphex, etc)"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              className={cn(
                "h-14 pl-12 pr-4 text-base bg-secondary/50 border-border/50 rounded-xl",
                "placeholder:text-muted-foreground/50",
                "focus:border-primary/50 focus:ring-2 focus:ring-primary/20",
                "transition-all duration-200",
              )}
            />
            <div className="absolute inset-0 rounded-xl bg-primary/5 opacity-0 group-focus-within:opacity-100 transition-opacity pointer-events-none" />
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col gap-3">
          <Button
            size="lg"
            onClick={isScrapingActive ? onStopScrape : handleStartScrape}
            disabled={!url.trim() && !isScrapingActive}
            className={cn(
              "h-14 text-base font-semibold rounded-xl transition-all duration-300",
              isScrapingActive
                ? "bg-destructive hover:bg-destructive/90 text-destructive-foreground"
                : "bg-primary hover:bg-primary/90 text-primary-foreground hover:scale-[1.02]",
            )}
          >
            {isScrapingActive ? (
              <>
                <Square className="h-5 w-5 mr-2 fill-current" />
                Stop Scraping
              </>
            ) : (
              <>
                <Play className="h-5 w-5 mr-2 fill-current" />
                Start Scrape
              </>
            )}
          </Button>

          <Button
            size="lg"
            variant="outline"
            onClick={handleConnectSheets}
            disabled={sheetsConnected || isConnecting}
            className={cn(
              "h-14 text-base font-semibold rounded-xl border-border/50 transition-all duration-300",
              sheetsConnected
                ? "bg-green-500/10 border-green-500/30 text-green-400"
                : "hover:bg-secondary/50 hover:scale-[1.02]",
            )}
          >
            {isConnecting ? (
              <>
                <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                Connecting...
              </>
            ) : sheetsConnected ? (
              <>
                <Check className="h-5 w-5 mr-2" />
                Google Sheets Connected
              </>
            ) : (
              <>
                <FileSpreadsheet className="h-5 w-5 mr-2" />
                Connect Google Sheets
              </>
            )}
          </Button>
        </div>

        {/* Status indicators */}
        <div className="flex items-center gap-4 pt-4 border-t border-border/50">
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                isScrapingActive ? "bg-primary animate-pulse" : "bg-muted-foreground/30",
              )}
            />
            <span className="text-xs text-muted-foreground">{isScrapingActive ? "Scraping active" : "Ready"}</span>
          </div>
          <div className="flex items-center gap-2">
            <div
              className={cn(
                "h-2 w-2 rounded-full transition-colors",
                sheetsConnected ? "bg-green-500" : "bg-muted-foreground/30",
              )}
            />
            <span className="text-xs text-muted-foreground">
              {sheetsConnected ? "Sheets synced" : "Sheets disconnected"}
            </span>
          </div>
        </div>
      </div>
    </div>
  )
}

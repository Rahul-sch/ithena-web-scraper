"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { InputPanel } from "./input-panel"
import { ScrapingVisualizer } from "./scraping-visualizer"

export interface ScrapedItem {
  exhibitor: string
  booth: string
}

export function ScraperDashboard() {
  const [isScrapingActive, setIsScrapingActive] = useState(false)
  const [scrapedItems, setScrapedItems] = useState<ScrapedItem[]>([])
  const [totalCount, setTotalCount] = useState(0)
  const [sheetsConnected, setSheetsConnected] = useState(false)
  const eventSourceRef = useRef<EventSource | null>(null)

  const startScraping = useCallback(async (url: string) => {
    setIsScrapingActive(true)
    setScrapedItems([])
    setTotalCount(0)

    try {
      const response = await fetch('/api/scrape', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ url }),
      })

      const { jobId } = await response.json()

      // Connect to SSE stream
      const eventSource = new EventSource(`/api/scrape/stream?jobId=${jobId}`)
      eventSourceRef.current = eventSource

      eventSource.addEventListener('item', (e) => {
        const item = JSON.parse(e.data)
        setScrapedItems((prev) => [...prev, item])
      })

      eventSource.addEventListener('progress', (e) => {
        const { count } = JSON.parse(e.data)
        setTotalCount(count)
      })

      eventSource.addEventListener('done', (e) => {
        const { count } = JSON.parse(e.data)
        setTotalCount(count)
        setIsScrapingActive(false)
        eventSource.close()
      })

      eventSource.addEventListener('error', () => {
        setIsScrapingActive(false)
        eventSource.close()
      })
    } catch (error) {
      console.error('Failed to start scrape:', error)
      setIsScrapingActive(false)
    }
  }, [])

  const stopScraping = useCallback(() => {
    if (eventSourceRef.current) {
      eventSourceRef.current.close()
      eventSourceRef.current = null
    }
    setIsScrapingActive(false)
  }, [])

  const connectSheets = useCallback(async () => {
    try {
      const response = await fetch('/api/sheets/connect', { method: 'POST' })
      const { authUrl } = await response.json()
      window.location.href = authUrl
    } catch (error) {
      console.error('Failed to connect sheets:', error)
    }
  }, [])

  useEffect(() => {
    // Check if sheets connected from URL params
    const params = new URLSearchParams(window.location.search)
    if (params.get('sheets') === 'connected') {
      setSheetsConnected(true)
    }
  }, [])

  return (
    <section id="scraper" className="relative px-4 sm:px-6 lg:px-8 pb-24">
      <div className="mx-auto max-w-7xl">
        <div className="text-center mb-12">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground mb-3">Scrape Any Website</h2>
          <p className="text-muted-foreground max-w-xl mx-auto">
            Paste a URL and watch as our AI extracts structured data in real-time
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          <InputPanel
            onStartScrape={startScraping}
            onStopScrape={stopScraping}
            onConnectSheets={connectSheets}
            isScrapingActive={isScrapingActive}
            sheetsConnected={sheetsConnected}
          />
          <ScrapingVisualizer
            isActive={isScrapingActive}
            items={scrapedItems}
            totalCount={totalCount}
            sheetsConnected={sheetsConnected}
          />
        </div>
      </div>
    </section>
  )
}

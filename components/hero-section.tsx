"use client"

import { Button } from "@/components/ui/button"
import { ArrowRight, Sparkles } from "lucide-react"

export function HeroSection() {
  const scrollToScraper = () => {
    document.getElementById("scraper")?.scrollIntoView({ behavior: "smooth" })
  }

  return (
    <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background effects */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-radial from-primary/5 to-transparent rounded-full" />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
          <Sparkles className="h-4 w-4 text-primary" />
          <span className="text-sm font-medium text-primary">AI-Powered Web Scraping</span>
        </div>

        {/* Main heading */}
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-foreground mb-6 text-balance">
          Ithena Scraper —{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">
            The easiest way to scrape the web
          </span>{" "}
          into Google Sheets.
        </h1>

        {/* Subheading */}
        <p className="text-lg sm:text-xl text-muted-foreground mb-10 max-w-2xl mx-auto text-pretty">
          Paste any site. Watch it scrape. See your data appear live. Extract exhibitors, contacts, and more in seconds.
        </p>

        {/* CTA Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Button
            size="lg"
            onClick={scrollToScraper}
            className="group relative px-8 py-6 text-lg font-semibold bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl transition-all duration-300 hover:scale-105"
          >
            <span className="relative z-10 flex items-center gap-2">
              Start Scraping
              <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
            </span>
            <div className="absolute inset-0 rounded-xl bg-primary/50 blur-xl opacity-50 group-hover:opacity-75 transition-opacity" />
          </Button>

          <Button
            size="lg"
            variant="outline"
            className="px-8 py-6 text-lg font-semibold border-border/50 hover:bg-secondary/50 rounded-xl bg-transparent"
          >
            View Demo
          </Button>
        </div>

        {/* Trust indicators */}
        <div className="mt-16 flex flex-wrap items-center justify-center gap-8 text-muted-foreground">
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm">No code required</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm">JS-rendered sites</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse" />
            <span className="text-sm">Real-time sync</span>
          </div>
        </div>
      </div>
    </section>
  )
}

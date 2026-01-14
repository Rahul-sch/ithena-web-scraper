import { Navbar } from "@/components/navbar"
import { HeroSection } from "@/components/hero-section"
import { ScraperDashboard } from "@/components/scraper-dashboard"

export default function Home() {
  return (
    <main className="min-h-screen bg-background">
      <Navbar />
      <HeroSection />
      <ScraperDashboard />
    </main>
  )
}

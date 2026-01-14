import { chromium, type Page, type ElementHandle } from 'playwright';
import type { ScrapedItem, ScrapeJob } from './types';
import { getAdapter } from './adapters';

export class ScraperEngine {
  private jobs = new Map<string, ScrapeJob>();
  private callbacks = new Map<string, (item: ScrapedItem) => void>();

  async startScrape(jobId: string, url: string, onItem: (item: ScrapedItem) => void): Promise<void> {
    const job: ScrapeJob = {
      id: jobId,
      url,
      status: 'running',
      items: [],
      count: 0,
      lastItem: null,
    };

    this.jobs.set(jobId, job);
    this.callbacks.set(jobId, onItem);

    try {
      await this.scrape(jobId, url);
      job.status = 'completed';
    } catch (error) {
      job.status = 'error';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      console.error('Scrape error:', error);
    } finally {
      this.callbacks.delete(jobId);
    }
  }

  private async scrape(jobId: string, url: string): Promise<void> {
    const adapter = getAdapter(url);
    console.log(`[Scraper] Using adapter: ${adapter.name} for ${url}`);

    const browser = await chromium.launch({ headless: true });
    const context = await browser.newContext({
      userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0.0.0 Safari/537.36'
    });
    const page = await context.newPage();

    try {
      await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
      await page.waitForTimeout(3000);

      // Scroll until stable
      await this.scrollUntilStable(page, adapter);

      // Extract all items using DOM
      const cards = await page.$$(adapter.cardSelector);
      console.log(`[Scraper] Found ${cards.length} cards`);

      const seen = new Set<string>();

      for (const card of cards) {
        try {
          const item = await this.extractItemFromCard(card, adapter);

          if (item && item.exhibitor && item.exhibitor.length > 1) {
            const key = `${item.exhibitor}-${item.booth}`.toLowerCase();
            if (!seen.has(key)) {
              seen.add(key);
              this.emitItem(jobId, item);
              console.log(`[Scraper] Emitted: ${item.exhibitor} | ${item.booth}`);
              await new Promise(resolve => setTimeout(resolve, 30)); // Throttle
            }
          }
        } catch (err) {
          // Skip individual card errors
        }
      }

      console.log(`[Scraper] Completed: ${seen.size} unique exhibitors`);
    } finally {
      await browser.close();
    }
  }

  private async extractItemFromCard(card: ElementHandle, adapter: any): Promise<ScrapedItem | null> {
    let exhibitor = '';
    let booth = '-';

    // Try to get exhibitor name from various selectors
    for (const sel of adapter.nameSelectors) {
      try {
        const elem = await card.$(sel);
        if (elem) {
          const text = await elem.innerText();
          if (text && text.trim().length > 1) {
            exhibitor = text.trim().split('\n')[0].trim();
            break;
          }
        }
      } catch {}
    }

    // If no name found, try getting text content
    if (!exhibitor) {
      try {
        const text = await card.innerText();
        const lines = text.split('\n').filter((l: string) => l.trim().length > 2);
        if (lines.length > 0) {
          exhibitor = lines[0].trim();
        }
      } catch {}
    }

    // Try to get booth number
    for (const sel of adapter.boothSelectors) {
      try {
        const elem = await card.$(sel);
        if (elem) {
          const text = await elem.innerText();
          if (text && text.trim()) {
            booth = text.trim();
            break;
          }
        }
      } catch {}
    }

    // Fallback: look for booth pattern in text
    if (booth === '-') {
      try {
        const text = await card.innerText();
        // Look for booth patterns like "Booth: A123" or standalone "A123" or "123"
        const boothMatch = text.match(/booth[:\s]*([A-Z0-9-]+)/i)
          || text.match(/\b([A-Z]\d{2,4})\b/)
          || text.match(/\b(\d{4,6})\b/);
        if (boothMatch) {
          booth = boothMatch[1];
        }
      } catch {}
    }

    // Clean up exhibitor name
    exhibitor = exhibitor.replace(/<[^>]+>/g, '').trim();

    if (!exhibitor || exhibitor.length < 2) return null;

    return { exhibitor, booth };
  }

  private async scrollUntilStable(page: Page, adapter: any): Promise<void> {
    let lastCount = 0;
    let stableCount = 0;
    let scrolls = 0;

    while (scrolls < adapter.maxScrollAttempts) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(adapter.scrollPause);

      const currentCount = await page.$$(adapter.cardSelector).then(c => c.length);

      if (currentCount > lastCount) {
        console.log(`[Scraper] Loaded ${currentCount} items`);
        lastCount = currentCount;
        stableCount = 0;
      } else {
        stableCount++;
        if (stableCount >= 3) {
          console.log('[Scraper] Scroll stabilized');
          break;
        }
      }

      scrolls++;
    }
  }

  private emitItem(jobId: string, item: ScrapedItem): void {
    const job = this.jobs.get(jobId);
    const callback = this.callbacks.get(jobId);

    if (job && callback) {
      job.items.push(item);
      job.count++;
      job.lastItem = item;
      callback(item);
    }
  }

  getJob(jobId: string): ScrapeJob | undefined {
    return this.jobs.get(jobId);
  }

  getAllJobs(): ScrapeJob[] {
    return Array.from(this.jobs.values());
  }
}

export const scraperEngine = new ScraperEngine();

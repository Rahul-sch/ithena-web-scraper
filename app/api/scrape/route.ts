import { NextRequest, NextResponse } from 'next/server';
import { scraperEngine } from '@/lib/scraper/engine';
import { sheetsClient } from '@/lib/sheets/client';

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json();

    if (!url || typeof url !== 'string') {
      return NextResponse.json({ error: 'Invalid URL' }, { status: 400 });
    }

    const jobId = `job-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;

    // Start scraping in background
    scraperEngine.startScrape(jobId, url, async (item) => {
      // Append to sheets if connected
      if (sheetsClient.isConnected()) {
        await sheetsClient.appendRow(item);
      }
    }).catch(console.error);

    return NextResponse.json({ jobId, status: 'started' });
  } catch (error) {
    console.error('Scrape API error:', error);
    return NextResponse.json(
      { error: 'Failed to start scrape' },
      { status: 500 }
    );
  }
}

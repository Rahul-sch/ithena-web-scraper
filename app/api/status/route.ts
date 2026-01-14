import { NextResponse } from 'next/server';
import { scraperEngine } from '@/lib/scraper/engine';

export async function GET() {
  const jobs = scraperEngine.getAllJobs();
  const runningJob = jobs.find(j => j.status === 'running');

  if (runningJob) {
    return NextResponse.json({
      running: true,
      count: runningJob.count,
      lastItem: runningJob.lastItem,
    });
  }

  return NextResponse.json({
    running: false,
    count: 0,
    lastItem: null,
  });
}

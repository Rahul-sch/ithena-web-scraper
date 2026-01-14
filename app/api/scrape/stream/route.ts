import { NextRequest } from 'next/server';
import { scraperEngine } from '@/lib/scraper/engine';

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const jobId = searchParams.get('jobId');

  if (!jobId) {
    return new Response('Missing jobId', { status: 400 });
  }

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    async start(controller) {
      const sendEvent = (event: string, data: any) => {
        const message = `event: ${event}\ndata: ${JSON.stringify(data)}\n\n`;
        controller.enqueue(encoder.encode(message));
      };

      // Send initial state
      const job = scraperEngine.getJob(jobId);
      if (!job) {
        sendEvent('error', { message: 'Job not found' });
        controller.close();
        return;
      }

      // Send existing items
      for (const item of job.items) {
        sendEvent('item', item);
        sendEvent('progress', { count: job.count });
      }

      // Poll for updates
      const interval = setInterval(() => {
        const currentJob = scraperEngine.getJob(jobId);
        if (!currentJob) {
          clearInterval(interval);
          controller.close();
          return;
        }

        // Send new items
        const newItems = currentJob.items.slice(job.items.length);
        for (const item of newItems) {
          sendEvent('item', item);
        }

        if (newItems.length > 0) {
          sendEvent('progress', { count: currentJob.count });
          job.items.push(...newItems);
        }

        if (currentJob.status === 'completed') {
          sendEvent('done', { count: currentJob.count });
          clearInterval(interval);
          controller.close();
        } else if (currentJob.status === 'error') {
          sendEvent('error', { message: currentJob.error });
          clearInterval(interval);
          controller.close();
        }
      }, 500);

      // Cleanup on close
      request.signal.addEventListener('abort', () => {
        clearInterval(interval);
        controller.close();
      });
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}

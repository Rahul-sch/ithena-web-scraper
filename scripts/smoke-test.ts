import { chromium } from 'playwright';
import { getAdapter } from '../lib/scraper/adapters';

const TEST_URLS = [
  'https://directory.imts.com/8_0/explore/exhibitor-gallery.cfm?featured=false',
  'https://www.interphex.com/en-us/show-info/exhibitor-list.html#/',
  'https://www.pack-expo.com/en-us/exhibit/exhibitor-list.html', // Third test site
];

async function testScraper(url: string) {
  console.log(`\n${'='.repeat(60)}`);
  console.log(`Testing: ${url}`);
  console.log('='.repeat(60));

  const adapter = getAdapter(url);
  console.log(`Adapter: ${adapter.name}`);

  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  try {
    await page.goto(url, { waitUntil: 'networkidle', timeout: 60000 });
    await page.waitForTimeout(3000);

    // Try scrolling
    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => window.scrollTo(0, document.body.scrollHeight));
      await page.waitForTimeout(2000);
    }

    const cards = await page.$$(adapter.cardSelector);
    console.log(`\nFound ${cards.length} exhibitor cards`);

    if (cards.length === 0) {
      console.warn('⚠️  No cards found! Selector may be incorrect.');
      return;
    }

    console.log('\nFirst 5 exhibitors:');
    const items = [];

    for (let i = 0; i < Math.min(5, cards.length); i++) {
      const html = await cards[i].innerHTML();
      const item = adapter.extractItem(html);
      if (item) {
        items.push(item);
        console.log(`  ${i + 1}. ${item.exhibitor} | ${item.booth}`);
      }
    }

    console.log(`\n✅ Extraction successful: ${items.length}/5 items`);
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await browser.close();
  }
}

async function main() {
  console.log('Ithena Scraper - Smoke Test\n');

  for (const url of TEST_URLS) {
    try {
      await testScraper(url);
    } catch (error) {
      console.error(`Failed to test ${url}:`, error);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('Smoke test complete');
  console.log('='.repeat(60) + '\n');
}

main().catch(console.error);

export interface ScrapedItem {
  exhibitor: string;
  booth: string;
}

export interface ScrapeJob {
  id: string;
  url: string;
  status: 'running' | 'completed' | 'error';
  items: ScrapedItem[];
  count: number;
  lastItem: ScrapedItem | null;
  error?: string;
}

export interface SiteAdapter {
  name: string;
  matches: (url: string) => boolean;
  cardSelector: string;
  nameSelectors: string[];
  boothSelectors: string[];
  scrollBehavior: 'infinite' | 'pagination';
  maxScrollAttempts: number;
  scrollPause: number;
  extractItem: (cardHtml: string) => ScrapedItem | null;
}

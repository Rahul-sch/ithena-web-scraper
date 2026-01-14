import type { SiteAdapter, ScrapedItem } from './types';

export const IMTS_ADAPTER: SiteAdapter = {
  name: 'IMTS',
  matches: (url: string) => url.includes('directory.imts.com'),
  cardSelector: 'li.js-Card.card',
  nameSelectors: ['.card-Title', 'h3', '.company-name', 'a span'],
  boothSelectors: ['.booth', '[class*="booth"]'],
  scrollBehavior: 'infinite',
  maxScrollAttempts: 100,
  scrollPause: 2000,
  extractItem: () => null, // Using DOM extraction now
};

export const INTERPHEX_ADAPTER: SiteAdapter = {
  name: 'Interphex',
  matches: (url: string) => url.includes('interphex.com'),
  cardSelector: '.m-exhibitors-list__items__item',
  nameSelectors: ['.m-exhibitors-list__items__item__header__title', 'h3', 'h2', '.title', '.name'],
  boothSelectors: ['.m-exhibitors-list__items__item__header__stand', '.booth', '.stand', '[class*="booth"]', '[class*="stand"]'],
  scrollBehavior: 'infinite',
  maxScrollAttempts: 100,
  scrollPause: 2000,
  extractItem: () => null,
};

export const GENERIC_ADAPTER: SiteAdapter = {
  name: 'Generic',
  matches: () => true,
  cardSelector: '.exhibitor, .company, .vendor, .directory-item, [class*="exhibitor"], [class*="card"], li.card, .list-item',
  nameSelectors: ['h1', 'h2', 'h3', 'h4', '.title', '.name', '.company', '.company-name', 'a'],
  boothSelectors: ['.booth', '.stand', '.location', '[class*="booth"]', '[class*="stand"]'],
  scrollBehavior: 'infinite',
  maxScrollAttempts: 60,
  scrollPause: 2000,
  extractItem: () => null,
};

export const ADAPTERS = [IMTS_ADAPTER, INTERPHEX_ADAPTER, GENERIC_ADAPTER];

export function getAdapter(url: string): SiteAdapter {
  return ADAPTERS.find(a => a.matches(url)) || GENERIC_ADAPTER;
}

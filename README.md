# Ithena Scraper Engine

The easiest, coolest web scraping SaaS. Paste any website. Watch it scrape. See data appear live in Google Sheets.

## Setup

### 1. Install Dependencies

```bash
npm install
npx playwright install chromium
```

### 2. Configure Google Sheets (Optional)

Create a Google Cloud Project and OAuth 2.0 credentials:

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable Google Sheets API
4. Create OAuth 2.0 Client ID (Web application)
5. Add authorized redirect URI: `http://localhost:3000/api/sheets/callback`
6. Copy credentials to `.env`:

```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```
GOOGLE_CLIENT_ID=your_client_id.apps.googleusercontent.com
GOOGLE_CLIENT_SECRET=your_client_secret
GOOGLE_REDIRECT_URI=http://localhost:3000/api/sheets/callback
```

### 3. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## Testing

Run smoke test on all supported sites:

```bash
npm run smoke-test
```

This tests scraping on:
- IMTS
- Interphex
- Pack Expo

## How It Works

1. User pastes URL and clicks "Start Scrape"
2. Backend launches Playwright, scrolls until stable
3. Extracts exhibitor name + booth number
4. Streams results live via SSE to frontend
5. Optionally appends rows to Google Sheets in real-time

## Supported Sites

- **IMTS**: https://directory.imts.com/
- **Interphex**: https://www.interphex.com/
- **Pack Expo**: https://www.pack-expo.com/
- **Generic**: Best-effort extraction for any directory site

## API Endpoints

- `POST /api/scrape` - Start scrape job
- `GET /api/scrape/stream?jobId=<id>` - SSE stream of results
- `GET /api/status` - Current scrape status
- `POST /api/sheets/connect` - Get Google OAuth URL
- `GET /api/sheets/callback` - OAuth callback handler

## Architecture

```
lib/
  scraper/
    types.ts        - TypeScript interfaces
    adapters.ts     - Site-specific extraction logic
    engine.ts       - Core scraping engine
  sheets/
    client.ts       - Google Sheets integration

app/api/
  scrape/
    route.ts        - Start scrape endpoint
    stream/
      route.ts      - SSE streaming endpoint
  status/
    route.ts        - Status check endpoint
  sheets/
    connect/
      route.ts      - OAuth URL generator
    callback/
      route.ts      - OAuth callback handler
```

## Adding New Sites

Edit `lib/scraper/adapters.ts`:

```typescript
export const YOUR_SITE_ADAPTER: SiteAdapter = {
  name: 'YourSite',
  matches: (url) => url.includes('yoursite.com'),
  cardSelector: '.exhibitor-card',
  nameSelectors: ['.company-name'],
  boothSelectors: ['.booth'],
  scrollBehavior: 'infinite',
  maxScrollAttempts: 80,
  scrollPause: 2000,
  extractItem: (html) => {
    // Custom extraction logic
    return { exhibitor: 'name', booth: '123' };
  }
};
```

Add to `ADAPTERS` array.

## Production Deployment

1. Set environment variables in Vercel
2. Deploy: `vercel --prod`
3. Update `GOOGLE_REDIRECT_URI` to production URL

## License

MIT

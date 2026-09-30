# NEWSEDGE Automatic News Engine — v0.2

## What this version does
- Reads RSS feeds on demand.
- Deduplicates by feed item ID/link.
- Stores headline, source, date, category, source URL and a short feed-provided snippet.
- Serves `/api/news` and a mobile-friendly website.
- Refreshes the browser every minute.
- Keeps feed configuration in `feeds.json`, so sources can be changed without changing the application.

## Run locally
Requires Node.js 18+.

```bash
npm install
npm run fetch
npm start
```

Then open http://localhost:3000

## Automatic production schedule
Run `npm run fetch` every 10–15 minutes using a server cron, GitHub Actions, or a scheduled cloud job.

## Important publishing rule
This starter intentionally does NOT copy full articles. Before commercial/public publication, confirm each provider's licensing/terms. Some RSS providers permit personal RSS consumption but restrict commercial republication. Prefer licensed feeds/APIs or public-domain/government feeds.

## Next engineering stage
1. PostgreSQL/Supabase instead of data.json.
2. AI summarisation endpoint.
3. Duplicate/near-duplicate detection.
4. Editorial approval workflow.
5. Image licensing/metadata.
6. SEO pages and sitemap.
7. Push notifications.
8. Scheduled deployment.

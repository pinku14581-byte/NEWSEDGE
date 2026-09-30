# NEWSEDGE Automatic News Engine — v0.4

A mobile-first, feed-driven news dashboard for NEWSEDGE.

## Included
- RSS ingestion with deduplication and source attribution
- India, Odisha, Legal, Cricket and World feed groups
- JSON persistence for a simple zero-config deployment
- Automatic fetch every 15 minutes while the Node process is running
- Manual `POST /api/fetch` endpoint
- Search and category filtering
- Editorial fields: `status`, `published`, `summary`, `title`, `category`
- Individual `/news/:id` pages with canonical/OG metadata
- `/sitemap.xml` for published stories
- `/api/health`, `/api/news`, `/api/categories`

## Run
Requires Node.js 18+.

```bash
npm install
npm run fetch
npm start
```

Open http://localhost:3000.

## Production
Keep the process alive with your hosting provider or process manager. The app fetches feeds every 15 minutes. You can also call `POST /api/fetch` from a scheduled cloud job.

For scale, replace `data.json` with PostgreSQL/Supabase and put the fetch worker on a scheduled job. The API structure is intentionally small so that migration is straightforward.

## Publishing safeguards
This project stores headlines and short feed-provided snippets; it does not copy full articles. Before commercial/public publication, confirm each provider's licensing/terms. Prefer licensed feeds/APIs or public-domain/government feeds.

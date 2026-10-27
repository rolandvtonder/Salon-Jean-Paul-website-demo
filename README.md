# Salon Jean Paul N1 City Barbers — website demo

Demo website for Salon Jean Paul N1 City Barbers, Shop 76, N1 City Mall, Cape Town.

- **Home:** a scroll-driven scene over the shop's own photos, then links to each page
- **Pages:** Services & prices, Weekly specials, Meet the barbers, Gallery, Careers, Visit
- Navy and gold, from the Jean Paul Barbers logo; works on phones, tablets and desktop

Built with Vite, React, TypeScript, Tailwind CSS and Motion.

## Run it locally

```bash
npm install
npm run dev
```

Then open http://localhost:5173.

## Build and publish

```bash
npm run build
```

This writes the finished site to `dist/`. Each page gets its own HTML file with its own title and description. Upload `dist/` to any static host. On Netlify, `public/_redirects` sends unknown addresses to the app.

## Editing content

Prices, specials, barbers, phone numbers, the booking link and page text all live in `src/content.ts`.

Once the site has its domain, set `SITE_URL` in `src/content.ts`. The build then adds a sitemap, canonical links and full-address link previews.

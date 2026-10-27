import { defineConfig, type Plugin } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { mkdirSync, readFileSync, writeFileSync } from 'node:fs'
import { join } from 'node:path'
import { HOME_DESC, HOME_TITLE, PAGES, SITE_NAME, SITE_URL } from './src/content'

/*
  After the build, write one HTML file per page (dist/services/index.html …)
  carrying that page's own title, description and preview tags. The app is a
  single bundle, but crawlers and WhatsApp/Facebook link previews read the
  HTML without running it, so each address needs its own head. Also writes
  robots.txt, and a sitemap once SITE_URL is set in src/content.ts.
*/
function pageHeads(): Plugin {
  let outDir = 'dist'
  const esc = (v: string) => v.replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;')
  const head = (html: string, path: string, title: string, desc: string) => {
    let out = html
      .replace(/<title>[^<]*<\/title>/, `<title>${esc(title)}</title>`)
      .replace(/(<meta name="description"\s+content=")[^"]*(")/, `$1${esc(desc)}$2`)
      .replace(/(<meta property="og:title" content=")[^"]*(")/, `$1${esc(title)}$2`)
      .replace(/(<meta property="og:description" content=")[^"]*(")/, `$1${esc(desc)}$2`)
    /* the shopfront preload only feeds the home page's scene */
    if (path !== '/') out = out.replace(/\s*<link rel="preload" as="image"[^>]*>/, '')
    if (SITE_URL) {
      const url = SITE_URL + (path === '/' ? '/' : path)
      out = out
        .replace(/(<meta property="og:image" content=")\//, `$1${SITE_URL}/`)
        .replace('</title>', `</title>\n    <link rel="canonical" href="${url}" />\n    <meta property="og:url" content="${url}" />`)
    }
    return out
  }
  return {
    name: 'page-heads',
    apply: 'build',
    configResolved(c) {
      outDir = c.build.outDir
    },
    closeBundle() {
      const base = readFileSync(join(outDir, 'index.html'), 'utf8')
      writeFileSync(join(outDir, 'index.html'), head(base, '/', HOME_TITLE, HOME_DESC))
      for (const p of PAGES) {
        const dir = join(outDir, p.path.slice(1))
        mkdirSync(dir, { recursive: true })
        writeFileSync(join(dir, 'index.html'), head(base, p.path, `${p.doc} | ${SITE_NAME}`, p.desc))
      }
      if (SITE_URL) {
        const urls = ['/', ...PAGES.map((p) => p.path)]
          .map((u) => `  <url><loc>${SITE_URL}${u}</loc></url>`)
          .join('\n')
        writeFileSync(
          join(outDir, 'sitemap.xml'),
          `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls}\n</urlset>\n`,
        )
        writeFileSync(join(outDir, 'robots.txt'), `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`)
      } else {
        writeFileSync(join(outDir, 'robots.txt'), 'User-agent: *\nAllow: /\n')
        this.warn('SITE_URL is empty in src/content.ts: no sitemap or canonical links written')
      }
    },
  }
}

export default defineConfig({
  plugins: [react(), tailwindcss(), pageHeads()],
})

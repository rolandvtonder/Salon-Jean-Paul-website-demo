import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

/*
  A tiny router: the History API and one hook. The site has seven fixed
  pages, which does not earn a routing library. Each page also has its own
  built HTML file (see vite.config.ts), so any host serves real addresses;
  unknown ones fall back to 404.html (GitHub Pages) or _redirects (Netlify).
*/

const EVENT = 'locationchange'

/* The base the site is served from: '/' normally, '/<repo>/' on GitHub
   Pages. App code always speaks in root paths ('/services'); only the
   address bar and the rendered hrefs carry the base. */
const BASE = import.meta.env.BASE_URL.replace(/\/$/, '')

export const withBase = (path: string) => (path.startsWith('/') ? BASE + path : path)

const appPath = (pathname: string) => {
  const p = BASE && pathname.startsWith(BASE) ? pathname.slice(BASE.length) || '/' : pathname
  return p.replace(/(.)\/+$/, '$1')
}

const subscribe = (cb: () => void) => {
  window.addEventListener('popstate', cb)
  window.addEventListener(EVENT, cb)
  return () => {
    window.removeEventListener('popstate', cb)
    window.removeEventListener(EVENT, cb)
  }
}

/** Current path, without a trailing slash (except the root). */
export function usePath() {
  return useSyncExternalStore(subscribe, () => appPath(window.location.pathname))
}

export function navigate(to: string) {
  if (to === appPath(window.location.pathname)) return
  window.history.pushState(null, '', withBase(to))
  window.dispatchEvent(new Event(EVENT))
  /* a new page starts at its top, not wherever the last one was left */
  window.scrollTo({ top: 0, behavior: 'instant' })
}

/** An ordinary link for internal paths; modified clicks still open tabs. */
export function Link({ href, onClick, ...rest }: AnchorHTMLAttributes<HTMLAnchorElement> & { href: string }) {
  const handle = (e: MouseEvent<HTMLAnchorElement>) => {
    onClick?.(e)
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return
    if (!href.startsWith('/')) return
    e.preventDefault()
    navigate(href)
  }
  return <a href={withBase(href)} onClick={handle} {...rest} />
}

import { useSyncExternalStore, type AnchorHTMLAttributes, type MouseEvent } from 'react'

/*
  A tiny router: the History API and one hook. The site has seven fixed
  pages, which does not earn a routing library. The host must serve
  index.html for unknown paths (public/_redirects does that on Netlify; the
  Vite dev server already does).
*/

const EVENT = 'locationchange'

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
  return useSyncExternalStore(subscribe, () => window.location.pathname.replace(/(.)\/+$/, '$1'))
}

export function navigate(to: string) {
  if (to === window.location.pathname + window.location.hash) return
  window.history.pushState(null, '', to)
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
  return <a href={href} onClick={handle} {...rest} />
}

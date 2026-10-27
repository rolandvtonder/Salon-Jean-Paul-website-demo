import { useEffect, useState } from 'react'
import { useScroll, useMotionValueEvent } from 'motion/react'
import { Mark } from './Logo'
import { BOOKING, NAV } from './content'
import { Link, usePath } from './router'

/*
  The navbar sits outside the scaled artboard, at natural size, so it stays
  readable at any width. Over the scene and the page banners it is the
  reference's gradient (a solid bar would draw a hard seam across the
  photos); once the page reaches content it settles into a solid blurred bar
  with a hairline. The current page's link carries a gold underline.
*/
export default function Nav() {
  const [solid, setSolid] = useState(false)
  const [open, setOpen] = useState(false)
  const { scrollY } = useScroll()
  const path = usePath()

  /* past the scene on the home page; past most of the banner elsewhere */
  const check = (y: number) => {
    const stage = document.getElementById('top')
    const end = stage ? stage.offsetHeight - window.innerHeight : window.innerHeight * 0.35
    setSolid(y > end - 40)
  }
  useMotionValueEvent(scrollY, 'change', check)
  useEffect(() => {
    setOpen(false)
    check(window.scrollY)
  }, [path])

  useEffect(() => {
    if (!open) return
    const onKey = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [open])

  const bar = solid || open

  return (
    <header style={{ position: 'fixed', inset: '0 0 auto 0', zIndex: 50 }}>
      {/* the gradient over the scene, fading with its own blur */}
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: '0 0 auto 0',
          height: 132,
          background: 'linear-gradient(180deg, rgba(8,12,20,0.8) 0%, rgba(8,12,20,0.42) 46%, rgba(8,12,20,0) 100%)',
          backdropFilter: 'blur(10px)',
          WebkitBackdropFilter: 'blur(10px)',
          maskImage: 'linear-gradient(180deg, #000 0%, #000 42%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(180deg, #000 0%, #000 42%, transparent 100%)',
          opacity: bar ? 0 : 1,
          transition: 'opacity 300ms ease',
          pointerEvents: 'none',
        }}
      />
      <div
        aria-hidden="true"
        style={{
          position: 'absolute',
          inset: 0,
          background: 'rgba(10,15,25,0.86)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          borderBottom: '1px solid rgba(255,255,255,0.08)',
          opacity: bar ? 1 : 0,
          transition: 'opacity 300ms ease',
          pointerEvents: 'none',
        }}
      />

      <nav
        aria-label="Main"
        style={{
          position: 'relative',
          display: 'flex',
          alignItems: 'center',
          gap: 'clamp(10px, 2.4vw, 32px)',
          padding: '0 clamp(16px, 3vw, 40px)',
          height: 76,
        }}
      >
        <Link href="/" aria-label="Salon Jean Paul N1 City, home" style={{ display: 'flex', alignItems: 'center', gap: 12, color: '#fff', textDecoration: 'none' }}>
          <Mark size={30} accent />
          <span style={{ display: 'flex', flexDirection: 'column', gap: 3, whiteSpace: 'nowrap' }}>
            <span className="display" style={{ fontSize: 16, lineHeight: 1, fontVariationSettings: '"wdth" 125, "wght" 700' }}>
              Jean Paul
            </span>
            <span className="label" style={{ fontSize: 9.5, color: 'rgba(255,255,255,0.65)' }}>
              N1 City Barbers
            </span>
          </span>
        </Link>

        <ul className="nav-links" style={{ flex: 1, display: 'flex', justifyContent: 'center', gap: 'clamp(24px, 3.4vw, 52px)', listStyle: 'none', margin: 0, padding: 0 }}>
          {NAV.map((n) => (
            <li key={n.t}>
              <Link
                href={n.href}
                aria-current={path === n.href ? 'page' : undefined}
                className="label transition-colors duration-200 hover:text-[var(--color-gold-soft)]"
                style={{
                  color: path === n.href ? '#fff' : 'rgba(255,255,255,0.82)',
                  textDecoration: 'none',
                  padding: '12px 2px',
                  borderBottom: `1px solid ${path === n.href ? 'var(--color-gold)' : 'transparent'}`,
                }}
              >
                {n.t}
              </Link>
            </li>
          ))}
        </ul>

        <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: 10 }}>
          <a className="btn btn-gold" href={BOOKING.href} target="_blank" rel="noopener" style={{ minHeight: 44, padding: '0 clamp(14px, 3vw, 20px)' }}>
            {BOOKING.label}
          </a>
          <button
            type="button"
            className="nav-menu-btn"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((o) => !o)}
            style={{
              width: 44,
              height: 44,
              borderRadius: 999,
              border: '1px solid rgba(255,255,255,0.35)',
              background: 'transparent',
              color: '#fff',
              display: 'grid',
              placeItems: 'center',
              cursor: 'pointer',
            }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true">
              {open ? (
                <path d="M4 4l10 10M14 4L4 14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              ) : (
                <path d="M2 5h14M2 9h14M2 13h14" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul
          id="mobile-menu"
          style={{
            position: 'relative',
            listStyle: 'none',
            margin: 0,
            padding: '8px 20px 24px',
            display: 'grid',
            gap: 4,
          }}
        >
          {NAV.map((n) => (
            <li key={n.t}>
              <Link
                href={n.href}
                aria-current={path === n.href ? 'page' : undefined}
                className="display"
                style={{
                  color: path === n.href ? 'var(--color-gold)' : '#fff',
                  display: 'block',
                  padding: '14px 0',
                  fontSize: 24,
                  textDecoration: 'none',
                  borderBottom: '1px solid rgba(255,255,255,0.08)',
                  fontVariationSettings: '"wdth" 125, "wght" 600',
                }}
              >
                {n.t}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </header>
  )
}

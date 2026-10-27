import { useEffect, type ComponentType } from 'react'
import { useReducedMotion, motion } from 'motion/react'
import { Link } from './router'
import { photo, photoSet, SIZES } from './img'
import { HOME_DESC, HOME_TITLE, PAGES, SITE_NAME, type Page } from './content'
import { Barbers, Careers, Eyebrow, Gallery, Reveal, Services, Specials, Visit, Wrap } from './Sections'

/*
  Page furniture. Every section page opens on a banner cut from the scene:
  one of the shop's photos under the same scrim, the eyebrow chip, a wide
  display h1 and a lead. It closes on a link to the next page, so the pages
  still read in order the way the single page did.
*/

const GOLD = 'var(--color-gold)'

const BODIES: Record<string, ComponentType> = {
  '/services': Services,
  '/specials': Specials,
  '/barbers': Barbers,
  '/gallery': Gallery,
  '/careers': Careers,
  '/visit': Visit,
}

/** Title and description for the page on screen; the build writes the same
    values into each page's own HTML file for crawlers and link previews. */
export function useDocTitle(title?: string, desc?: string) {
  useEffect(() => {
    const full = title ? `${title} | ${SITE_NAME}` : HOME_TITLE
    const d = desc ?? HOME_DESC
    document.title = full
    const set = (sel: string, v: string) => document.head.querySelector(sel)?.setAttribute('content', v)
    set('meta[name="description"]', d)
    set('meta[property="og:title"]', full)
    set('meta[property="og:description"]', d)
  }, [title, desc])
}

function Arrow({ size = 14 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true">
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function PageHero({ page }: { page: Page }) {
  const reduce = useReducedMotion()
  return (
    <header className="relative overflow-hidden flex items-end" style={{ minHeight: 'max(440px, 62svh)' }}>
      <motion.img
        src={photo(page.photo)}
        srcSet={photoSet(page.photo)}
        sizes={SIZES.full}
        alt=""
        aria-hidden="true"
        className="absolute inset-0 w-full h-full object-cover"
        style={{ objectPosition: page.pos }}
        initial={reduce ? false : { scale: 1.12 }}
        animate={{ scale: 1 }}
        transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
      />
      <div
        aria-hidden="true"
        className="absolute inset-0"
        style={{
          background:
            'linear-gradient(90deg, rgba(8,12,20,0.88) 0%, rgba(8,12,20,0.55) 45%, rgba(8,12,20,0.2) 100%), linear-gradient(180deg, rgba(8,12,20,0.55) 0%, rgba(8,12,20,0) 30%, rgba(8,12,20,0) 55%, var(--color-ink) 100%)',
        }}
      />
      <div className="relative w-full px-5 md:px-10 pt-32 pb-12 md:pb-16">
        <div className="mx-auto max-w-[1248px]">
          <nav aria-label="Breadcrumb" className="label mb-6" style={{ color: 'rgba(255,255,255,0.65)' }}>
            <Link href="/" className="hover:text-[var(--color-gold-soft)] transition-colors" style={{ color: 'inherit', textDecoration: 'none' }}>
              Home
            </Link>
            <span aria-hidden="true" style={{ margin: '0 10px', color: GOLD }}>
              /
            </span>
            <span aria-current="page" style={{ color: '#fff' }}>
              {page.nav}
            </span>
          </nav>
          <Reveal>
            <Eyebrow>{page.eyebrow}</Eyebrow>
            <h1 className="display mt-5 mb-0 text-[clamp(40px,7vw,88px)] max-w-[900px]">
              {page.title}
              {page.soft && (
                <>
                  {' '}
                  <span style={{ fontVariationSettings: '"wdth" 125, "wght" 350', color: 'rgba(255,255,255,0.75)' }}>{page.soft}</span>
                </>
              )}
            </h1>
            <p className="mt-5 mb-0 text-[17px] md:text-[19px] leading-[1.6] max-w-[620px]" style={{ color: 'rgba(255,255,255,0.86)' }}>
              {page.lead}
            </p>
          </Reveal>
        </div>
      </div>
    </header>
  )
}

/** The foot of every page: the next one in the chain, as a single wide link. */
function NextPage({ page }: { page: Page }) {
  const i = PAGES.indexOf(page)
  const next = PAGES[(i + 1) % PAGES.length]
  return (
    <Wrap>
      <Reveal>
        <Link
          href={next.path}
          className="group relative flex items-center gap-6 overflow-hidden rounded-[36px] md:rounded-[46px] p-7 md:p-10 panel"
          style={{ color: '#fff', textDecoration: 'none' }}
        >
          <img
            src={photo(next.photo)}
            srcSet={photoSet(next.photo)}
            sizes={SIZES.wide}
            alt=""
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover opacity-30 transition-[opacity,transform] duration-500 group-hover:opacity-45 group-hover:scale-105"
            style={{ objectPosition: next.pos }}
          />
          <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(90deg, rgba(14,20,31,0.95) 20%, rgba(14,20,31,0.4) 100%)' }} />
          <div className="relative">
            <span className="label" style={{ color: GOLD }}>
              Next
            </span>
            <div className="display mt-3 text-[clamp(28px,4.4vw,52px)]">{next.eyebrow}</div>
          </div>
          <span
            className="relative ml-auto shrink-0 grid place-items-center rounded-full transition-colors duration-300 group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-ink)]"
            style={{ width: 64, height: 64, border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.12)' }}
          >
            <Arrow size={18} />
          </span>
        </Link>
      </Reveal>
    </Wrap>
  )
}

export function SectionPage({ page }: { page: Page }) {
  useDocTitle(page.doc, page.desc)
  const Body = BODIES[page.path]
  return (
    <>
      <PageHero page={page} />
      <main id="main">
        <Body />
        <NextPage page={page} />
      </main>
    </>
  )
}

/** After the scene on the home page: one card per page. */
export function HomeIndex() {
  return (
    <main id="main" tabIndex={-1} style={{ outline: 'none' }}>
      <Wrap>
        <Reveal className="max-w-[760px]">
          <Eyebrow>Explore</Eyebrow>
          <h2 className="display mt-5 mb-0 text-[clamp(36px,6vw,64px)]">Find your way around</h2>
        </Reveal>
        <ul className="mt-12 mb-0 p-0 list-none grid gap-4 md:gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {PAGES.map((p, i) => (
            <Reveal as="li" key={p.path} delay={(i % 3) * 0.06}>
              <Link
                href={p.path}
                className="group relative flex flex-col justify-end overflow-hidden rounded-[36px] md:rounded-[46px] min-h-[300px] p-7"
                style={{ color: '#fff', textDecoration: 'none' }}
              >
                <img
                  src={photo(p.photo)}
                  srcSet={photoSet(p.photo)}
                  sizes={SIZES.card}
                  alt=""
                  loading="lazy"
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  style={{ objectPosition: p.pos }}
                />
                <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,12,20,0.15) 0%, rgba(8,12,20,0.55) 45%, rgba(8,12,20,0.94) 100%)' }} />
                <div aria-hidden="true" className="absolute inset-0 rounded-[inherit] pointer-events-none" style={{ border: '1px solid rgba(255,255,255,0.22)' }} />
                <span
                  className="absolute top-6 right-6 grid place-items-center rounded-full transition-colors duration-300 group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-ink)]"
                  style={{ width: 52, height: 52, border: '1px solid rgba(255,255,255,0.4)', background: 'rgba(255,255,255,0.18)', backdropFilter: 'blur(8px)' }}
                >
                  <Arrow />
                </span>
                <span className="relative label tabular" style={{ color: GOLD }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="relative display mt-3 text-[28px]" style={{ fontVariationSettings: '"wdth" 125, "wght" 700' }}>
                  {p.eyebrow}
                </span>
                <span className="relative mt-2 text-[15px] leading-[23px]" style={{ color: 'rgba(255,255,255,0.82)' }}>
                  {p.blurb}
                </span>
              </Link>
            </Reveal>
          ))}
        </ul>
      </Wrap>
    </main>
  )
}

export function NotFound() {
  useDocTitle('Page not found')
  return (
    <main id="main" className="min-h-[80svh] grid place-items-center px-5 pt-28 pb-16 text-center">
      <div>
        <div className="display text-[clamp(64px,14vw,160px)]" style={{ color: GOLD }}>
          404
        </div>
        <h1 className="display mt-4 mb-0 text-[clamp(26px,4vw,40px)]">That chair's empty</h1>
        <p className="mt-4 mb-0 text-[17px]" style={{ color: 'var(--color-mist)' }}>
          The page you're after doesn't exist.
        </p>
        <Link href="/" className="btn btn-gold mt-8">
          Back to home
        </Link>
      </div>
    </main>
  )
}

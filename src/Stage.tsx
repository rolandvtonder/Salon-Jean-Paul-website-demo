import { useEffect, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type MouseEvent, type ReactNode } from 'react'
import { useScroll, useMotionValueEvent, useReducedMotion } from 'motion/react'
import { SCROLL_VH, SCROLL_SVH_MOBILE, TOTAL_MS, INTRO_DELAY_MS, P, G, GM, PHOTOS, SEAMS, SEAM_BAND, span, ramp, lerp } from './scroll'
import { BOOKING, INTRO, PHONE, WHATSAPP, EST, todaysOffer } from './content'
import { Link } from './router'
import { photo, photoSet, SIZES } from './img'

/*
  The opening scene. Scrolling drives a timeline rather than moving a page:
  the headline words stagger in, three content groups travel up as a
  parallax filmstrip, and the shop's photos hand over underneath. See
  scroll.ts for where every phase comes from.

  Desktop (>= 1024px) draws on a fixed 1440x810 artboard scaled to the
  window's width, so the composition is exact. Below that the artboard would
  shrink body copy past legibility, so phones and tablets get the same
  choreography on a fluid layout measured in svh instead.
*/

const STAGE_W = 1440
const STAGE_H = 810
const SAFE_L = 96
const GROUP_W = STAGE_W - SAFE_L * 2
const DESKTOP_MIN = 1024

const GOLD = 'var(--color-gold)'

const px = (n: number) => `${n}px`
const box = (x: number, y: number, w?: number, h?: number): CSSProperties => ({
  position: 'absolute',
  left: px(x),
  top: px(y),
  ...(w != null ? { width: px(w) } : null),
  ...(h != null ? { height: px(h) } : null),
})

const WORDS = ['Sharp', 'Since', `${EST}.`]
const BODY = ['Professional hair and barbering', 'specialists at Shop 76, N1 City Mall,', 'opposite School & Leisure.']

/* Four tiles, at the corners of group 2's box. Each one leads somewhere. */
const TILES = [
  { art: 'fade-closeup', label: ['Sharp', 'Fades'], href: '/services', pos: '50% 40%' },
  { art: 'clipper-1', label: ['Blade', 'Work'], href: '/services', pos: '50% 30%' },
  { art: 'twists-after', label: ['Twists', '& Locs'], href: '/gallery', pos: '50% 35%' },
  { art: 'clipper-2', label: ['Meet the', 'Crew'], href: '/barbers', pos: '50% 30%' },
]
const TILE_XY = [
  { x: 0, y: 0 },
  { x: GROUP_W - 255, y: 0 },
  { x: 116, y: 240 },
  { x: GROUP_W - 371, y: 240 },
]

/** Reveals behind a clip mask, rising. */
function Mask({ t, children, style }: { t: number; children: ReactNode; style?: CSSProperties }) {
  return (
    <span style={{ display: 'block', ...style, overflow: 'hidden' }}>
      <span style={{ display: 'block', height: '100%', transform: `translateY(${(1 - t) * 115}%)`, willChange: 'transform' }}>{children}</span>
    </span>
  )
}

function Arrow({ size = 12, dir = 'right' }: { size?: number; dir?: 'right' | 'down' }) {
  return (
    <svg width={size} height={size} viewBox="0 0 16 16" aria-hidden="true" style={{ transform: dir === 'down' ? 'rotate(90deg)' : undefined }}>
      <path d="M3 8h10M9 4l4 4-4 4" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}

function Tile({ i, t, style }: { i: number; t: number; style: CSSProperties }) {
  const c = TILES[i]
  return (
    <Link
      href={c.href}
      tabIndex={t > 0.5 ? 0 : -1}
      aria-label={`${c.label.join(' ')}`}
      className="group block"
      style={{ ...style, opacity: t, color: '#fff', textDecoration: 'none' }}
    >
      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', overflow: 'hidden' }}>
        <img
          src={photo(c.art)}
          alt=""
          className="transition-transform duration-500 group-hover:scale-105"
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover', objectPosition: c.pos }}
        />
        {/* the label sits on a photo, so it gets its own ground */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(150deg, rgba(8,12,20,0.82) 0%, rgba(8,12,20,0.32) 52%, rgba(8,12,20,0.05) 100%)',
          }}
        />
      </div>
      <div style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', border: '1px solid rgba(255,255,255,0.28)', pointerEvents: 'none' }} />
      <div
        className="display tile-label"
        style={{ position: 'absolute', fontVariationSettings: '"wdth" 125, "wght" 650' }}
      >
        {c.label[0]}
        <br />
        {c.label[1]}
      </div>
      <div
        className="tile-btn transition-colors duration-300 group-hover:bg-[var(--color-gold)] group-hover:text-[var(--color-ink)]"
        style={{
          position: 'absolute',
          borderRadius: '50%',
          background: 'rgba(255,255,255,0.2)',
          border: '1px solid rgba(255,255,255,0.4)',
          display: 'grid',
          placeItems: 'center',
          backdropFilter: 'blur(8px)',
        }}
      >
        <Arrow size={14} />
      </div>
    </Link>
  )
}

export default function Stage() {
  const wrap = useRef<HTMLDivElement>(null)
  const reduce = useReducedMotion()
  /* the load clock, as scroll progress: the prototype timeline run as a timer */
  const [clock, setClock] = useState(0)
  useEffect(() => {
    if (reduce) {
      setClock(1)
      return
    }
    let raf = 0
    const start = performance.now() + INTRO_DELAY_MS
    const tick = (now: number) => {
      const c = Math.max(0, now - start) / TOTAL_MS
      setClock(c)
      if (c < P.stat[1]) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [reduce])
  const [vw, setVw] = useState(() => (typeof window === 'undefined' ? STAGE_W : window.innerWidth))
  const [p, setP] = useState(0)
  const offer = useMemo(() => todaysOffer(), [])

  const { scrollYProgress } = useScroll({ target: wrap, offset: ['start start', 'end end'] })
  useMotionValueEvent(scrollYProgress, 'change', (v) => setP(v))

  useLayoutEffect(() => {
    const fit = () => setVw(window.innerWidth)
    fit()
    window.addEventListener('resize', fit)
    return () => window.removeEventListener('resize', fit)
  }, [])

  const desktop = vw >= DESKTOP_MIN

  const skipIntro = (e: MouseEvent<HTMLAnchorElement>) => {
    const main = document.getElementById('main')
    if (!main) return
    e.preventDefault()
    window.scrollTo({ top: main.offsetTop - 76, behavior: 'instant' })
    main.focus({ preventScroll: true })
  }
  const scale = vw / STAGE_W

  /* group positions, interpolated across the four frames */
  const m1 = ramp(p, P.move1)
  const m2 = ramp(p, P.move2)
  const g2t = (i: number) => span(p, [P.g2In[0] + i * 0.004, P.g2In[1]])
  const heroLive = m1 < 0.5
  /* hero reveal follows whichever is further along: the clock or the scroll */
  const q = Math.max(p, clock)
  const statT = span(q, P.stat)

  /* the photo film: each layer fades in over its seam and eases out of a push-in */
  const photos = PHOTOS.map((ph, i) => {
    const inAt = i === 0 ? 0 : SEAMS[i - 1] - SEAM_BAND
    const outAt = i < SEAMS.length ? SEAMS[i] + SEAM_BAND : 1
    const opacity = i === 0 ? 1 : ramp(p, [SEAMS[i - 1] - SEAM_BAND, SEAMS[i - 1] + SEAM_BAND])
    const covered = i < SEAMS.length && p > SEAMS[i] + SEAM_BAND
    const zoom = reduce ? 1.02 : lerp(1.14, 1.0, ramp(p, [inAt, outAt]))
    return { ...ph, opacity, covered, zoom }
  })

  const offerLine = (
    <>
      <span className="tabular">{Math.round(offer.figure * statT)}</span>
      <span style={{ fontSize: '0.45em', marginLeft: '0.08em' }}>{offer.unit}</span>
    </>
  )

  return (
    <section ref={wrap} id="top" aria-label="Salon Jean Paul N1 City" style={{ height: desktop ? `${SCROLL_VH}vh` : `${SCROLL_SVH_MOBILE}svh`, background: 'var(--color-ink)' }}>
      <div
        style={{
          position: 'sticky',
          top: 0,
          /* width-locked artboard on desktop, so the frame is at least as
             tall as the artboard ends up; plain small-viewport height below */
          height: desktop ? `max(calc(100vw * ${STAGE_H} / ${STAGE_W}), 100vh)` : '100svh',
          overflow: 'hidden',
        }}
      >
        {photos.map((ph) => (
          <img
            key={ph.name}
            src={photo(ph.name)}
            srcSet={photoSet(ph.name)}
            sizes={SIZES.full}
            alt=""
            aria-hidden="true"
            decoding="async"
            style={{
              position: 'absolute',
              inset: 0,
              width: '100%',
              height: '100%',
              objectFit: 'cover',
              objectPosition: ph.pos,
              opacity: ph.opacity,
              visibility: ph.covered ? 'hidden' : 'visible',
              transform: `scale(${ph.zoom})`,
              willChange: 'transform, opacity',
            }}
          />
        ))}

        {/* ---- section scrims, viewport-wide ---- */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: desktop
              ? 'linear-gradient(90deg, rgba(8,12,20,0.9) 0%, rgba(8,12,20,0.6) 36%, rgba(8,12,20,0.1) 66%)'
              : 'linear-gradient(180deg, rgba(8,12,20,0.55) 0%, rgba(8,12,20,0.78) 45%, rgba(8,12,20,0.92) 100%)',
            opacity: 1 - m1,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: desktop
              ? 'radial-gradient(64% 56% at 50% 78%, rgba(8,12,20,0.88) 0%, rgba(8,12,20,0.4) 58%, rgba(8,12,20,0.1) 100%)'
              : 'linear-gradient(180deg, rgba(8,12,20,0.7) 0%, rgba(8,12,20,0.85) 100%)',
            opacity: m1 * (1 - m2),
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: 'linear-gradient(180deg, rgba(8,12,20,0.1) 30%, rgba(8,12,20,0.82) 66%, rgba(8,12,20,0.94) 100%)',
            opacity: m2,
            pointerEvents: 'none',
            zIndex: 1,
          }}
        />

        {desktop ? (
          <div
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: px(STAGE_W),
              height: px(STAGE_H),
              transform: `scale(${scale})`,
              transformOrigin: 'top left',
              zIndex: 2,
            }}
          >
            {/* ---- index rail, in the right margin clear of the offer card ---- */}
            <div aria-hidden="true" style={box(STAGE_W - 64, 300, 32, 272)}>
              {['01', '02', '03', '04', '05'].map((n, i) => (
                <div
                  key={n}
                  className="label tabular"
                  style={{
                    position: 'absolute',
                    top: px(i * 64),
                    right: 0,
                    fontSize: px(15),
                    color: i === Math.min(4, Math.floor(p * 5)) ? GOLD : 'rgba(255,255,255,0.4)',
                    transition: 'color 300ms ease',
                  }}
                >
                  {n}
                </div>
              ))}
            </div>

            {/* ================= GROUP 1 — the hero ================= */}
            <div style={{ ...box(SAFE_L, 0, GROUP_W, 642), transform: `translateY(${lerp(G.g1.start, G.g1.end, m1)}px)`, willChange: 'transform' }}>
              <h1 style={{ margin: 0 }}>
                <span className="sr-only">Salon Jean Paul N1 City Barbers. </span>
                {WORDS.map((w, i) => (
                  <Mask
                    key={w}
                    t={span(q, [P.word, P.word2, P.word3][i])}
                    style={{ position: 'absolute', left: 0, top: px(-8 + i * 66), width: px(640), height: px(96) }}
                  >
                    <span className="display" style={{ display: 'block', fontSize: px(80), lineHeight: px(92), color: i === 2 ? GOLD : '#fff' }}>
                      {w}
                    </span>
                  </Mask>
                ))}
              </h1>

              <p style={{ margin: 0 }}>
                {BODY.map((line, i) => (
                  <Mask
                    key={line}
                    t={span(q, [P.body1, P.body2, P.body3][i])}
                    style={{ position: 'absolute', left: 0, top: px(266 + i * 28), width: px(480), height: px(32) }}
                  >
                    <span style={{ display: 'block', fontSize: px(19), lineHeight: px(26), color: 'rgba(255,255,255,0.86)' }}>{line}</span>
                  </Mask>
                ))}
              </p>

              <div style={{ position: 'absolute', left: 0, top: px(384), opacity: span(q, P.body3), display: 'flex', gap: px(14) }}>
                <a className="btn btn-light" href={BOOKING.href} target="_blank" rel="noopener" tabIndex={heroLive ? 0 : -1}>
                  {BOOKING.label}
                </a>
                <Link className="btn btn-ghost" href="/services" tabIndex={heroLive ? 0 : -1} style={{ paddingRight: px(10) }}>
                  See prices
                  <span style={{ width: px(30), height: px(30), borderRadius: '50%', background: 'rgba(255,255,255,0.18)', display: 'grid', placeItems: 'center' }}>
                    <Arrow size={12} dir="down" />
                  </span>
                </Link>
              </div>

              {/* today's offer: the reference's telemetry card, carrying what
                  actually applies today instead of a made-up statistic */}
              <div
                className="glass"
                style={{
                  position: 'absolute',
                  left: px(GROUP_W - 459),
                  top: px(300),
                  width: px(459),
                  height: px(289),
                  borderRadius: px(60),
                  opacity: statT,
                  transform: `translateY(${(1 - statT) * 28}px)`,
                }}
              >
                <div style={{ position: 'absolute', inset: `${px(36)} ${px(40)}` }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ fontSize: px(17), lineHeight: px(23), color: 'rgba(255,255,255,0.9)' }}>
                      Today at
                      <br />
                      Jean Paul
                    </div>
                    <div className="display" style={{ fontSize: px(66), lineHeight: px(58), fontVariationSettings: '"wdth" 125, "wght" 300' }}>
                      {offerLine}
                    </div>
                  </div>

                  <div style={{ position: 'absolute', left: 0, right: 0, top: px(86) }}>
                    <div className="display" style={{ fontSize: px(19), lineHeight: px(24), color: GOLD, fontVariationSettings: '"wdth" 125, "wght" 650' }}>
                      {offer.title}
                    </div>
                    <div style={{ marginTop: px(4), fontSize: px(14), color: 'rgba(255,255,255,0.72)' }}>{offer.sub}</div>
                  </div>

                  <div style={{ position: 'absolute', left: 0, right: 0, top: px(150), height: 1, background: 'rgba(255,255,255,0.16)' }} />

                  <div style={{ position: 'absolute', left: 0, right: 0, top: px(170), display: 'flex' }}>
                    {[
                      ['Fades from', 'R140'],
                      ['Blade fades', 'R170'],
                      ['Beards from', 'R70'],
                    ].map(([k, v], i) => (
                      <div key={k} style={{ flex: 1, paddingLeft: i ? px(20) : 0, borderLeft: i ? '1px solid rgba(255,255,255,0.16)' : undefined }}>
                        <div className="display tabular" style={{ fontSize: px(22), fontVariationSettings: '"wdth" 125, "wght" 600' }}>
                          {v}
                        </div>
                        <div className="label" style={{ marginTop: px(8), fontSize: px(10), color: 'rgba(255,255,255,0.6)' }}>
                          {k}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* ================= GROUP 2 — the craft ================= */}
            <div
              style={{
                ...box(SAFE_L, 0, GROUP_W, 640),
                transform: `translateY(${lerp(lerp(G.g2.enter, G.g2.mid, m1), G.g2.end, m2)}px)`,
                willChange: 'transform',
              }}
              className="tiles-desktop"
            >
              {TILE_XY.map((xy, i) => (
                <Tile key={i} i={i} t={g2t(i)} style={{ position: 'absolute', left: px(xy.x), top: px(xy.y), width: px(255), height: px(215), borderRadius: px(46) }} />
              ))}

              <h2 className="display" style={{ position: 'absolute', left: 0, width: px(GROUP_W), top: px(470), margin: 0, fontSize: px(72), textAlign: 'center' }}>
                Cut With Intent
              </h2>
              <p
                style={{
                  position: 'absolute',
                  left: px((GROUP_W - 680) / 2),
                  top: px(560),
                  width: px(680),
                  margin: 0,
                  fontSize: px(21),
                  lineHeight: px(32),
                  textAlign: 'center',
                  color: 'rgba(255,255,255,0.88)',
                }}
              >
                Fades, blade work, scissor cuts, beards and twists, done by barbers who read every head before they touch it.
              </p>
            </div>

            {/* ================= GROUP 3 — the crew ================= */}
            <div style={{ ...box(SAFE_L, 0, GROUP_W, 810), transform: `translateY(${lerp(lerp(G.g3.enter, G.g3.mid, m1), G.g3.end, m2)}px)`, willChange: 'transform' }}>
              <div style={{ position: 'absolute', left: 0, top: px(404), width: px(56), height: px(2), background: GOLD }} />
              <h2 className="display" style={{ position: 'absolute', left: 0, top: px(430), width: px(620), margin: 0, fontSize: px(54), lineHeight: px(58) }}>
                One crew. One standard.
              </h2>
              <div style={{ position: 'absolute', left: px(GROUP_W - 440), top: px(430), width: px(440) }}>
                <p style={{ margin: 0, fontSize: px(16), lineHeight: px(27), color: 'rgba(255,255,255,0.84)' }}>{INTRO}</p>
                <p style={{ margin: `${px(16)} 0 0`, fontSize: px(16), lineHeight: px(27), color: 'rgba(255,255,255,0.84)' }}>
                  Book ahead on{' '}
                  <a className="link" href={WHATSAPP.href} target="_blank" rel="noopener" tabIndex={m2 > 0.5 ? 0 : -1}>
                    WhatsApp
                  </a>{' '}
                  or{' '}
                  <a className="link tabular" href={PHONE.href} tabIndex={m2 > 0.5 ? 0 : -1}>
                    {PHONE.label}
                  </a>
                  .
                </p>
              </div>
            </div>
          </div>
        ) : (
          /* ---------------- phones and tablets ---------------- */
          <div style={{ position: 'absolute', inset: 0, zIndex: 2 }}>
            {/* GROUP 1 */}
            <div
              style={{
                position: 'absolute',
                left: 20,
                right: 20,
                top: 'max(96px, 14svh)',
                transform: `translateY(${lerp(GM.g1.start, GM.g1.end, m1)}svh)`,
                willChange: 'transform',
              }}
            >
              <h1 style={{ margin: 0 }}>
                <span className="sr-only">Salon Jean Paul N1 City Barbers. </span>
                {WORDS.map((w, i) => (
                  <Mask key={w} t={span(q, [P.word, P.word2, P.word3][i])} style={{ height: '1.02em', fontSize: 'clamp(52px, 15vw, 104px)' }}>
                    <span className="display" style={{ display: 'block', lineHeight: 1.02, color: i === 2 ? GOLD : '#fff' }}>
                      {w}
                    </span>
                  </Mask>
                ))}
              </h1>
              <p style={{ margin: '22px 0 0', maxWidth: 420 }}>
                {BODY.map((line, i) => (
                  <Mask key={line} t={span(q, [P.body1, P.body2, P.body3][i])} style={{ height: 26 }}>
                    <span style={{ display: 'block', fontSize: 16, lineHeight: '24px', color: 'rgba(255,255,255,0.88)' }}>{line}</span>
                  </Mask>
                ))}
              </p>
              <div style={{ marginTop: 24, opacity: span(q, P.body3), display: 'flex', flexWrap: 'wrap', gap: 12 }}>
                <a className="btn btn-light" href={BOOKING.href} target="_blank" rel="noopener" tabIndex={heroLive ? 0 : -1}>
                  {BOOKING.label}
                </a>
                <Link className="btn btn-ghost" href="/services" tabIndex={heroLive ? 0 : -1}>
                  See prices <Arrow size={12} dir="down" />
                </Link>
              </div>
              <div
                className="glass"
                style={{
                  marginTop: 28,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 16,
                  padding: '14px 20px',
                  borderRadius: 28,
                  maxWidth: 420,
                  opacity: statT,
                  transform: `translateY(${(1 - statT) * 20}px)`,
                }}
              >
                <div className="display" style={{ fontSize: 40, lineHeight: 1, fontVariationSettings: '"wdth" 125, "wght" 300' }}>
                  {offerLine}
                </div>
                <div>
                  <div className="label" style={{ color: 'rgba(255,255,255,0.65)' }}>Today</div>
                  <div className="display" style={{ fontSize: 15, marginTop: 4, color: GOLD, fontVariationSettings: '"wdth" 125, "wght" 650' }}>
                    {offer.title}
                  </div>
                  <div style={{ fontSize: 13, marginTop: 2, color: 'rgba(255,255,255,0.75)' }}>{offer.sub}</div>
                </div>
              </div>
            </div>

            {/* GROUP 2 */}
            <div
              className="tiles-mobile"
              style={{
                position: 'absolute',
                left: 20,
                right: 20,
                top: 'max(88px, 12svh)',
                transform: `translateY(${lerp(lerp(GM.g2.enter, GM.g2.mid, m1), GM.g2.end, m2)}svh)`,
                willChange: 'transform',
              }}
            >
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, maxWidth: 560, margin: '0 auto' }}>
                {TILES.map((_, i) => (
                  <Tile key={i} i={i} t={g2t(i)} style={{ position: 'relative', aspectRatio: '4 / 3', borderRadius: 26 }} />
                ))}
              </div>
              <h2 className="display" style={{ margin: '28px 0 0', fontSize: 'clamp(34px, 10vw, 64px)', textAlign: 'center' }}>
                Cut With Intent
              </h2>
              <p style={{ margin: '14px auto 0', maxWidth: 480, fontSize: 16, lineHeight: '25px', textAlign: 'center', color: 'rgba(255,255,255,0.88)' }}>
                Fades, blade work, scissor cuts, beards and twists, done by barbers who read every head before they touch it.
              </p>
            </div>

            {/* GROUP 3 */}
            <div
              style={{
                position: 'absolute',
                left: 20,
                right: 20,
                bottom: 'max(40px, 7svh)',
                transform: `translateY(${lerp(lerp(GM.g3.enter, GM.g3.mid, m1), GM.g3.end, m2)}svh)`,
                willChange: 'transform',
              }}
            >
              <div style={{ width: 48, height: 2, background: GOLD }} />
              <h2 className="display" style={{ margin: '18px 0 0', fontSize: 'clamp(32px, 9vw, 56px)', lineHeight: 1.05 }}>
                One crew. One standard.
              </h2>
              <p style={{ margin: '16px 0 0', maxWidth: 520, fontSize: 16, lineHeight: '25px', color: 'rgba(255,255,255,0.86)' }}>{INTRO}</p>
            </div>
          </div>
        )}

        {/* scroll cue, gone once the scene starts moving */}
        <div
          aria-hidden="true"
          className="label"
          style={{
            position: 'absolute',
            left: '50%',
            bottom: 22,
            transform: 'translateX(-50%)',
            zIndex: 2,
            color: 'rgba(255,255,255,0.7)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: 8,
            opacity: 1 - ramp(p, [0.02, 0.08]),
          }}
        >
          Scroll
          <span style={{ width: 1, height: 28, background: 'linear-gradient(180deg, var(--color-gold), transparent)' }} />
        </div>

        {/* skip the film: straight to the page index, no scrub through it */}
        <a
          href="#main"
          onClick={skipIntro}
          className="label"
          tabIndex={p < 0.85 ? 0 : -1}
          style={{
            position: 'absolute',
            right: desktop ? 40 : 16,
            bottom: desktop ? 26 : 18,
            zIndex: 3,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            minHeight: 44,
            padding: '0 16px',
            borderRadius: 999,
            color: '#fff',
            textDecoration: 'none',
            background: 'rgba(8,12,20,0.55)',
            border: '1px solid rgba(255,255,255,0.28)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            opacity: 1 - ramp(p, [0.8, 0.88]),
            pointerEvents: p < 0.85 ? 'auto' : 'none',
          }}
        >
          Skip intro
          <Arrow size={12} dir="down" />
        </a>
      </div>
    </section>
  )
}

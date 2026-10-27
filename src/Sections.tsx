import { useMemo, type ReactNode } from 'react'
import { motion, useReducedMotion } from 'motion/react'
import {
  ADDRESS,
  ALSO,
  BARBERS,
  BOOKING,
  CAREERS_EMAIL,
  EMAIL,
  PHONE,
  SERVICES,
  SPECIALS,
  WHATSAPP,
} from './content'
import { photo, photoSet, SIZES } from './img'

/*
  The body of each page. Ordinary responsive flow (the stage is a fixed
  artboard; this is not), in the scene's language: wide display heads,
  hairlines, 46px tiles, gold kept for prices and the one action. Each
  page's heading lives in its banner (Pages.tsx), so these start at content.
*/

const GOLD = 'var(--color-gold)'

/** Rises into place once, when it scrolls into view. */
export function Reveal({ children, delay = 0, className, as = 'div' }: { children: ReactNode; delay?: number; className?: string; as?: 'div' | 'li' }) {
  const reduce = useReducedMotion()
  const Tag = as === 'li' ? motion.li : motion.div
  return (
    <Tag
      className={className}
      initial={reduce ? false : { opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '0px 0px -8% 0px' }}
      transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1], delay }}
    >
      {children}
    </Tag>
  )
}

export function Eyebrow({ children }: { children: ReactNode }) {
  return (
    <span className="label inline-flex items-center gap-2 rounded-full px-3.5 py-[7px]" style={{ border: '1px solid rgba(255,255,255,0.18)', color: 'rgba(255,255,255,0.85)' }}>
      <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
      {children}
    </span>
  )
}

export const Wrap = ({ children }: { children: ReactNode }) => (
  <div className="relative px-5 md:px-10 py-16 md:py-24">
    <div className="mx-auto max-w-[1248px]">{children}</div>
  </div>
)

/* ================= Services & prices ================= */
export function Services() {
  return (
    <Wrap>

      <div className="grid gap-5 md:grid-cols-2">
        {SERVICES.map((s, i) => (
          <Reveal key={s.cat} delay={(i % 2) * 0.08} className="panel rounded-[36px] md:rounded-[46px] p-7 md:p-10 flex flex-col">
            <div className="flex items-start justify-between gap-6">
              <div>
                <h3 className="display m-0 text-[26px] md:text-[30px]" style={{ fontVariationSettings: '"wdth" 125, "wght" 700' }}>
                  {s.cat}
                </h3>
                <p className="mt-2 mb-0 text-[15px] text-[var(--color-mist)]">{s.note}</p>
              </div>
              <img
                src={photo(s.img)}
                srcSet={photoSet(s.img)}
                sizes={SIZES.thumb}
                alt=""
                loading="lazy"
                width={76}
                height={76}
                className="shrink-0 rounded-full object-cover"
                style={{ width: 76, height: 76, border: '1px solid rgba(255,255,255,0.25)' }}
              />
            </div>
            <ul className="mt-7 mb-0 p-0 list-none flex flex-col">
              {s.rows.map((r) => (
                <li key={r.name} className="flex items-baseline gap-3 py-3" style={{ borderTop: '1px solid rgba(255,255,255,0.09)' }}>
                  <span className="text-[16px]">{r.name}</span>
                  <span aria-hidden="true" className="flex-1 translate-y-[-4px]" style={{ borderBottom: '1px dotted rgba(255,255,255,0.22)' }} />
                  <span className="display tabular text-[18px]" style={{ color: GOLD, fontVariationSettings: '"wdth" 125, "wght" 600' }}>
                    {r.from && <span className="label mr-1.5 text-[10px]" style={{ color: 'rgba(255,255,255,0.6)' }}>from</span>}
                    {r.price}
                  </span>
                </li>
              ))}
            </ul>
          </Reveal>
        ))}
      </div>

      <Reveal className="mt-8 flex flex-col md:flex-row md:items-center gap-5 md:gap-8 rounded-[28px] px-7 py-6" >
        <span className="label shrink-0" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Also in the chair
        </span>
        <ul className="m-0 p-0 list-none flex flex-wrap gap-2.5">
          {ALSO.map((a) => (
            <li key={a} className="rounded-full px-4 py-2 text-[14px]" style={{ border: '1px solid rgba(255,255,255,0.18)' }}>
              {a}
            </li>
          ))}
        </ul>
        <span className="text-[14px] text-[var(--color-mist)] md:ml-auto">Ask in store for pricing.</span>
      </Reveal>
    </Wrap>
  )
}

/* ================= Weekly specials ================= */
export function Specials() {
  const today = useMemo(() => new Date().getDay(), [])
  /* a day special outranks the Mon–Fri one for the "Today" badge */
  const todayIdx = useMemo(() => {
    const day = SPECIALS.findIndex((s) => s.days.length === 1 && s.days[0] === today)
    return day >= 0 ? day : SPECIALS.findIndex((s) => s.days.includes(today))
  }, [today])
  const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

  return (
    <Wrap>

      <ul className="mb-0 p-0 list-none grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {SPECIALS.map((s, i) => {
          const isToday = i === todayIdx
          return (
            <Reveal as="li" key={s.name} delay={i * 0.06} className="relative panel rounded-[36px] p-7 flex flex-col min-h-[300px]">
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-[36px] pointer-events-none"
                style={{ border: `1px solid ${isToday ? GOLD : 'transparent'}`, boxShadow: isToday ? '0 0 40px -12px rgba(212,179,106,0.45)' : undefined }}
              />
              <div className="flex items-center justify-between">
                <span className="label" style={{ color: 'rgba(255,255,255,0.65)' }}>
                  {s.days.length === 1 ? DAYS[s.days[0]] : 'Mon – Fri'}
                </span>
                {isToday && (
                  <span className="label rounded-full px-3 py-1.5" style={{ background: GOLD, color: 'var(--color-ink)' }}>
                    Today
                  </span>
                )}
              </div>
              <div className="display tabular mt-8 text-[72px]" style={{ fontVariationSettings: '"wdth" 125, "wght" 300' }}>
                {s.figure}
                <span className="text-[32px]">%</span>
              </div>
              <div className="mt-1 text-[15px] text-[var(--color-mist)]">{s.what}</div>
              <h3 className="display mt-auto pt-8 mb-0 text-[20px]" style={{ color: GOLD, fontVariationSettings: '"wdth" 125, "wght" 700' }}>
                {s.name}
              </h3>
              <p className="mt-2 mb-0 text-[14px] leading-[22px] text-[var(--color-mist)]">{s.detail}</p>
            </Reveal>
          )
        })}
      </ul>
      <p className="mt-6 mb-0 text-[13px] text-[rgba(255,255,255,0.55)]">T&amp;Cs apply. Confirm in store before your visit.</p>
    </Wrap>
  )
}

/* ================= Meet the barbers ================= */
export function Barbers() {
  return (
    <Wrap>

      <ul className="mb-0 p-0 list-none grid gap-5 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
        {BARBERS.map((b, i) => (
          <Reveal as="li" key={b.name} delay={i * 0.06} className="panel rounded-[36px] md:rounded-[46px] overflow-hidden flex flex-col">
            <div className="relative aspect-[4/5] overflow-hidden">
              <img
                src={photo(b.img)}
                alt={`${b.name}, ${b.role.toLowerCase()} at Salon Jean Paul N1 City`}
                loading="lazy"
                width={294}
                height={368}
                className="absolute inset-0 w-full h-full object-cover"
              />
              <div aria-hidden="true" className="absolute inset-x-0 bottom-0 h-1/2" style={{ background: 'linear-gradient(180deg, transparent, rgba(14,20,31,0.95))' }} />
              <div className="absolute left-6 bottom-5 right-6">
                <span className="label" style={{ color: b.role.startsWith('Senior') ? GOLD : 'rgba(255,255,255,0.75)' }}>
                  {b.role}
                </span>
                <h3 className="display mt-2 mb-0 text-[22px] leading-[1.05]" style={{ fontVariationSettings: '"wdth" 125, "wght" 700' }}>
                  {b.name}
                </h3>
              </div>
            </div>
            <div className="px-6 pt-4 pb-6">
              <span className="label" style={{ color: 'rgba(255,255,255,0.55)' }}>
                Best at
              </span>
              <ul className="mt-3 mb-0 p-0 list-none flex flex-wrap gap-2">
                {b.best.map((x) => (
                  <li key={x} className="rounded-full px-3 py-1.5 text-[13px]" style={{ border: '1px solid rgba(255,255,255,0.16)' }}>
                    {x}
                  </li>
                ))}
              </ul>
            </div>
          </Reveal>
        ))}
      </ul>

      <Reveal className="relative mt-5 rounded-[36px] md:rounded-[46px] overflow-hidden min-h-[320px] md:min-h-[420px] flex items-end">
        <img
          src={photo('team')}
          srcSet={photoSet('team')}
          sizes={SIZES.wide}
          alt="The Salon Jean Paul N1 City crew in black uniforms, posed together in the shop"
          loading="lazy"
          className="absolute inset-0 w-full h-full object-cover"
          style={{ objectPosition: '50% 30%' }}
        />
        <div aria-hidden="true" className="absolute inset-0" style={{ background: 'linear-gradient(180deg, rgba(8,12,20,0) 35%, rgba(8,12,20,0.9) 100%)' }} />
        <div className="relative p-7 md:p-10 flex flex-col md:flex-row md:items-end gap-5 w-full">
          <div>
            <h3 className="display m-0 text-[clamp(26px,4vw,40px)]">And the rest of the crew.</h3>
            <p className="mt-3 mb-0 text-[16px] text-[rgba(255,255,255,0.86)] max-w-[480px]">Same uniform, same standard, whichever chair you land in.</p>
          </div>
          <a className="btn btn-gold md:ml-auto self-start md:self-auto" href={BOOKING.href} target="_blank" rel="noopener">
            {BOOKING.label}
          </a>
        </div>
      </Reveal>
    </Wrap>
  )
}

/* ================= Gallery ================= */
const SHOTS = [
  { src: 'barber-at-work', alt: 'Barber lining up a client’s hairline in the N1 City shop', cls: 'col-span-2 row-span-2', pos: '50% 35%' },
  { src: 'fade-closeup', alt: 'Close-up of a fresh skin fade being combed through', cls: 'row-span-2', pos: '50% 40%' },
  { src: 'clipper-1', alt: 'Black and white shot of a barber taking a client’s sides down with clippers', cls: '', pos: '50% 30%' },
  { src: 'clipper-2', alt: 'Black and white shot of a barber working a client’s hairline with a trimmer', cls: '', pos: '50% 30%' },
  { src: 'shop-chairs', alt: 'Row of black barber chairs under gold-framed mirrors on the blue wall', cls: 'md:row-span-2', pos: '50% 55%' },
  { src: 'shop-front', alt: 'Salon Jean Paul N1 City shopfront inside N1 City Mall', cls: 'md:row-span-2', pos: '50% 60%' },
]

export function Gallery() {
  return (
    <Wrap>

      <div className="grid grid-cols-2 md:grid-cols-4 auto-rows-[170px] md:auto-rows-[230px] gap-3 md:gap-4">
        {SHOTS.slice(0, 4).map((s, i) => (
          <Reveal key={s.src} delay={i * 0.05} className={`relative overflow-hidden rounded-[28px] md:rounded-[36px] ${s.cls}`}>
            <img src={photo(s.src)} srcSet={photoSet(s.src)} sizes={s.cls.includes('col-span-2') ? SIZES.half : SIZES.quarter} alt={s.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: s.pos }} />
          </Reveal>
        ))}

        {/* before / after: twists, from the shop's own post */}
        <Reveal className="relative col-span-2 row-span-2 md:row-span-2 rounded-[28px] md:rounded-[36px] overflow-hidden grid grid-cols-2 gap-[2px] bg-[var(--color-gold)]">
          {[
            ['twists-before', 'Before', 'Short twists before the appointment'],
            ['twists-after', 'After', 'Longer, defined twists after the appointment'],
          ].map(([src, tag, alt]) => (
            <figure key={src} className="relative m-0 overflow-hidden">
              <img src={photo(src)} alt={alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" />
              <figcaption className="label absolute left-4 bottom-4 rounded-full px-3 py-1.5" style={{ background: 'rgba(8,12,20,0.75)', color: '#fff' }}>
                {tag}
              </figcaption>
            </figure>
          ))}
        </Reveal>

        {SHOTS.slice(4).map((s, i) => (
          <Reveal key={s.src} delay={i * 0.05} className={`relative overflow-hidden rounded-[28px] md:rounded-[36px] ${s.cls}`}>
            <img src={photo(s.src)} srcSet={photoSet(s.src)} sizes={s.cls.includes('col-span-2') ? SIZES.half : SIZES.quarter} alt={s.alt} loading="lazy" className="absolute inset-0 w-full h-full object-cover" style={{ objectPosition: s.pos }} />
          </Reveal>
        ))}
      </div>
    </Wrap>
  )
}

/* ================= Careers ================= */
export function Careers() {
  return (
    <Wrap>
      <Reveal className="panel rounded-[36px] md:rounded-[46px] overflow-hidden grid md:grid-cols-[1.1fr_1fr]">
        <div className="p-8 md:p-14 min-w-0">
          <h2 className="display m-0 text-[clamp(26px,3.6vw,36px)]">Are you passionate about:</h2>
          <ul className="mt-4 mb-0 p-0 list-none grid gap-3">
            {[
              'Cutting-edge barbering',
              'Exceptional customer service',
              'Working with a great team of expert barbers',
              'Taking your skills to the next level',
            ].map((x) => (
              <li key={x} className="flex gap-3 text-[16px]">
                <svg width="18" height="18" viewBox="0 0 18 18" aria-hidden="true" className="mt-[3px] shrink-0">
                  <path d="M3.5 9.5l3.5 3.5 7.5-8" fill="none" stroke={GOLD} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
                {x}
              </li>
            ))}
          </ul>
          <p className="mt-7 mb-0 text-[16px] text-[var(--color-mist)]">Join the team at Salon Jean Paul N1 City Barbers. Send your CV to:</p>
          <a className="btn btn-ghost mt-4 max-w-full" href={CAREERS_EMAIL.href} style={{ whiteSpace: 'normal', overflowWrap: 'anywhere', textTransform: 'none', letterSpacing: '0.02em', fontSize: 14 }}>
            {CAREERS_EMAIL.label}
          </a>
        </div>
        <div className="relative min-h-[260px]">
          <img
            src={photo('careers')}
            alt="Barber at Salon Jean Paul cutting a client's hair in front of the blue wall"
            loading="lazy"
            className="absolute inset-0 w-full h-full object-cover"
            style={{ objectPosition: '40% 30%' }}
          />
          <div aria-hidden="true" className="absolute inset-0 hidden md:block" style={{ background: 'linear-gradient(90deg, rgba(18,26,40,1) 0%, rgba(18,26,40,0) 40%)' }} />
        </div>
      </Reveal>
    </Wrap>
  )
}

/* ================= Visit ================= */
export function Visit() {
  const rows: { k: string; v: ReactNode }[] = [
    {
      k: 'Where',
      v: (
        <>
          {ADDRESS.lines.map((l) => (
            <span key={l} className="block">
              {l}
            </span>
          ))}
          <span className="block text-[var(--color-mist)] mt-1">{ADDRESS.landmark}</span>
        </>
      ),
    },
    {
      k: 'Call',
      v: (
        <a className="link tabular" href={PHONE.href}>
          {PHONE.label}
        </a>
      ),
    },
    {
      k: 'WhatsApp',
      v: (
        <a className="link tabular" href={WHATSAPP.href} target="_blank" rel="noopener">
          {WHATSAPP.label}
        </a>
      ),
    },
    {
      k: 'Email',
      v: (
        <a className="link" href={EMAIL.href}>
          {EMAIL.label}
        </a>
      ),
    },
    { k: 'Hours', v: <span className="text-[var(--color-mist)]">Call {PHONE.label} to confirm today's hours.</span> },
  ]

  return (
    <Wrap>
      <div className="grid gap-10 lg:gap-16 lg:grid-cols-[1fr_1.15fr] items-start">
        <div>
          <Reveal>
            <dl className="m-0 grid gap-0">
              {rows.map((r) => (
                <div key={r.k} className="grid grid-cols-[110px_1fr] gap-4 py-4" style={{ borderTop: '1px solid rgba(255,255,255,0.1)' }}>
                  <dt className="label pt-[3px]" style={{ color: 'rgba(255,255,255,0.55)' }}>
                    {r.k}
                  </dt>
                  <dd className="m-0 text-[16px] leading-[25px]">{r.v}</dd>
                </div>
              ))}
            </dl>
            <div className="mt-8 flex flex-wrap gap-3">
              <a className="btn btn-gold" href={BOOKING.href} target="_blank" rel="noopener">
                {BOOKING.label}
              </a>
              <a className="btn btn-ghost" href={ADDRESS.directions} target="_blank" rel="noopener">
                Get directions
              </a>
            </div>
          </Reveal>
        </div>
        <Reveal className="relative rounded-[36px] md:rounded-[46px] overflow-hidden panel aspect-[4/3] lg:aspect-auto lg:h-[560px]">
          <iframe
            title="Map showing N1 City Mall, Cape Town"
            src={ADDRESS.embed}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            className="absolute inset-0 w-full h-full border-0"
            style={{ filter: 'grayscale(0.6) invert(0.92) hue-rotate(180deg) contrast(0.9)' }}
          />
        </Reveal>
      </div>
    </Wrap>
  )
}

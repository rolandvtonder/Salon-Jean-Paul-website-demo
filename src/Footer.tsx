import { Lockup } from './Logo'
import { ADDRESS, BOOKING, EMAIL, NAV, PHONE, SOCIAL, WHATSAPP } from './content'
import { Link } from './router'

/*
  Footer. Structured after the reference: a CTA band across the top, a rule,
  the brand column beside three link columns, a legal bar, and the oversized
  wordmark fading out at the bottom. The reference's newsletter slot carries
  the two ways people actually reach a barber: call or WhatsApp.
*/

const GOLD = 'var(--color-gold)'

export default function Footer() {
  const year = new Date().getFullYear()
  return (
    <footer style={{ background: '#080c14', padding: '0 clamp(12px, 2vw, 24px)', position: 'relative', zIndex: 1 }}>
      <div
        style={{
          maxWidth: 1312,
          margin: '0 auto',
          border: '1px solid rgba(255,255,255,0.10)',
          borderRadius: 28,
          background: 'linear-gradient(180deg, rgba(22,31,47,0.95) 0%, rgba(11,16,25,0.95) 100%)',
          padding: 'clamp(32px, 5vw, 56px) clamp(22px, 5vw, 56px) 8px',
          overflow: 'hidden',
        }}
      >
        {/* ---- CTA band ---- */}
        <div style={{ display: 'flex', gap: 40, flexWrap: 'wrap', alignItems: 'flex-end' }}>
          <div style={{ flex: '1 1 420px' }}>
            <span
              className="label"
              style={{ display: 'inline-flex', alignItems: 'center', gap: 8, padding: '7px 14px', borderRadius: 999, border: '1px solid rgba(255,255,255,0.16)', color: 'rgba(255,255,255,0.85)' }}
            >
              <span aria-hidden="true" style={{ width: 6, height: 6, borderRadius: '50%', background: GOLD }} />
              Shop 76, N1 City Mall
            </span>
            <h2 className="display" style={{ margin: '20px 0 0', fontSize: 'clamp(30px, 4.4vw, 44px)', lineHeight: 1.05 }}>
              Your chair is{' '}
              <span style={{ fontStyle: 'italic', fontVariationSettings: '"wdth" 125, "wght" 350', color: 'rgba(255,255,255,0.75)' }}>waiting</span>
            </h2>
            <p style={{ margin: '14px 0 0', fontSize: 16, lineHeight: '25px', color: 'rgba(255,255,255,0.7)', maxWidth: 440 }}>
              Book on WhatsApp or give the shop a call. We'll see you in the chair.
            </p>
          </div>

          <div style={{ flex: '0 1 420px', display: 'flex', flexWrap: 'wrap', gap: 12 }}>
            <a className="btn btn-gold" href={BOOKING.href} target="_blank" rel="noopener">
              {BOOKING.label}
            </a>
            <a className="btn btn-ghost tabular" href={PHONE.href}>
              Call {PHONE.label}
            </a>
          </div>
        </div>

        <div style={{ height: 1, background: 'rgba(255,255,255,0.10)', margin: '44px 0 40px' }} />

        {/* ---- brand + link columns ---- */}
        <div style={{ display: 'flex', gap: 48, flexWrap: 'wrap' }}>
          <div style={{ flex: '1 1 300px' }}>
            <Lockup width={118} />
            <p style={{ margin: '18px 0 0', fontSize: 14, lineHeight: '22px', color: 'rgba(255,255,255,0.65)', maxWidth: 280 }}>
              Professional hair and barbering specialists. Jean Paul Barbers, cutting since 1987.
            </p>
          </div>

          <nav aria-label="Footer" style={{ flex: '0 1 150px' }}>
            <div className="label" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>
              Explore
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0 }}>
              {[{ t: 'Home', href: '/' }, ...NAV].map((n) => (
                <li key={n.t}>
                  <Link href={n.href} className="hover:text-[var(--color-gold-soft)] transition-colors" style={{ display: 'inline-block', fontSize: 15, lineHeight: '34px', color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>
                    {n.t}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div style={{ flex: '0 1 220px' }}>
            <div className="label" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>
              Visit
            </div>
            <address style={{ fontStyle: 'normal', fontSize: 15, lineHeight: '26px', color: 'rgba(255,255,255,0.85)' }}>
              {ADDRESS.lines.map((l) => (
                <div key={l}>{l}</div>
              ))}
              <a className="link" href={ADDRESS.directions} target="_blank" rel="noopener" style={{ display: 'inline-block', marginTop: 8 }}>
                Get directions
              </a>
            </address>
          </div>

          <div style={{ flex: '0 1 230px' }}>
            <div className="label" style={{ color: 'rgba(255,255,255,0.55)', marginBottom: 14 }}>
              Contact
            </div>
            <ul style={{ listStyle: 'none', margin: 0, padding: 0, fontSize: 15, lineHeight: '34px' }}>
              <li>
                <a className="hover:text-[var(--color-gold-soft)] transition-colors tabular" href={PHONE.href} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>
                  {PHONE.label}
                </a>
              </li>
              <li>
                <a className="hover:text-[var(--color-gold-soft)] transition-colors tabular" href={WHATSAPP.href} target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>
                  WhatsApp {WHATSAPP.label}
                </a>
              </li>
              <li>
                <a className="hover:text-[var(--color-gold-soft)] transition-colors" href={EMAIL.href} style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>
                  {EMAIL.label}
                </a>
              </li>
              {SOCIAL.map((s) => (
                <li key={s.label}>
                  <a className="hover:text-[var(--color-gold-soft)] transition-colors" href={s.href} target="_blank" rel="noopener" style={{ color: 'rgba(255,255,255,0.85)', textDecoration: 'none' }}>
                    {s.label} <span style={{ color: 'rgba(255,255,255,0.5)' }}>{s.handle}</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ---- legal bar ---- */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            fontSize: 13,
            color: 'rgba(255,255,255,0.55)',
            borderTop: '1px solid rgba(255,255,255,0.10)',
            marginTop: 40,
            padding: '20px 0 28px',
          }}
        >
          <span>&#169; {year} Salon Jean Paul N1 City Barbers. All rights reserved.</span>
          <span>Shop 76, N1 City Mall, Cape Town</span>
        </div>

        {/* ---- the wordmark, fading into the panel ---- */}
        <div
          aria-hidden="true"
          className="display"
          style={{
            fontSize: 'clamp(64px, 13vw, 190px)',
            lineHeight: 1.04,
            textAlign: 'center',
            letterSpacing: '-0.03em',
            whiteSpace: 'nowrap',
            background: 'linear-gradient(180deg, rgba(212,179,106,0.42) 0%, rgba(212,179,106,0.03) 82%)',
            WebkitBackgroundClip: 'text',
            backgroundClip: 'text',
            color: 'transparent',
            userSelect: 'none',
            marginBottom: 4,
          }}
        >
          Jean Paul
        </div>
      </div>
      <div style={{ height: 24 }} />
    </footer>
  )
}

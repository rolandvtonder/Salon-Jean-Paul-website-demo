/*
  The Jean Paul Barbers mark, redrawn as SVG from the 196px logo.jpg so it
  stays crisp at any size: a square frame with the J and P monogram, the P's
  stem running down into the frame. The N1C variant carries the branch code
  above the monogram, as on the N1 City logo.
*/

const GOLD = 'var(--color-gold)'

export function Mark({ size = 28, accent = false }: { size?: number; accent?: boolean }) {
  return (
    <svg width={size} height={size} viewBox="0 0 100 100" aria-hidden="true">
      <rect x="6" y="6" width="88" height="88" fill="none" stroke="#fff" strokeWidth="5" />
      <path
        d="M44 30v34a10 10 0 0 1-20 0v-4M56 94V30h12a12 12 0 0 1 0 24H56"
        fill="none"
        stroke={accent ? GOLD : '#fff'}
        strokeWidth="5"
      />
    </svg>
  )
}

/** Full lockup: N1C frame, monogram, name and year. */
export function Lockup({ width = 132 }: { width?: number }) {
  return (
    <svg width={width} viewBox="0 0 120 140" role="img" aria-label="Jean Paul Barbers N1 City, established 1987">
      <rect x="10" y="3" width="100" height="100" fill="none" stroke="#fff" strokeWidth="2.5" />
      <text x="60" y="34" textAnchor="middle" fill="#fff" fontFamily="Manrope, sans-serif" fontWeight="300" fontSize="18" letterSpacing="2">
        N1C
      </text>
      <path
        d="M52 48v30a9 9 0 0 1-18 0v-3M64 103V48h11a11 11 0 0 1 0 22H64"
        fill="none"
        stroke={GOLD}
        strokeWidth="3"
      />
      <text x="60" y="121" textAnchor="middle" fill="#fff" fontFamily="Manrope, sans-serif" fontWeight="700" fontSize="10.4" letterSpacing="0.6">
        JEAN PAUL BARBERS
      </text>
      <text x="60" y="134" textAnchor="middle" fill="rgba(255,255,255,0.7)" fontFamily="Manrope, sans-serif" fontWeight="500" fontSize="7" letterSpacing="1.4">
        EST. 1987
      </text>
    </svg>
  )
}

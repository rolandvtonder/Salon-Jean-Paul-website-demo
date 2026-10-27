/*
  Responsive photo sources. The four large shop photos also ship at smaller
  widths (name-480.webp, name-960.webp), so a phone on mobile data fetches a
  480px or 960px file instead of the full 1280–1600px one. Every other photo
  is already 600px or less and ships at one size.
*/

const WIDTHS: Record<string, number[]> = {
  'shop-front': [480, 960, 1280],
  'barber-at-work': [480, 881],
  'shop-chairs': [480, 960, 1200],
  team: [480, 960, 1600],
}

export const photo = (name: string) => `/assets/${name}.webp`

/** srcset for a photo, or undefined when it only has one size. The largest
    width is the original file. */
export function photoSet(name: string) {
  const w = WIDTHS[name]
  if (!w) return undefined
  return w.map((x, i) => `/assets/${name}${i === w.length - 1 ? '' : `-${x}`}.webp ${x}w`).join(', ')
}

/** Common `sizes` values for the layouts the photos appear in. */
export const SIZES = {
  full: '100vw',
  wide: '(min-width: 1328px) 1248px, 100vw',
  card: '(min-width: 1024px) 400px, (min-width: 640px) 50vw, 100vw',
  half: '(min-width: 768px) 50vw, 100vw',
  quarter: '(min-width: 768px) 25vw, 50vw',
  thumb: '76px',
}

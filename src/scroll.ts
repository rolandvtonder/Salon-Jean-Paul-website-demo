/*
  Scroll choreography. Carried over from the reference's motion prototype:
  a 20,000ms timeline whose phases are divided by 20,000 so the clock is the
  scrollbar rather than a timer.

      hold 3000ms  ->  group 2 arrives (offscreen, below the fold)
      hold 5000ms  ->  move 1, 6000ms: hero leaves, cards ride in
      hold 1500ms  ->  move 2, 4500ms: cards leave, the crew settles

  Headline words keep the reference's stagger (0 / 75 / 150ms, 300ms each),
  body lines follow at 200 / 275 / 350ms. That cascade is what makes the hero
  read as choreographed instead of faded in.

  The three groups are a vertical filmstrip with parallax, measured off the
  prototype's four frames (artboard px):

      frame      Group 1       Group 2        Group 3
      a          186           -              -
      b          186           1050           -
      c          -774          105            740
      d          -             -1115          144
*/

export const TOTAL_MS = 20000
/* The reference ran 620vh. A salon visitor wants prices and a phone number,
   so the film is shortened; every phase keeps its relative place. */
export const SCROLL_VH = 500
/* Phones and tablets get a shorter film: a thumb covers less ground per
   flick than a wheel, and five screens of intro before the prices is too
   many on a phone. Same phases, less scrolling. */
export const SCROLL_SVH_MOBILE = 320

const at = (ms: number) => ms / TOTAL_MS

/* The hero's reveal (words, body, buttons, offer card) also runs on a real
   clock from page load, at the prototype's own millisecond timings, so a
   visitor who never scrolls still sees the headline. Scrolling can only
   push it further along. A short delay lets the photo and fonts land first. */
export const INTRO_DELAY_MS = 250

/** Phase windows as scroll progress. */
export const P = {
  word: [at(0), at(300)],
  word2: [at(75), at(375)],
  word3: [at(150), at(450)],
  body1: [at(200), at(500)],
  body2: [at(275), at(575)],
  body3: [at(350), at(650)],
  /* today's-offer card: t=200ms, 2084ms slow */
  stat: [at(200), at(2284)],
  g2In: [at(3000), at(3600)],
  move1: [at(8000), at(14000)],
  /* lands at 0.90 so the crew holds for a beat before the sections */
  move2: [at(15500), 0.9],
} as const

/** Desktop artboard offsets, px. */
export const G = {
  g1: { start: 186, end: -774 },
  g2: { enter: 1050, mid: 105, end: -1115 },
  g3: { enter: 1400, mid: 740, end: 144 },
} as const

/** Phone and tablet offsets, in svh, same four frames. */
export const GM = {
  g1: { start: 0, end: -115 },
  g2: { enter: 115, mid: 0, end: -135 },
  g3: { enter: 170, mid: 95, end: 0 },
} as const

/*
  There is no salon footage, so the backdrop is the shop's own photos handed
  over at seams, each easing out of a slow push-in. The seams sit inside the
  holds and moves so a new photo never arrives under a static headline.
*/
export const PHOTOS = [
  { name: 'shop-front', pos: '50% 60%' },
  { name: 'barber-at-work', pos: '50% 30%' },
  { name: 'shop-chairs', pos: '50% 55%' },
  { name: 'team', pos: '50% 30%' },
] as const
export const SEAMS = [0.3, 0.6, 0.8] as const
export const SEAM_BAND = 0.025

/** 0 before `a`, 1 after `b`, cubic-eased between. */
export function span(p: number, [a, b]: readonly [number, number]) {
  if (p <= a) return 0
  if (p >= b) return 1
  const t = (p - a) / (b - a)
  return 1 - Math.pow(1 - t, 3)
}

/** Linear ramp, for positions that should track the scrollbar exactly. */
export function ramp(p: number, [a, b]: readonly [number, number]) {
  if (p <= a) return 0
  if (p >= b) return 1
  return (p - a) / (b - a)
}

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t

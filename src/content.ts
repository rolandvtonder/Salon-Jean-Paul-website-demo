/*
  Everything the shop might want to change lives here: numbers, prices,
  specials, the team. Sourced from the shop's own price list, barber profile
  posts and promo posts in /media, and the N1 City Facebook page.
*/

export const PHONE = { label: '021 595 0119', href: 'tel:+27215950119' }
export const WHATSAPP = {
  label: '078 162 4507',
  href: "https://wa.me/27781624507?text=Hi%20Salon%20Jean%20Paul%20N1%20City%2C%20I'd%20like%20to%20book%20a%20cut.",
}
export const EMAIL = { label: 'info@salonjeanpaul.co.za', href: 'mailto:info@salonjeanpaul.co.za' }
export const CAREERS_EMAIL = { label: 'Andrea@salonjeanpaul.co.za', href: 'mailto:Andrea@salonjeanpaul.co.za?subject=Barber%20application%20-%20N1%20City' }

/* The online booking page (salonjeanpaul.chidesk.com) is switched off by
   the account owner, so Book now opens WhatsApp. Swap the href here once
   online booking is live again. */
export const BOOKING = { label: 'Book now', href: WHATSAPP.href }

export const ADDRESS = {
  lines: ['Shop 76, N1 City Mall', 'Louwtjie Rothman St', 'Cape Town'],
  landmark: 'Opposite School & Leisure',
  directions: 'https://www.google.com/maps/search/?api=1&query=Salon+Jean+Paul+N1+City+Mall+Cape+Town',
  embed: 'https://maps.google.com/maps?q=N1%20City%20Mall%2C%20Cape%20Town&z=16&output=embed',
}

export const SOCIAL = [
  { label: 'Facebook', handle: 'Salon Jean Paul N1 City', href: 'https://www.facebook.com/p/Salon-Jean-Paul-N1-City-Barbers-61567181643896/' },
  { label: 'Instagram', handle: '@salonjeanpaulsa', href: 'https://www.instagram.com/salonjeanpaulsa/' },
]

export const INTRO =
  'At Salon Jean Paul we are professional hair and barbering specialists who create a culture of accountability through educating staff and clients.'

export const EST = 1987

/* The site's own address, once it has one (e.g. 'https://www.example.co.za',
   no trailing slash). Search engines and link previews need absolute URLs:
   when this is set, the build adds canonical links, absolute preview images
   and a sitemap. Until then those are left out rather than guessed. */
export const SITE_URL = ''

export const SITE_NAME = 'Salon Jean Paul N1 City Barbers'
export const HOME_TITLE = `${SITE_NAME} | Fades, blade cuts & beards in N1 City Mall`
export const HOME_DESC =
  'Jean Paul Barbers at Shop 76, N1 City Mall, Cape Town. Fades from R140, blade fades, scissor cuts and beard services. Barbering since 1987. Call 021 595 0119 or WhatsApp 078 162 4507.'

/*
  One page per section. The home page is the scroll scene; every other page
  opens on a photo banner. Order here is the nav order and the "next page"
  chain at the foot of each page.
*/
export type Page = {
  path: string
  nav: string
  eyebrow: string
  title: string
  soft?: string
  lead: string
  photo: string
  pos: string
  blurb: string
  /** document title, before the site name */
  doc: string
  /** meta description for search results and link previews */
  desc: string
}
export const PAGES: Page[] = [
  {
    path: '/services',
    nav: 'Services',
    eyebrow: 'Services & prices',
    title: 'The menu,',
    soft: 'straight up',
    lead: 'Every cut finished properly. Prices in rand; ask your barber about anything not on the board.',
    photo: 'barber-at-work',
    pos: '50% 28%',
    blurb: 'Fades from R140, blade fades, scissor cuts and beards.',
    doc: 'Services & prices',
    desc: 'Salon Jean Paul N1 City price list: fades from R140, blade fades R170, scissor & clipper cuts R170, mohawks R190 and beard services R70–R130. Shop 76, N1 City Mall.',
  },
  {
    path: '/specials',
    nav: 'Specials',
    eyebrow: 'Weekly specials',
    title: 'Pick your day',
    lead: 'Something on most days of the week. The one that applies today is marked.',
    photo: 'clipper-2',
    pos: '50% 30%',
    blurb: "A deal on most weekdays. Today's is marked.",
    doc: 'Weekly specials',
    desc: 'Weekly specials at Salon Jean Paul N1 City: Trendy Tuesday 10% off products, Wax-Off Wednesday 15% off waxing & shaving, Family Friday 10% off, and 20% off for law enforcement Mon–Fri.',
  },
  {
    path: '/barbers',
    nav: 'Barbers',
    eyebrow: 'Meet the barbers',
    title: "Who's on the clippers",
    lead: 'Ask for someone by name when you book, or let us match you with the barber who does your cut best.',
    photo: 'team',
    pos: '50% 28%',
    blurb: 'Junior, Herchelle, Nathaniel, Everntino and the crew.',
    doc: 'Meet the barbers',
    desc: "Meet the barbers at Salon Jean Paul N1 City: Junior, Herchelle, Nathaniel Kannemeyer, Everntino Adams and the crew. Taper and burst fades, scissor cuts, beards and kids' cuts.",
  },
  {
    path: '/gallery',
    nav: 'Gallery',
    eyebrow: 'Gallery',
    title: 'Fresh out the chair',
    lead: 'Straight from the shop floor at N1 City.',
    photo: 'shop-chairs',
    pos: '50% 55%',
    blurb: 'Fades, blade work and twists, off the shop floor.',
    doc: 'Gallery',
    desc: 'Fades, blade work and twists from the shop floor at Salon Jean Paul N1 City Barbers, Shop 76, N1 City Mall, Cape Town.',
  },
  {
    path: '/careers',
    nav: 'Careers',
    eyebrow: 'Careers',
    title: 'Barbers wanted',
    lead: 'Passionate about barbering and great service? Come and work with a team of expert barbers.',
    photo: 'clipper-1',
    pos: '50% 30%',
    blurb: "We're hiring barbers. Send us your CV.",
    doc: 'Careers',
    desc: 'Barbers wanted at Salon Jean Paul N1 City. Passionate about barbering and customer service? Send your CV to Andrea@salonjeanpaul.co.za.',
  },
  {
    path: '/visit',
    nav: 'Visit',
    eyebrow: 'Visit',
    title: 'Shop 76, N1 City',
    lead: 'Inside N1 City Mall, opposite School & Leisure.',
    photo: 'shop-front',
    pos: '50% 60%',
    blurb: 'Shop 76, N1 City Mall. Directions, phone and WhatsApp.',
    doc: 'Visit us',
    desc: 'Salon Jean Paul N1 City Barbers is at Shop 76, N1 City Mall, Louwtjie Rothman St, Cape Town, opposite School & Leisure. Call 021 595 0119 or WhatsApp 078 162 4507.',
  },
]

export const NAV = PAGES.map((p) => ({ t: p.nav, href: p.path }))

export type PriceRow = { name: string; price: string; from?: boolean }
export const SERVICES: { cat: string; note: string; img: string; rows: PriceRow[] }[] = [
  {
    cat: 'Fades',
    note: 'Clean, blended, every time.',
    img: 'fade-closeup',
    rows: [
      { name: 'Normal fade', price: 'R140', from: true },
      { name: 'Fade short', price: 'R150' },
    ],
  },
  {
    cat: 'Blade fades',
    note: 'Down to the skin, finished with a blade.',
    img: 'clipper-1',
    rows: [
      { name: 'Short', price: 'R170' },
      { name: 'Bald cut', price: 'R160' },
      { name: 'Flat top', price: 'R170' },
      { name: 'Trim', price: 'R70' },
      { name: 'Pattern clipper', price: 'R100' },
    ],
  },
  {
    cat: 'Scissor cuts',
    note: 'Length and shape, done by hand.',
    img: 'barber-at-work',
    rows: [
      { name: 'Scissor & clipper', price: 'R170' },
      { name: 'Mohawk', price: 'R190' },
    ],
  },
  {
    cat: 'Beard services',
    note: 'Shape, line-up and trim.',
    img: 'clipper-2',
    rows: [{ name: 'Beard services', price: 'R70 – R130' }],
  },
]
export const ALSO = ['Kiddies cuts', 'Ladies scissor cuts', 'Twists & locs', 'Waxing & shaving']

export type Special = { days: number[]; name: string; figure: number; what: string; detail: string }
/* getDay(): 0 Sunday … 6 Saturday */
export const SPECIALS: Special[] = [
  { days: [2], name: 'Trendy Tuesday', figure: 10, what: 'off all products', detail: 'Stock up on the products we use in the chair.' },
  { days: [3], name: 'Wax-Off Wednesday', figure: 15, what: 'off waxing & shaving', detail: 'All waxing and shaving services, Wednesdays only.' },
  { days: [5], name: 'Family Friday', figure: 10, what: 'off for families', detail: 'Bring a family member in on a Friday.' },
  {
    days: [1, 2, 3, 4, 5],
    name: 'Law Enforcement',
    figure: 20,
    what: 'off barbering, Mon–Fri',
    detail: 'Police, traffic & metro police, fire fighters, correctional services, army and navy.',
  },
]

/** The offer that applies today: a day special first, then the weekday one. */
export function todaysOffer(d = new Date()) {
  const day = d.getDay()
  const special = SPECIALS.find((s) => s.days.length === 1 && s.days[0] === day) ?? SPECIALS.find((s) => s.days.includes(day))
  if (special) return { figure: special.figure, unit: '%', title: special.name, sub: special.what }
  return { figure: d.getFullYear() - EST, unit: 'yrs', title: 'Jean Paul Barbers', sub: `barbering since ${EST}` }
}

export const BARBERS = [
  { name: 'Junior', role: 'Senior Barber', img: 'barber-junior', best: ['Scissor cuts', 'Beard services', 'Kiddies cuts'] },
  { name: 'Herchelle', role: 'Barber', img: 'barber-herchelle', best: ['Taper fade', 'Beard trim', 'Bald blade fade'] },
  { name: 'Nathaniel Kannemeyer', role: 'Barber', img: 'barber-nathaniel', best: ['Texture fades', 'Burst fades', 'Ladies scissor cuts', 'Kiddies cuts'] },
  { name: 'Everntino Adams', role: 'Barber', img: 'barber-everntino', best: ['Taper fade', 'Blade fade', 'Scissor cut'] },
]

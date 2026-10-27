import Nav from './Nav'
import Stage from './Stage'
import Footer from './Footer'
import { usePath } from './router'
import { PAGES } from './content'
import { HomeIndex, NotFound, SectionPage, useDocTitle } from './Pages'

/*
  Salon Jean Paul N1 City Barbers. The home page is one scroll-choreographed
  scene over the shop's photos (Stage) and an index of the other pages; each
  section has a page of its own. The nav and footer frame all of them.
*/

function Home() {
  useDocTitle()
  return (
    <>
      <Stage />
      <HomeIndex />
    </>
  )
}

export default function App() {
  const path = usePath()
  const page = PAGES.find((p) => p.path === path)
  return (
    <>
      <a className="skip" href="#main">
        Skip to content
      </a>
      <Nav />
      {path === '/' ? <Home /> : page ? <SectionPage key={page.path} page={page} /> : <NotFound />}
      <Footer />
    </>
  )
}

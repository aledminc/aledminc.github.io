import { Outlet } from 'react-router-dom'
import NavHeader from './NavHeader.jsx'
import Footer from './Footer.jsx'
import './Layout.css'

export default function Layout() {
  return (
    <div className="shell">
      <NavHeader />
      {/* No padding-top here on purpose: the nav is position:sticky, so it
          still occupies flow space and cannot overlap content — padding would
          just add a blank nav-height gap. Anchor jumps are handled instead by
          scroll-padding-top on <html> in index.css. */}
      <main className="shell__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

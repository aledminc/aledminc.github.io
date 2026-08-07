import { useEffect } from 'react'
import { Outlet, useLocation } from 'react-router-dom'
import NavHeader from './NavHeader.jsx'
import Footer from './Footer.jsx'
import MeridianField from './MeridianField.jsx'
import './Layout.css'

export default function Layout() {
  const { pathname } = useLocation()

  // Every page opens at the top. Without this a route change keeps the old
  // scroll offset, which lands you mid-scene with the entrance already spent.
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <div className="shell">
      {/* Fixed, behind everything, shared by every route — see MeridianField. */}
      <MeridianField />
      <NavHeader />
      {/* The nav is fixed, so main has to reserve its height itself. */}
      <main className="shell__main">
        <Outlet />
      </main>
      <Footer />
    </div>
  )
}

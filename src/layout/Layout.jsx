import { Outlet, useLocation } from 'react-router-dom'
import NavHeader from './NavHeader.jsx'
import Footer from './Footer.jsx'
import MeridianField from './MeridianField.jsx'
import SceneDeck from './SceneDeck.jsx'
import './Layout.css'

export default function Layout() {
  const { pathname } = useLocation()
  const isHome = pathname === '/'

  return (
    <div className={`shell${isHome ? ' shell--deck' : ''}`}>
      {/* Fixed, behind everything, shared by every route — see MeridianField. */}
      <MeridianField variant={isHome ? 'home' : 'standard'} />
      <NavHeader />
      {isHome ? (
        <SceneDeck routeKey={pathname}>
          <Outlet />
          <Footer />
        </SceneDeck>
      ) : (
        <>
          <main className="shell__main"><Outlet /></main>
          <Footer />
        </>
      )}
    </div>
  )
}

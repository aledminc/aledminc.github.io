import { Outlet, useLocation } from 'react-router-dom'
import NavHeader from './NavHeader.jsx'
import Footer from './Footer.jsx'
import MeridianField from './MeridianField.jsx'
import SceneDeck from './SceneDeck.jsx'
import './Layout.css'

export default function Layout() {
  const { pathname } = useLocation()

  return (
    <div className="shell">
      {/* Fixed, behind everything, shared by every route — see MeridianField. */}
      <MeridianField />
      <NavHeader />
      <SceneDeck routeKey={pathname}>
        <Outlet />
        <Footer />
      </SceneDeck>
    </div>
  )
}

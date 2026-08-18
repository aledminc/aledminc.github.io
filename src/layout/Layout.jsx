import { Outlet } from 'react-router-dom'
import NavHeader from './NavHeader.jsx'
import Footer from './Footer.jsx'
import MeridianField from './MeridianField.jsx'
import './Layout.css'

export default function Layout() {
  return (
    <div className="shell">
      {/* Fixed, behind everything, shared by every route — see MeridianField. */}
      <MeridianField variant="home" />
      <NavHeader />
      <main className="shell__main"><Outlet /></main>
      <Footer />
    </div>
  )
}

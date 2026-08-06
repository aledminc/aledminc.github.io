import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { FaXTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa6'
import { LuMail, LuMenu, LuX } from 'react-icons/lu'
import { socials, contactEmail } from '../data/socials.js'

// lucide-react v1 dropped brand icons, so socials come from react-icons/fa6
// (the alternative the build plan allows) and UI glyphs from its Lucide set.
const SOCIAL_ICONS = {
  x: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
}

function SocialLinks({ size = 20 }) {
  return socials.map(({ id, label, url }) => {
    const Icon = SOCIAL_ICONS[id]
    return (
      <a
        key={id}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={label}
        className="social"
      >
        <Icon size={size} />
      </a>
    )
  })
}

export default function NavHeader() {
  const [open, setOpen] = useState(false)
  const { pathname } = useLocation()

  // Navigating from inside the drawer should dismiss it.
  useEffect(() => setOpen(false), [pathname])

  // Escape closes the drawer for keyboard users.
  useEffect(() => {
    if (!open) return
    const onKeyDown = (e) => {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className="nav">
      <div className="nav__inner">
        {/* LEFT: logo + wordmark, links home */}
        <NavLink to="/" className="nav__brand">
          <img src="/assets/logo.svg" alt="" className="nav__logo" />
          <span className="nav__name">Xander Minch</span>
        </NavLink>

        {/* CENTER: page nav */}
        <nav className="nav__links" aria-label="Main">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/schedule">Schedule</NavLink>
        </nav>

        {/* RIGHT: socials, then the contact CTA */}
        <div className="nav__right">
          <div className="nav__socials">
            <SocialLinks />
          </div>
          <a href={`mailto:${contactEmail}`} className="nav__cta">
            <LuMail size={16} /> Get in touch
          </a>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <LuX size={22} /> : <LuMenu size={22} />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      {/* MOBILE: below 768px the center links and socials live here */}
      <div
        id="mobile-drawer"
        className={`nav__drawer${open ? ' nav__drawer--open' : ''}`}
        hidden={!open}
      >
        <nav className="nav__drawer-links" aria-label="Main (mobile)">
          <NavLink to="/" end>
            Home
          </NavLink>
          <NavLink to="/projects">Projects</NavLink>
          <NavLink to="/schedule">Schedule</NavLink>
        </nav>
        <div className="nav__drawer-socials">
          <SocialLinks size={22} />
          <a href={`mailto:${contactEmail}`} className="nav__cta">
            <LuMail size={16} /> Get in touch
          </a>
        </div>
      </div>
    </header>
  )
}

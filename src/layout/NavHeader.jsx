import { useEffect, useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { LuArrowUpRight, LuMenu, LuX } from 'react-icons/lu'
import { contactEmail } from '../data/socials.js'

// Three routes, in order. The index drives the sliding indicator, so this
// array is the single source of truth for both the links and the pill.
const ROUTES = [
  { to: '/', label: 'Index' },
  { to: '/projects', label: 'Work' },
  { to: '/schedule', label: 'Schedule' },
]

export default function NavHeader() {
  const [open, setOpen] = useState(false)
  const [lifted, setLifted] = useState(false)
  const { pathname } = useLocation()

  // Which pill the indicator sits under. Unknown routes fall back to Index,
  // matching the catch-all route in App.jsx.
  const activeIndex = Math.max(
    0,
    ROUTES.findIndex((r) => (r.to === '/' ? pathname === '/' : pathname.startsWith(r.to))),
  )

  useEffect(() => setOpen(false), [pathname])

  // All routes use normal document flow, so the header lifts from scrollY.
  useEffect(() => {
    const onScroll = () => setLifted(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', onScroll)
    }
  }, [pathname])

  useEffect(() => {
    if (!open) return undefined
    const onKeyDown = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [open])

  return (
    <header className={`nav${lifted ? ' nav--lifted' : ''}`}>
      <div className="nav__inner">
        <NavLink to="/" className="nav__brand" aria-label="Xander Minch — home">
          <img src="/assets/logo.svg" alt="" className="nav__logo" />
          <span className="nav__name">
            <strong>Xander Minch</strong>
            <small>CS · Intelligent systems</small>
          </span>
        </NavLink>

        {/* Pressed track with a raised pill that slides between routes. The
            pill is one element translated by index, not three states — so the
            movement is continuous instead of a cross-fade. */}
        <nav className="nav__links" aria-label="Main">
          <span
            className="nav__pill"
            aria-hidden="true"
            style={{ '--i': activeIndex, '--n': ROUTES.length }}
          />
          {ROUTES.map((r) => (
            <NavLink key={r.to} to={r.to} end={r.to === '/'}>
              {r.label}
            </NavLink>
          ))}
        </nav>

        <div className="nav__right">
          <a href={`mailto:${contactEmail}`} className="nav__cta">
            Get in touch <LuArrowUpRight size={15} />
          </a>
          <button
            type="button"
            className="nav__toggle"
            aria-expanded={open}
            aria-controls="mobile-drawer"
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <LuX size={20} /> : <LuMenu size={20} />}
            <span className="sr-only">{open ? 'Close menu' : 'Open menu'}</span>
          </button>
        </div>
      </div>

      <div
        id="mobile-drawer"
        className={`nav__drawer${open ? ' nav__drawer--open' : ''}`}
        hidden={!open}
      >
        <nav aria-label="Main (mobile)">
          {ROUTES.map((r) => (
            <NavLink key={r.to} to={r.to} end={r.to === '/'}>
              {r.label}
            </NavLink>
          ))}
        </nav>
        <a href={`mailto:${contactEmail}`} className="btn nav__drawer-cta">
          Get in touch <LuArrowUpRight size={15} />
        </a>
      </div>
    </header>
  )
}

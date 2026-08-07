import { FaXTwitter, FaInstagram, FaLinkedinIn, FaGithub } from 'react-icons/fa6'
import { LuArrowUpRight } from 'react-icons/lu'
import { socials, contactEmail } from '../data/socials.js'

const SOCIAL_ICONS = {
  x: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
}

// The socials live here and nowhere else. They used to sit in the nav too,
// which meant six competing targets in a bar that should hold one.
const LINKS = [
  ...socials,
  { id: 'github', label: 'GitHub', url: 'https://github.com/aledminc' },
]

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <p className="eyebrow">Open to 2027 roles</p>

        {/* The whole footer is one call to action. Nothing else competes. */}
        <a className="footer__mail" href={`mailto:${contactEmail}`}>
          <span>{contactEmail}</span>
          <LuArrowUpRight size={28} />
        </a>

        <div className="footer__base">
          <small>© {new Date().getFullYear()} Xander Minch · Bloomington, IN</small>
          <div className="footer__socials">
            {LINKS.map(({ id, label, url }) => {
              const Icon = SOCIAL_ICONS[id] ?? FaGithub
              return (
                <a
                  key={id}
                  href={url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={label}
                  className="footer__social"
                >
                  <Icon size={16} />
                </a>
              )
            })}
          </div>
        </div>
      </div>
    </footer>
  )
}

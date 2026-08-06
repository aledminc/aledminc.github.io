import { FaXTwitter, FaInstagram, FaLinkedinIn } from 'react-icons/fa6'
import { socials, contactEmail } from '../data/socials.js'

const SOCIAL_ICONS = {
  x: FaXTwitter,
  instagram: FaInstagram,
  linkedin: FaLinkedinIn,
}

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container footer__inner">
        <small className="footer__copy">
          © {new Date().getFullYear()} Xander Minch
        </small>

        <div className="footer__links">
          {socials.map(({ id, label, url }) => {
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
                <Icon size={18} />
              </a>
            )
          })}
          <a href={`mailto:${contactEmail}`} className="footer__mail">
            {contactEmail}
          </a>
        </div>
      </div>
    </footer>
  )
}

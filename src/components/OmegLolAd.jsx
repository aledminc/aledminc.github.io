import { LuArrowUpRight } from 'react-icons/lu'
import './OmegLolAd.css'

export default function OmegLolAd() {
  return (
    <a
      className="omeglol-ad"
      href="https://omeglol.com"
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Play omegLOL at omeglol.com"
    >
      <img
        src="/assets/projects/omeglol-ad.png"
        alt="An omegLOL live comedy duel between two webcam players"
      />
      <span className="omeglol-ad__copy">
        <span>
          <small>Featured build</small>
          <strong>Check out omegLOL, a PvP laugh-based game.</strong>
        </span>
        <i aria-hidden="true"><LuArrowUpRight size={18} /></i>
      </span>
    </a>
  )
}

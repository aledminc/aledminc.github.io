import { LuArrowUpRight, LuFileText } from 'react-icons/lu'
import './ResumePanel.css'

const RESUME_URL = '/assets/resume/xander-minch-resume-2026.pdf'

export default function ResumePanel() {
  return (
    <a
      className="resume-panel"
      href={RESUME_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Open Xander Minch's 2026 resume PDF"
    >
      <span className="resume-panel__preview">
        <img
          src="/assets/resume/xander-minch-resume-preview.png"
          alt="Preview of Xander Minch's 2026 resume"
        />
      </span>

      <span className="resume-panel__footer">
        <span className="resume-panel__title">
          <i aria-hidden="true"><LuFileText size={16} /></i>
          <span>
            <small>PDF · 2026</small>
            <strong>Resume</strong>
          </span>
        </span>
        <i className="resume-panel__open" aria-hidden="true">
          <LuArrowUpRight size={18} />
        </i>
      </span>
    </a>
  )
}

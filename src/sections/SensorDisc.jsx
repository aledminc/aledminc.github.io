/**
 * A small, legible inference instrument for the hero.
 *
 * The three signals are drawn from the work named in the hero copy. Animated
 * packets converge on one model, then leave as a decision. The motion now
 * explains "systems that sense and decide" instead of acting as an unrelated
 * radar ornament.
 */
const INPUTS = [
  { y: 72, code: 'RNA', label: 'cell profile', delay: '0s' },
  { y: 168, code: 'TXT', label: 'clinical note', delay: '-1.6s' },
  { y: 264, code: 'RGB·D', label: 'rover vision', delay: '-3.2s' },
]

export default function SensorDisc() {
  return (
    <div className="disc system-map">
      <div className="system-map__bar">
        <span><i aria-hidden="true" /> Live inference</span>
        <b>03 channels</b>
      </div>

      <div className="system-map__stage">
        <svg className="system-map__svg" viewBox="0 0 560 336" role="img" aria-label="Three data signals converging through a model into a decision">
          <defs>
            <linearGradient id="signal-path" x1="0" y1="0" x2="1" y2="0">
              <stop offset="0" stopColor="#33507a" stopOpacity=".2" />
              <stop offset=".62" stopColor="#17304f" stopOpacity=".72" />
              <stop offset="1" stopColor="#2c6a51" stopOpacity=".55" />
            </linearGradient>
            <radialGradient id="packet-glow">
              <stop offset="0" stopColor="#65b58c" stopOpacity="1" />
              <stop offset="1" stopColor="#65b58c" stopOpacity="0" />
            </radialGradient>
            <filter id="soft-glow" x="-200%" y="-200%" width="400%" height="400%">
              <feGaussianBlur stdDeviation="4" />
            </filter>
          </defs>

          <g className="system-map__grid" aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => <line key={`v${i}`} x1={40 + i * 80} y1="20" x2={40 + i * 80} y2="316" />)}
            {Array.from({ length: 4 }, (_, i) => <line key={`h${i}`} x1="18" y1={48 + i * 80} x2="542" y2={48 + i * 80} />)}
          </g>

          {INPUTS.map((input) => {
            const path = `M132 ${input.y} C220 ${input.y}, 214 168, 294 168`
            return (
              <g key={input.code}>
                <path className="system-map__path" d={path} />
                <g className="system-map__packet" style={{ '--packet-delay': input.delay }}>
                  <circle r="12" fill="url(#packet-glow)" filter="url(#soft-glow)" />
                  <circle r="3.5" fill="#2c6a51" />
                  <animateMotion dur="4.8s" begin={input.delay} repeatCount="indefinite" path={path} />
                </g>
              </g>
            )
          })}

          <path className="system-map__path system-map__path--out" d="M366 168 C410 168, 426 168, 468 168" />
          <g className="system-map__packet system-map__packet--out">
            <circle r="15" fill="url(#packet-glow)" filter="url(#soft-glow)" />
            <circle r="4" fill="#1c4335" />
            <animateMotion dur="2.4s" begin="-1.2s" repeatCount="indefinite" path="M366 168 C410 168, 426 168, 468 168" />
          </g>

          {INPUTS.map((input) => (
            <g className="system-map__input" key={`label-${input.code}`} transform={`translate(30 ${input.y - 26})`}>
              <rect width="102" height="52" rx="12" />
              <text className="system-map__code" x="13" y="21">{input.code}</text>
              <text className="system-map__label" x="13" y="38">{input.label}</text>
              <circle cx="92" cy="26" r="3" />
            </g>
          ))}

          <g className="system-map__core" transform="translate(294 106)">
            <rect width="72" height="124" rx="22" />
            <circle cx="36" cy="62" r="23" />
            <path d="M24 62h24M36 50v24" />
            <text x="36" y="98">MODEL</text>
          </g>

          <g className="system-map__decision" transform="translate(468 124)">
            <rect width="72" height="88" rx="15" />
            <text x="36" y="24">DECIDE</text>
            <path d="M21 50l10 10 21-24" />
            <text className="system-map__ready" x="36" y="76">READY</text>
          </g>
        </svg>
      </div>

      <div className="system-map__readout">
        <span>Sense</span><i aria-hidden="true" /><span>Interpret</span><i aria-hidden="true" /><strong>Act</strong>
      </div>
    </div>
  )
}

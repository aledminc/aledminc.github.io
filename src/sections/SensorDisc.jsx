/**
 * The hero's one visual: a perception module.
 *
 * Concentric range rings, a beam sweeping once every SWEEP seconds, and a
 * handful of contacts that light up as the beam crosses them. Each contact's
 * animation-delay is derived from its own bearing, so the pulse is *caused*
 * by the beam rather than merely coincident with it — that is the whole
 * illusion, and it costs nothing at runtime.
 *
 * Pure SVG + CSS: no canvas, no rAF, crisp at any size, and it stops dead
 * under prefers-reduced-motion.
 */

const SWEEP = 7 // seconds per revolution — slow enough to read as instrument

// Bearings in degrees clockwise from 12 o'clock, radius as a fraction of the
// outermost ring. Hand-placed so the module never looks evenly spaced.
const CONTACTS = [
  { a: 34, r: 0.82, size: 5 },
  { a: 108, r: 0.46, size: 7 },
  { a: 163, r: 0.9, size: 4 },
  { a: 214, r: 0.63, size: 6 },
  { a: 287, r: 0.34, size: 5 },
  { a: 322, r: 0.76, size: 4.5 },
]

const R = 152 // outer ring radius in viewBox units
const C = 200 // centre

const polar = (deg, radius) => {
  const rad = ((deg - 90) * Math.PI) / 180
  return [C + Math.cos(rad) * radius, C + Math.sin(rad) * radius]
}

export default function SensorDisc() {
  return (
    <div className="disc">
      <div className="disc__bezel">
        <div className="disc__face">
          <svg className="disc__svg" viewBox="0 0 400 400" aria-hidden="true">
            <defs>
              {/* The beam: opaque at the leading edge, gone by the tail. */}
              <linearGradient id="beam" x1="0" y1="1" x2="0.9" y2="0">
                <stop offset="0" stopColor="#2c6a51" stopOpacity="0" />
                <stop offset="1" stopColor="#2c6a51" stopOpacity="0.34" />
              </linearGradient>
              <radialGradient id="core" cx="0.5" cy="0.5" r="0.5">
                <stop offset="0" stopColor="#3f8a68" stopOpacity="0.55" />
                <stop offset="1" stopColor="#3f8a68" stopOpacity="0" />
              </radialGradient>
            </defs>

            {/* range rings */}
            <g className="disc__rings" fill="none" stroke="#17304f">
              <circle cx={C} cy={C} r={R} strokeOpacity="0.2" />
              <circle cx={C} cy={C} r={R * 0.72} strokeOpacity="0.14" />
              <circle cx={C} cy={C} r={R * 0.44} strokeOpacity="0.11" />
              <circle cx={C} cy={C} r={R * 0.18} strokeOpacity="0.09" />
              <path
                d={`M${C - R} ${C}H${C + R}M${C} ${C - R}V${C + R}`}
                strokeOpacity="0.09"
              />
            </g>

            {/* bearing ticks — every 6°, longer every 30° */}
            <g stroke="#0e1a2b" strokeOpacity="0.26">
              {Array.from({ length: 60 }, (_, i) => {
                const deg = i * 6
                const long = i % 5 === 0
                const [x1, y1] = polar(deg, R + 8)
                const [x2, y2] = polar(deg, R + (long ? 20 : 14))
                return (
                  <line
                    key={deg}
                    x1={x1}
                    y1={y1}
                    x2={x2}
                    y2={y2}
                    strokeWidth={long ? 1.6 : 1}
                    strokeOpacity={long ? 0.4 : 0.2}
                  />
                )
              })}
            </g>

            {/* the sweep */}
            <g className="disc__beam" style={{ '--sweep': `${SWEEP}s` }}>
              <path
                d={`M${C} ${C} L${C} ${C - R} A${R} ${R} 0 0 1 ${polar(64, R)[0]} ${polar(64, R)[1]} Z`}
                fill="url(#beam)"
              />
              <line
                x1={C}
                y1={C}
                x2={C}
                y2={C - R}
                stroke="#2c6a51"
                strokeOpacity="0.7"
                strokeWidth="1.6"
              />
            </g>

            {/* contacts — delay maps each one onto the beam's arrival */}
            {CONTACTS.map((c) => {
              const [x, y] = polar(c.a, R * c.r)
              const delay = `${(-(c.a / 360) * SWEEP).toFixed(3)}s`
              return (
                <g
                  key={c.a}
                  className="disc__contact"
                  style={{ '--sweep': `${SWEEP}s`, '--delay': delay }}
                >
                  <circle cx={x} cy={y} r={c.size * 3.4} fill="url(#core)" className="disc__halo" />
                  <circle cx={x} cy={y} r={c.size} fill="#1c4335" />
                </g>
              )
            })}

            {/* hub */}
            <circle cx={C} cy={C} r="7" fill="#17304f" />
            <circle cx={C} cy={C} r="14" fill="none" stroke="#17304f" strokeOpacity="0.3" />
          </svg>
        </div>
      </div>

      {/* One readout, not a dashboard. */}
      <p className="disc__readout">
        <span>perception</span>
        <b>sweep · 360°</b>
      </p>
    </div>
  )
}

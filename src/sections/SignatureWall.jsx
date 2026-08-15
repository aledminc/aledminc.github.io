import { useLayoutEffect, useRef, useState } from 'react'
import { animate, utils } from 'animejs'
import { LuArrowRight } from 'react-icons/lu'
import { prefersReducedMotion } from '../hooks/useAnimeScope.js'
import { useSceneExit } from '../hooks/useSceneExit.js'
import { useInView } from '../hooks/useInView.js'
import { saveSignature } from '../lib/signatureStore.js'
import SignaturePad from './SignaturePad.jsx'
import './SignatureWall.css'

// Inks, not chalk: the board is a cream drafting sheet now, so marks are the
// same navy and forest the rest of the site is drawn in.
const INKS = ['#17304f', '#1c4335', '#33507a', '#2c6a51']
const HAND_FONTS = ['Caveat', 'Kalam', 'Shadows Into Light', 'Reenie Beanie']

// The sheet is capped so a long session cannot overflow it; oldest marks recycle.
const MAX_MARKS = 40

// Approximate footprint of a mark in sheet-percentage units. Used only for
// collision avoidance, so a rough box is enough — we are preventing exact
// stacking, not doing real layout.
const BOX_W = 22
const BOX_H = 13
const PLACEMENT_TRIES = 8
const MAX_OVERLAP = 0.3

// Smallest trimmed extent we accept as a signature. A stray tap paints a single
// dot that trims to roughly 16px, which would land as an invisible speck.
const MIN_MARK_EXTENT = 30

function overlapRatio(a, b) {
  const ix = Math.max(0, Math.min(a.left + a.w, b.left + b.w) - Math.max(a.left, b.left))
  const iy = Math.max(0, Math.min(a.top + a.h, b.top + b.h) - Math.max(a.top, b.top))
  const area = a.w * a.h
  return area === 0 ? 0 : (ix * iy) / area
}

/** Random hand-placed styling, using anime's utils so the stack stays one. */
function makeStyle(existing) {
  let fallback = null

  for (let i = 0; i < PLACEMENT_TRIES; i++) {
    const scale = utils.random(80, 155) / 100
    const box = {
      left: utils.random(3, 72),
      top: utils.random(6, 76),
      w: BOX_W * scale,
      h: BOX_H * scale,
    }

    const worst = existing.reduce(
      (max, m) => Math.max(max, overlapRatio(box, m.style.box)),
      0,
    )

    const style = {
      box,
      scale,
      rotate: utils.random(-7, 7),
      color: utils.randomPick(INKS),
      font: utils.randomPick(HAND_FONTS),
      // Ink reads as ink because it is uneven — vary the weight of the line.
      inkOpacity: utils.random(70, 96) / 100,
    }

    if (worst <= MAX_OVERLAP) return style
    if (!fallback || worst < fallback.worst) fallback = { style, worst }
  }

  // Every slot was crowded — accept the least-bad rather than looping forever.
  return fallback.style
}

// Xander signs first, so the sheet is never a blank rectangle to the first
// visitor. Fixed placement rather than random so it cannot drift somewhere odd.
// TODO(xander): delete this to start the sheet empty again.
const OWNER_MARK = {
  id: -1,
  kind: 'typed',
  payload: 'Xander Minch',
  createdAt: 0,
  style: {
    box: { left: 9, top: 24, w: 30, h: 16 },
    scale: 1.55,
    rotate: -4,
    color: '#17304f',
    font: 'Caveat',
    inkOpacity: 0.92,
  },
}

export default function SignatureWall() {
  const scene = useSceneExit()
  const [marks, setMarks] = useState([OWNER_MARK])
  const [mode, setMode] = useState('draw') // draw | type
  const [typed, setTyped] = useState('')
  const [strokes, setStrokes] = useState(0)
  const [error, setError] = useState('')
  const padApi = useRef(null)
  const sheetRef = useRef(null)
  const nextId = useRef(0)
  const reached = useInView(scene)

  // No anime scope on this section at all. The intro is CSS (`is-in`), and
  // the marks are animated one at a time below — a scope revert would strip
  // the inline transforms off every signature already on the sheet.

  const addMark = (kind, payload, extra = {}) => {
    setMarks((prev) => {
      const style = makeStyle(prev)
      const mark = {
        id: nextId.current++,
        kind,
        payload,
        style,
        createdAt: Date.now(),
        ...extra,
      }

      // Seam for a shared sheet later; a no-op in the static build.
      saveSignature(mark)

      const next = [...prev, mark]
      return next.length > MAX_MARKS ? next.slice(next.length - MAX_MARKS) : next
    })
  }

  // One submit path for both modes, so the scene keeps exactly one action.
  const submit = (e) => {
    e.preventDefault()

    if (mode === 'type') {
      const name = typed.trim()
      if (!name) return setError('Type a name first.')
      setError('')
      addMark('typed', name.slice(0, 24))
      setTyped('')
      return
    }

    const api = padApi.current
    const exported = api && !api.isEmpty() ? api.exportTrimmedPNG() : null
    if (!exported) return setError('Draw something first.')
    if (Math.max(exported.width, exported.height) < MIN_MARK_EXTENT) {
      return setError('That is just a dot — try signing your name.')
    }
    setError('')
    addMark('drawn', exported.dataUrl, {
      aspect: `${exported.width} / ${exported.height}`,
    })
    api.clear()
  }

  const canSubmit = mode === 'type' ? Boolean(typed.trim()) : strokes > 0

  // Entrance for the newest mark only.
  //
  // useLayoutEffect, not useEffect: this runs after the DOM update but before
  // paint, so the mark is never painted at full opacity first. With useEffect
  // it would flash.
  useLayoutEffect(() => {
    if (marks.length === 0 || prefersReducedMotion()) return
    const last = marks[marks.length - 1]
    const el = sheetRef.current?.querySelector(`[data-mark-id="${last.id}"]`)
    if (!el) return

    el.style.opacity = '0'
    animate(el, {
      opacity: [0, 1],
      // The mark's resting size and tilt live on the standalone CSS `scale`
      // and `rotate` properties, which compose with `transform` rather than
      // being overwritten by it — so this is a multiplier on the resting
      // scale and anime never clobbers the placement.
      scale: [0.55, 1],
      duration: 620,
      ease: 'out(3)',
    })
  }, [marks])

  return (
    <section
      ref={scene}
      className={`scene wall${reached ? ' is-in' : ''}`}
      data-scene
      data-scene-label="Signature"
      aria-labelledby="wall-heading"
    >
      {/* Flipped again: text right, sheet left. Four scenes, four different
          arrangements of the same two columns. */}
      <div className="container split split--flip wall__grid">
        <div className="layer layer--right layer--soft split__aside wall__side">
          <header className="wall__head">
            <p className="eyebrow">Visitors</p>
            <h2 id="wall-heading">Sign the sheet.</h2>
            <p className="lede">
              Draw it or type it. It gets inked on in a random hand and stays
              for your visit.
            </p>
          </header>

          <form className="wall__capture" onSubmit={submit}>
            <div className="switch" role="group" aria-label="Signature method">
              <button
                type="button"
                className={`switch__opt${mode === 'draw' ? ' is-active' : ''}`}
                aria-pressed={mode === 'draw'}
                onClick={() => {
                  setMode('draw')
                  setError('')
                }}
              >
                Draw
              </button>
              <button
                type="button"
                className={`switch__opt${mode === 'type' ? ' is-active' : ''}`}
                aria-pressed={mode === 'type'}
                onClick={() => {
                  setMode('type')
                  setError('')
                }}
              >
                Type
              </button>
            </div>

            <div className="wall__input">
              {mode === 'draw' ? (
                <SignaturePad apiRef={padApi} onStrokesChange={setStrokes} />
              ) : (
                <label className="wall__typed">
                  <span className="sr-only">Your name</span>
                  <input
                    type="text"
                    value={typed}
                    onChange={(e) => setTyped(e.target.value)}
                    maxLength={24}
                    placeholder="Your name"
                    autoComplete="off"
                  />
                </label>
              )}
            </div>

            <button type="submit" className="btn wall__submit" disabled={!canSubmit}>
              Add to sheet <LuArrowRight size={16} />
            </button>
          </form>

          <p className="wall__note" role="status">
            {error || `${marks.length} of ${MAX_MARKS} signed — yours stays for this visit.`}
          </p>
        </div>

        {/* Opens and closes as a horizontal shutter — see .layer--iris. */}
        <div className="layer layer--iris split__main wall__stage">
          <div className="sheet" ref={sheetRef}>
            <span className="sheet__ticks" aria-hidden="true" />

            {marks.length === 0 && (
              <p className="sheet__empty">The sheet is clean. Go on.</p>
            )}

            <ul className="sheet__marks">
              {marks.map((m) => (
                <li
                  key={m.id}
                  data-mark-id={m.id}
                  className={`mark mark--${m.kind}`}
                  style={{
                    left: `${m.style.box.left}%`,
                    top: `${m.style.box.top}%`,
                    scale: m.style.scale,
                    rotate: `${m.style.rotate}deg`,
                  }}
                >
                  {m.kind === 'drawn' ? (
                    // Tinted through mask-image rather than drawn directly, so
                    // one white-stroke PNG can take any ink colour.
                    <span
                      className="mark__ink mark__ink--drawn"
                      style={{
                        backgroundColor: m.style.color,
                        opacity: m.style.inkOpacity,
                        maskImage: `url(${m.payload})`,
                        WebkitMaskImage: `url(${m.payload})`,
                        aspectRatio: m.aspect,
                      }}
                      role="img"
                      aria-label="A visitor's signature"
                    />
                  ) : (
                    <span
                      className="mark__ink"
                      style={{
                        color: m.style.color,
                        fontFamily: `'${m.style.font}', cursive`,
                        opacity: m.style.inkOpacity,
                      }}
                    >
                      {m.payload}
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>
    </section>
  )
}

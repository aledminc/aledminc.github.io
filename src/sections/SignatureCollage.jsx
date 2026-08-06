import { useLayoutEffect, useRef, useState } from 'react'
import { animate, utils } from 'animejs'
import { useAnimeScope, prefersReducedMotion } from '../hooks/useAnimeScope.js'
import { saveSignature } from '../lib/signatureStore.js'
import SignaturePad from './SignaturePad.jsx'
import './SignatureCollage.css'

const CHALK_COLORS = ['#ffffff', '#fdf3b0', '#ffc4d6', '#bfe3ff']
const HAND_FONTS = ['Caveat', 'Kalam', 'Shadows Into Light', 'Reenie Beanie']

// Board is capped so a long session cannot overflow it; oldest marks recycle.
const MAX_MARKS = 40

// Approximate footprint of a mark in board-percentage units. Used only for
// collision avoidance, so a rough box is enough — we are preventing exact
// stacking, not doing real layout.
const BOX_W = 22
const BOX_H = 13
const PLACEMENT_TRIES = 8
const MAX_OVERLAP = 0.3

// Smallest trimmed extent we accept as a signature. A stray tap paints a single
// dot that trims to roughly 16px, which would land on the board as an invisible
// speck; anything deliberate is far wider than this.
const MIN_MARK_EXTENT = 30

function overlapRatio(a, b) {
  const ix = Math.max(0, Math.min(a.left + a.w, b.left + b.w) - Math.max(a.left, b.left))
  const iy = Math.max(0, Math.min(a.top + a.h, b.top + b.h) - Math.max(a.top, b.top))
  const area = a.w * a.h
  return area === 0 ? 0 : (ix * iy) / area
}

/**
 * Random hand-placed styling. Uses anime's utils.random / randomPick to stay
 * consistent with the rest of the stack.
 */
function makeStyle(existing) {
  let fallback = null

  for (let i = 0; i < PLACEMENT_TRIES; i++) {
    const scale = utils.random(80, 160) / 100
    const box = {
      left: utils.random(3, 74),
      top: utils.random(5, 78),
      w: BOX_W * scale,
      h: BOX_H * scale,
    }

    // Existing marks carry their box at style.box, not box.
    const worst = existing.reduce(
      (max, m) => Math.max(max, overlapRatio(box, m.style.box)),
      0,
    )

    const style = {
      box,
      scale,
      rotate: utils.random(-8, 8),
      color: utils.randomPick(CHALK_COLORS),
      font: utils.randomPick(HAND_FONTS),
      // Chalk reads as chalk because it is uneven — vary opacity, and smudge a
      // minority of marks very slightly.
      inkOpacity: utils.random(78, 100) / 100,
      blur: utils.random(0, 10) > 7 ? 0.4 : 0,
    }

    if (worst <= MAX_OVERLAP) return style
    if (!fallback || worst < fallback.worst) fallback = { style, worst }
  }

  // Every slot was crowded — accept the least-bad rather than looping forever.
  return fallback.style
}

export default function SignatureCollage() {
  const [marks, setMarks] = useState([])
  const [typed, setTyped] = useState('')
  const [strokes, setStrokes] = useState(0)
  const [error, setError] = useState('')
  const padApi = useRef(null)
  const boardRef = useRef(null)
  const nextId = useRef(0)

  // Section chrome entrance. Marks are animated separately and deliberately
  // NOT through this scope: a scope revert would strip the inline transforms
  // off every signature already on the board.
  const { root } = useAnimeScope(() => {
    animate('.collage__intro', {
      opacity: [0, 1],
      translateY: [18, 0],
      duration: 550,
      ease: 'out(2)',
    })
  })

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

      // Seam for a shared board later; a no-op in the static build.
      saveSignature(mark)

      const next = [...prev, mark]
      return next.length > MAX_MARKS ? next.slice(next.length - MAX_MARKS) : next
    })
  }

  const handleAddDrawing = () => {
    const api = padApi.current
    if (!api || api.isEmpty()) {
      setError('Draw something first.')
      return
    }
    const exported = api.exportTrimmedPNG()
    if (!exported) {
      setError('Draw something first.')
      return
    }
    if (Math.max(exported.width, exported.height) < MIN_MARK_EXTENT) {
      setError('That is just a dot — try signing your name.')
      return
    }
    setError('')
    addMark('drawn', exported.dataUrl, {
      aspect: `${exported.width} / ${exported.height}`,
    })
    api.clear()
  }

  const handleAddTyped = (e) => {
    e.preventDefault()
    const name = typed.trim()
    if (!name) {
      setError('Type a name first.')
      return
    }
    setError('')
    addMark('typed', name.slice(0, 24))
    setTyped('')
  }

  // Entrance for the newest mark only.
  //
  // useLayoutEffect, not useEffect: this runs after the DOM update but before
  // the browser paints, so setting opacity to 0 here means the mark is never
  // painted at full opacity first. With useEffect it would flash.
  useLayoutEffect(() => {
    if (marks.length === 0 || prefersReducedMotion()) return
    const last = marks[marks.length - 1]
    const el = boardRef.current?.querySelector(`[data-mark-id="${last.id}"]`)
    if (!el) return

    el.style.opacity = '0'
    animate(el, {
      opacity: [0, 1],
      // The mark's resting size and tilt live on the standalone CSS `scale` and
      // `rotate` properties, which compose with `transform` rather than being
      // overwritten by it. So this scale is a multiplier on top of the resting
      // one, and anime never clobbers the placement.
      scale: [0.6, 1],
      duration: 600,
      ease: 'out(3)',
    })
  }, [marks])

  return (
    <section ref={root} className="collage" aria-labelledby="collage-heading">
      <div className="container">
        <div className="collage__intro">
          <h2 id="collage-heading">Sign the board</h2>
          <p className="collage__sub">
            Draw your signature or type your name — it gets chalked onto the
            board in a random hand.
          </p>
        </div>

        {/* ---------- the blackboard ---------- */}
        <div className="board" ref={boardRef}>
          <div className="board__frame" aria-hidden="true" />

          {marks.length === 0 && (
            <p className="board__empty">Be the first to sign.</p>
          )}

          <ul className="board__marks">
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
                  // Tinted with mask-image rather than shown directly, so a
                  // white-stroke PNG can take on any chalk color.
                  <span
                    className="mark__ink mark__ink--drawn"
                    style={{
                      backgroundColor: m.style.color,
                      opacity: m.style.inkOpacity,
                      filter: m.style.blur ? `blur(${m.style.blur}px)` : undefined,
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
                      filter: m.style.blur ? `blur(${m.style.blur}px)` : undefined,
                    }}
                  >
                    {m.payload}
                  </span>
                )}
              </li>
            ))}
          </ul>
        </div>

        {/* ---------- capture controls ---------- */}
        <div className="collage__capture">
          <div className="collage__draw">
            <SignaturePad apiRef={padApi} onStrokesChange={setStrokes} />
            <button
              type="button"
              className="collage__submit"
              onClick={handleAddDrawing}
              disabled={strokes === 0}
            >
              Add to board
            </button>
          </div>

          <form className="collage__typed" onSubmit={handleAddTyped}>
            <label className="collage__label" htmlFor="typed-name">
              …or type your name
            </label>
            <input
              id="typed-name"
              className="collage__input"
              type="text"
              value={typed}
              onChange={(e) => setTyped(e.target.value)}
              maxLength={24}
              placeholder="Your name"
              autoComplete="off"
            />
            <button type="submit" className="collage__submit" disabled={!typed.trim()}>
              Add to board
            </button>
          </form>
        </div>

        <p className="collage__note" role="status">
          {error ||
            `${marks.length}/${MAX_MARKS} on the board — signatures last for this visit only.`}
        </p>
      </div>
    </section>
  )
}

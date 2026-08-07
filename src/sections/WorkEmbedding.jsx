import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/useAnimeScope.js'

/**
 * The hero signature: a cluster embedding of Xander's own work, drawn the way
 * a single-cell UMAP is drawn — because that is literally the plot his
 * bioinformatics research produces. Each cluster is a domain he works in, each
 * point one unit of that work, colored on the viridis ramp.
 *
 * It is a chart, not an ornament: the clusters, their labels and their relative
 * sizes describe the content of this site.
 */

// Positions are in normalized plot space (0..1). Kept apart deliberately so
// clusters read as distinct populations rather than one cloud.
const CLUSTERS = [
  { id: 'ml', label: 'Machine learning', n: 170, token: '--v-violet', x: 0.27, y: 0.3, spread: 0.093 },
  { id: 'systems', label: 'Systems', n: 130, token: '--v-indigo', x: 0.66, y: 0.19, spread: 0.082 },
  { id: 'bio', label: 'Bioinformatics', n: 150, token: '--v-teal', x: 0.2, y: 0.71, spread: 0.088 },
  { id: 'realtime', label: 'Real-time web', n: 115, token: '--v-magenta', x: 0.52, y: 0.55, spread: 0.072 },
  { id: 'robotics', label: 'Robotics', n: 120, token: '--v-amber', x: 0.81, y: 0.74, spread: 0.08 },
]

const CURSOR_RADIUS = 96
const CURSOR_PUSH = 26

/** Box-Muller — real gaussian scatter. Uniform discs look synthetic. */
function gaussian() {
  let u = 0
  let v = 0
  while (u === 0) u = Math.random()
  while (v === 0) v = Math.random()
  return Math.sqrt(-2 * Math.log(u)) * Math.cos(2 * Math.PI * v)
}

function readToken(name, fallback) {
  if (typeof window === 'undefined') return fallback
  const v = getComputedStyle(document.documentElement).getPropertyValue(name).trim()
  return v || fallback
}

export default function WorkEmbedding() {
  const canvasRef = useRef(null)
  const wrapRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const wrap = wrapRef.current
    if (!canvas || !wrap) return undefined

    const ctx = canvas.getContext('2d')
    const reduced = prefersReducedMotion()

    const colors = {
      '--v-violet': readToken('--v-violet', '#7c5cff'),
      '--v-indigo': readToken('--v-indigo', '#4c6fd4'),
      '--v-teal': readToken('--v-teal', '#23b5ac'),
      '--v-magenta': readToken('--v-magenta', '#e86fbe'),
      '--v-amber': readToken('--v-amber', '#ff9e4a'),
    }

    // Build the population once; layout only maps it to pixels.
    const points = []
    for (const c of CLUSTERS) {
      for (let i = 0; i < c.n; i++) {
        points.push({
          // normalized target
          nx: c.x + gaussian() * c.spread,
          ny: c.y + gaussian() * c.spread,
          // current pixel position, filled on first layout
          px: 0,
          py: 0,
          tx: 0,
          ty: 0,
          r: 0.9 + Math.random() * 1.9,
          alpha: 0.45 + Math.random() * 0.5,
          color: colors[c.token],
          phase: Math.random() * Math.PI * 2,
          drift: 0.35 + Math.random() * 0.85,
        })
      }
    }

    let w = 0
    let h = 0
    let dpr = 1
    let seeded = false

    const layout = () => {
      const rect = wrap.getBoundingClientRect()
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = rect.width
      h = rect.height
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const padX = w * 0.06
      const padY = h * 0.08
      for (const p of points) {
        p.tx = padX + p.nx * (w - padX * 2)
        p.ty = padY + p.ny * (h - padY * 2)
      }

      if (!seeded) {
        seeded = true
        for (const p of points) {
          if (reduced) {
            // No entrance: land settled.
            p.px = p.tx
            p.py = p.ty
          } else {
            // Start dispersed, then condense into clusters — the same read as
            // an embedding resolving as it converges.
            const a = Math.random() * Math.PI * 2
            const d = Math.max(w, h) * (0.45 + Math.random() * 0.5)
            p.px = w / 2 + Math.cos(a) * d
            p.py = h / 2 + Math.sin(a) * d
          }
        }
      }
    }

    const pointer = { x: -9999, y: -9999, active: false }
    const onMove = (e) => {
      const rect = wrap.getBoundingClientRect()
      pointer.x = e.clientX - rect.left
      pointer.y = e.clientY - rect.top
      pointer.active = true
    }
    const onLeave = () => {
      pointer.active = false
      pointer.x = -9999
      pointer.y = -9999
    }

    let raf = 0
    let t = 0

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (const p of points) {
        ctx.globalAlpha = p.alpha
        ctx.fillStyle = p.color
        ctx.beginPath()
        ctx.arc(p.px, p.py, p.r, 0, Math.PI * 2)
        ctx.fill()
      }
      ctx.globalAlpha = 1
    }

    const frame = () => {
      t += 0.006
      for (const p of points) {
        // Slow ambient drift keeps the plot alive without drawing attention.
        const dx = Math.cos(t + p.phase) * p.drift
        const dy = Math.sin(t * 0.82 + p.phase) * p.drift
        let goalX = p.tx + dx
        let goalY = p.ty + dy

        if (pointer.active) {
          const ox = p.px - pointer.x
          const oy = p.py - pointer.y
          const dist = Math.hypot(ox, oy)
          if (dist < CURSOR_RADIUS && dist > 0.01) {
            // The plot notices you — points part around the cursor.
            const force = (1 - dist / CURSOR_RADIUS) ** 2 * CURSOR_PUSH
            goalX += (ox / dist) * force
            goalY += (oy / dist) * force
          }
        }

        p.px += (goalX - p.px) * 0.075
        p.py += (goalY - p.py) * 0.075
      }
      draw()
      raf = requestAnimationFrame(frame)
    }

    layout()

    if (reduced) {
      draw()
    } else {
      raf = requestAnimationFrame(frame)
      wrap.addEventListener('pointermove', onMove)
      wrap.addEventListener('pointerleave', onLeave)
    }

    const ro = new ResizeObserver(() => {
      layout()
      if (reduced) draw()
    })
    ro.observe(wrap)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      wrap.removeEventListener('pointermove', onMove)
      wrap.removeEventListener('pointerleave', onLeave)
    }
  }, [])

  return (
    <div className="embed" ref={wrapRef}>
      <canvas ref={canvasRef} className="embed__canvas" aria-hidden="true" />

      {/* Plot furniture: ticks on two edges, so it reads as a chart. */}
      <div className="embed__ticks embed__ticks--x" aria-hidden="true">
        {Array.from({ length: 13 }, (_, i) => (
          <span key={i} />
        ))}
      </div>
      <div className="embed__ticks embed__ticks--y" aria-hidden="true">
        {Array.from({ length: 9 }, (_, i) => (
          <span key={i} />
        ))}
      </div>

      {/* Cluster labels as HTML so they stay crisp and use the real face. */}
      {CLUSTERS.map((c) => (
        <span
          key={c.id}
          className="embed__label"
          style={{
            left: `${6 + c.x * 88}%`,
            top: `${8 + c.y * 84}%`,
            '--c': `var(${c.token})`,
          }}
        >
          <i aria-hidden="true" />
          {c.label}
          <b>{c.n}</b>
        </span>
      ))}

      <p className="embed__caption">
        <span>fig 1</span> work embedded by domain · {CLUSTERS.reduce((n, c) => n + c.n, 0)} points
      </p>
    </div>
  )
}

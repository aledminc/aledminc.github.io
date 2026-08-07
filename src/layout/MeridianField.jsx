import { useEffect, useRef } from 'react'
import { prefersReducedMotion } from '../hooks/useAnimeScope.js'

/**
 * The field the entire site is staged on.
 *
 * Fixed to the viewport and never scrolls, so every page and every scene sits
 * on ONE continuous surface — that continuity is what lets a section leave
 * sideways and the next one arrive without the background ever cutting.
 *
 * What it draws, back to front:
 *   1. two slow tinted washes (navy, forest) that breathe across the page
 *   2. a sensor mesh — drifting nodes wired to their near neighbours, the
 *      way a perception system draws the world it is tracking
 *   3. a scan line sweeping down the mesh, brightening nodes as it passes
 *
 * Everything is held under ~14% alpha. On a cream ground that is enough to
 * feel alive and not enough to compete with a single line of type.
 */

const NODE_AREA = 26000 // one node per this many px² of viewport
const MAX_NODES = 64
const LINK_DIST = 190
const SCAN_PERIOD = 14000 // ms for one full top-to-bottom pass
const SCAN_BAND = 190 // px of influence either side of the scan line

export default function MeridianField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return undefined
    const ctx = canvas.getContext('2d')
    const reduced = prefersReducedMotion()

    let w = 0
    let h = 0
    let nodes = []
    let raf = 0
    let start = 0

    // Pointer parallax. The mesh leans a few pixels toward the cursor — enough
    // to feel responsive on a mouse, invisible on touch.
    const pointer = { x: 0.5, y: 0.4, tx: 0.5, ty: 0.4 }

    const build = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      canvas.style.width = `${w}px`
      canvas.style.height = `${h}px`
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)

      const count = Math.min(MAX_NODES, Math.round((w * h) / NODE_AREA))
      nodes = Array.from({ length: count }, (_, i) => {
        // Deterministic scatter: a golden-angle spiral mapped to the viewport
        // distributes points evenly without the clumping pure random gives.
        const t = (i + 0.5) / count
        const a = i * 2.399963
        return {
          bx: (0.5 + Math.cos(a) * 0.52 * Math.sqrt(t)) * w,
          by: (0.5 + Math.sin(a) * 0.62 * Math.sqrt(t)) * h,
          x: 0,
          y: 0,
          r: 1 + ((i * 37) % 10) / 7,
          phase: (i * 1.77) % (Math.PI * 2),
          speed: 0.35 + ((i * 13) % 10) / 22,
        }
      })
    }

    const onMove = (e) => {
      pointer.tx = e.clientX / Math.max(w, 1)
      pointer.ty = e.clientY / Math.max(h, 1)
    }

    const draw = (now) => {
      if (!start) start = now
      const t = now - start
      pointer.x += (pointer.tx - pointer.x) * 0.03
      pointer.y += (pointer.ty - pointer.y) * 0.03

      ctx.clearRect(0, 0, w, h)

      // ---- 1. washes ----
      const drift = reduced ? 0 : Math.sin(t / 9000)
      const navy = ctx.createRadialGradient(
        w * (0.82 + drift * 0.04), h * 0.06, 0,
        w * (0.82 + drift * 0.04), h * 0.06, Math.max(w, h) * 0.85,
      )
      navy.addColorStop(0, 'rgba(23, 48, 79, 0.1)')
      navy.addColorStop(0.5, 'rgba(23, 48, 79, 0.035)')
      navy.addColorStop(1, 'rgba(23, 48, 79, 0)')
      ctx.fillStyle = navy
      ctx.fillRect(0, 0, w, h)

      const forest = ctx.createRadialGradient(
        w * (0.1 - drift * 0.04), h * 0.96, 0,
        w * (0.1 - drift * 0.04), h * 0.96, Math.max(w, h) * 0.8,
      )
      // Held well under the navy: green over warm cream turns olive fast, and
      // olive is the one direction this palette must not drift.
      forest.addColorStop(0, 'rgba(28, 67, 53, 0.07)')
      forest.addColorStop(0.5, 'rgba(28, 67, 53, 0.022)')
      forest.addColorStop(1, 'rgba(28, 67, 53, 0)')
      ctx.fillStyle = forest
      ctx.fillRect(0, 0, w, h)

      // ---- 2 & 3. mesh + scan ----
      const scanY = reduced ? -9999 : ((t % SCAN_PERIOD) / SCAN_PERIOD) * (h + SCAN_BAND * 2) - SCAN_BAND
      const leanX = (pointer.x - 0.5) * 26
      const leanY = (pointer.y - 0.5) * 18

      for (const n of nodes) {
        const wobble = reduced ? 0 : Math.sin(t * 0.00022 * n.speed + n.phase)
        const wobble2 = reduced ? 0 : Math.cos(t * 0.00019 * n.speed + n.phase)
        n.x = n.bx + wobble * 26 + leanX * n.speed
        n.y = n.by + wobble2 * 20 + leanY * n.speed
        // 0 at rest, 1 when the scan line is directly on the node.
        n.lit = Math.max(0, 1 - Math.abs(n.y - scanY) / SCAN_BAND) ** 2
      }

      ctx.lineWidth = 1
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const a = nodes[i]
          const b = nodes[j]
          const d = Math.hypot(a.x - b.x, a.y - b.y)
          if (d > LINK_DIST) continue
          const near = 1 - d / LINK_DIST
          const lit = Math.max(a.lit, b.lit)
          ctx.strokeStyle = lit > 0.02
            ? `rgba(44, 106, 81, ${(0.07 * near + 0.16 * lit * near).toFixed(4)})`
            : `rgba(23, 48, 79, ${(0.075 * near).toFixed(4)})`
          ctx.beginPath()
          ctx.moveTo(a.x, a.y)
          ctx.lineTo(b.x, b.y)
          ctx.stroke()
        }
      }

      for (const n of nodes) {
        ctx.beginPath()
        ctx.arc(n.x, n.y, n.r + n.lit * 1.6, 0, Math.PI * 2)
        ctx.fillStyle = n.lit > 0.02
          ? `rgba(44, 106, 81, ${(0.2 + n.lit * 0.55).toFixed(3)})`
          : 'rgba(23, 48, 79, 0.22)'
        ctx.fill()
      }

      if (!reduced) raf = requestAnimationFrame(draw)
    }

    build()
    if (reduced) {
      draw(0)
    } else {
      raf = requestAnimationFrame(draw)
      window.addEventListener('pointermove', onMove, { passive: true })
    }

    const onResize = () => {
      build()
      if (reduced) draw(0)
    }
    window.addEventListener('resize', onResize)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', onResize)
      window.removeEventListener('pointermove', onMove)
    }
  }, [])

  return <canvas ref={canvasRef} className="meridian" aria-hidden="true" />
}

import { useCallback, useEffect, useRef, useState } from 'react'
import { LuEraser, LuUndo2 } from 'react-icons/lu'

// Fixed backing-store size so every export has the same resolution regardless
// of how wide the pad is rendered on screen.
const CANVAS_W = 600
const CANVAS_H = 200
const STROKE_WIDTH = 4
const ALPHA_THRESHOLD = 8 // ignore near-transparent antialiasing when trimming
const TRIM_PADDING = 6

/**
 * Crops the transparent margin off a canvas so a signature lands on the board
 * as a tight mark rather than a small scribble inside a large invisible box.
 * Returns null when nothing was drawn.
 */
function trimToContent(canvas) {
  const ctx = canvas.getContext('2d')
  const { width: w, height: h } = canvas
  const { data } = ctx.getImageData(0, 0, w, h)

  let minX = w
  let minY = h
  let maxX = -1
  let maxY = -1

  for (let y = 0; y < h; y++) {
    for (let x = 0; x < w; x++) {
      if (data[(y * w + x) * 4 + 3] > ALPHA_THRESHOLD) {
        if (x < minX) minX = x
        if (x > maxX) maxX = x
        if (y < minY) minY = y
        if (y > maxY) maxY = y
      }
    }
  }

  if (maxX < 0) return null // fully transparent

  minX = Math.max(0, minX - TRIM_PADDING)
  minY = Math.max(0, minY - TRIM_PADDING)
  maxX = Math.min(w - 1, maxX + TRIM_PADDING)
  maxY = Math.min(h - 1, maxY + TRIM_PADDING)

  const tw = maxX - minX + 1
  const th = maxY - minY + 1

  const out = document.createElement('canvas')
  out.width = tw
  out.height = th
  out.getContext('2d').drawImage(canvas, minX, minY, tw, th, 0, 0, tw, th)

  return { dataUrl: out.toDataURL('image/png'), width: tw, height: th }
}

/**
 * Chalk drawing pad. Strokes are kept as point arrays rather than pixel
 * snapshots, which is what makes undo cheap — drop the last stroke and repaint.
 *
 * `apiRef` receives { isEmpty, clear, undo, exportTrimmedPNG } so the parent can
 * drive submission without lifting all the stroke state out of here.
 */
export default function SignaturePad({ apiRef, onStrokesChange }) {
  const canvasRef = useRef(null)
  const strokesRef = useRef([]) // Array<Array<{x, y}>>
  const currentRef = useRef(null)
  const [strokeCount, setStrokeCount] = useState(0)

  const repaint = useCallback(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    ctx.strokeStyle = '#ffffff'
    ctx.lineWidth = STROKE_WIDTH
    ctx.lineCap = 'round'
    ctx.lineJoin = 'round'

    for (const stroke of strokesRef.current) {
      if (stroke.length === 0) continue
      ctx.beginPath()
      if (stroke.length === 1) {
        // A single tap still deserves a dot.
        ctx.arc(stroke[0].x, stroke[0].y, STROKE_WIDTH / 2, 0, Math.PI * 2)
        ctx.fillStyle = '#ffffff'
        ctx.fill()
        continue
      }
      ctx.moveTo(stroke[0].x, stroke[0].y)
      // Quadratic midpoints smooth the polyline into a natural-looking curve.
      for (let i = 1; i < stroke.length - 1; i++) {
        const mx = (stroke[i].x + stroke[i + 1].x) / 2
        const my = (stroke[i].y + stroke[i + 1].y) / 2
        ctx.quadraticCurveTo(stroke[i].x, stroke[i].y, mx, my)
      }
      const last = stroke[stroke.length - 1]
      ctx.lineTo(last.x, last.y)
      ctx.stroke()
    }
  }, [])

  const sync = useCallback(() => {
    const n = strokesRef.current.length
    setStrokeCount(n)
    onStrokesChange?.(n)
  }, [onStrokesChange])

  // Map a pointer event from CSS pixels into canvas coordinate space — the pad
  // is rendered responsively, so these two spaces are not the same.
  const toCanvasPoint = (e) => {
    const canvas = canvasRef.current
    const rect = canvas.getBoundingClientRect()
    return {
      x: ((e.clientX - rect.left) * canvas.width) / rect.width,
      y: ((e.clientY - rect.top) * canvas.height) / rect.height,
    }
  }

  const onPointerDown = (e) => {
    e.preventDefault()
    // Capture keeps strokes tracking even if the pointer leaves the pad.
    e.currentTarget.setPointerCapture?.(e.pointerId)
    currentRef.current = [toCanvasPoint(e)]
    strokesRef.current.push(currentRef.current)
    repaint()
    sync()
  }

  const onPointerMove = (e) => {
    if (!currentRef.current) return
    e.preventDefault()
    currentRef.current.push(toCanvasPoint(e))
    repaint()
  }

  const endStroke = (e) => {
    if (!currentRef.current) return
    e.currentTarget.releasePointerCapture?.(e.pointerId)
    currentRef.current = null
  }

  const clear = useCallback(() => {
    strokesRef.current = []
    currentRef.current = null
    repaint()
    sync()
  }, [repaint, sync])

  const undo = useCallback(() => {
    strokesRef.current.pop()
    repaint()
    sync()
  }, [repaint, sync])

  // Publish the imperative API to the parent.
  useEffect(() => {
    if (!apiRef) return
    apiRef.current = {
      isEmpty: () => strokesRef.current.length === 0,
      clear,
      undo,
      exportTrimmedPNG: () =>
        strokesRef.current.length === 0 ? null : trimToContent(canvasRef.current),
    }
  }, [apiRef, clear, undo])

  return (
    <div className="pad">
      <canvas
        ref={canvasRef}
        className="pad__canvas"
        width={CANVAS_W}
        height={CANVAS_H}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={endStroke}
        onPointerCancel={endStroke}
        aria-label="Signature drawing area"
        role="img"
      />
      {strokeCount === 0 && (
        <span className="pad__hint" aria-hidden="true">
          draw your signature here
        </span>
      )}

      <div className="pad__tools">
        <button
          type="button"
          className="pad__tool"
          onClick={undo}
          disabled={strokeCount === 0}
        >
          <LuUndo2 size={15} /> Undo
        </button>
        <button
          type="button"
          className="pad__tool"
          onClick={clear}
          disabled={strokeCount === 0}
        >
          <LuEraser size={15} /> Clear
        </button>
      </div>
    </div>
  )
}

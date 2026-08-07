import { useEffect, useRef } from 'react'

export default function AmbientField() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    let frame = 0
    let width = 0
    let height = 0
    let dpr = 1
    const pointer = { x: 0.68, y: 0.28, tx: 0.68, ty: 0.28 }
    let stars = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      width = window.innerWidth
      height = window.innerHeight
      canvas.width = width * dpr
      canvas.height = height * dpr
      canvas.style.width = `${width}px`
      canvas.style.height = `${height}px`
      context.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.min(110, Math.round((width * height) / 14000))
      stars = Array.from({ length: count }, (_, index) => ({
        x: ((index * 89.37) % 100) / 100,
        y: ((index * 47.11 + 13) % 100) / 100,
        r: 0.35 + ((index * 17) % 10) / 12,
        phase: index * 0.63,
      }))
    }

    const move = (event) => {
      pointer.tx = event.clientX / Math.max(width, 1)
      pointer.ty = event.clientY / Math.max(height, 1)
    }

    const draw = (time = 0) => {
      pointer.x += (pointer.tx - pointer.x) * 0.025
      pointer.y += (pointer.ty - pointer.y) * 0.025
      context.clearRect(0, 0, width, height)

      const glow = context.createRadialGradient(
        pointer.x * width, pointer.y * height, 0,
        pointer.x * width, pointer.y * height, Math.max(width, height) * 0.48,
      )
      glow.addColorStop(0, 'rgba(113, 78, 255, .13)')
      glow.addColorStop(0.42, 'rgba(30, 205, 190, .045)')
      glow.addColorStop(1, 'rgba(4, 4, 11, 0)')
      context.fillStyle = glow
      context.fillRect(0, 0, width, height)

      for (const star of stars) {
        const driftX = (pointer.x - 0.5) * star.r * 18
        const driftY = (pointer.y - 0.5) * star.r * 12
        const pulse = reduced ? 0.55 : 0.42 + Math.sin(time * 0.0008 + star.phase) * 0.18
        context.beginPath()
        context.arc(star.x * width + driftX, star.y * height + driftY, star.r, 0, Math.PI * 2)
        context.fillStyle = `rgba(210, 215, 255, ${pulse})`
        context.fill()
      }

      if (!reduced) frame = requestAnimationFrame(draw)
    }

    resize()
    draw()
    window.addEventListener('resize', resize)
    window.addEventListener('pointermove', move, { passive: true })
    return () => {
      cancelAnimationFrame(frame)
      window.removeEventListener('resize', resize)
      window.removeEventListener('pointermove', move)
    }
  }, [])

  return <canvas ref={canvasRef} className="ambient-field" aria-hidden="true" />
}

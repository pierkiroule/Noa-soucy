import { useEffect, useRef } from 'react'

interface Bubble { x:number; y:number; radius:number; drift:number; speed:number; phase:number }

export function ParticleOverlay() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const context = canvas?.getContext('2d')
    if (!canvas || !context) return

    const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches
    const bubbleCount = reducedMotion ? 3 : innerWidth < 600 ? 7 : 11
    const bubbles: Bubble[] = []
    let frame = 0
    let previousTime = 0

    const resize = () => {
      const ratio = Math.min(devicePixelRatio || 1, 1.5)
      const bounds = canvas.getBoundingClientRect()
      canvas.width = Math.round(bounds.width * ratio)
      canvas.height = Math.round(bounds.height * ratio)
      context.setTransform(ratio, 0, 0, ratio, 0, 0)
    }
    const createBubble = (fromBottom = false): Bubble => ({
      x: canvas.clientWidth * (.06 + Math.random() * .88),
      y: fromBottom ? canvas.clientHeight + 16 : Math.random() * canvas.clientHeight,
      radius: 3 + Math.random() * 7,
      drift: (Math.random() - .5) * .12,
      speed: reducedMotion ? .015 : .035 + Math.random() * .035,
      phase: Math.random() * Math.PI * 2,
    })

    resize()
    for (let index = 0; index < bubbleCount; index++) bubbles.push(createBubble())
    addEventListener('resize', resize)

    const draw = (time: number) => {
      frame = requestAnimationFrame(draw)
      if (time - previousTime < (reducedMotion ? 100 : 33)) return
      const elapsed = previousTime ? Math.min(50, time - previousTime) : 33
      previousTime = time
      context.clearRect(0, 0, canvas.clientWidth, canvas.clientHeight)

      for (const bubble of bubbles) {
        bubble.y -= bubble.speed * elapsed
        bubble.x += (bubble.drift + Math.sin(time / 2200 + bubble.phase) * .025) * elapsed
        if (bubble.y < -20) Object.assign(bubble, createBubble(true))

        const glow = context.createRadialGradient(bubble.x, bubble.y, 0, bubble.x, bubble.y, bubble.radius * 2.4)
        glow.addColorStop(0, 'rgba(224, 137, 55, .22)')
        glow.addColorStop(.45, 'rgba(205, 103, 35, .12)')
        glow.addColorStop(1, 'rgba(190, 91, 28, 0)')
        context.fillStyle = glow
        context.beginPath()
        context.arc(bubble.x, bubble.y, bubble.radius * 2.4, 0, Math.PI * 2)
        context.fill()
        context.strokeStyle = 'rgba(200, 105, 34, .28)'
        context.lineWidth = .7
        context.beginPath()
        context.arc(bubble.x, bubble.y, bubble.radius, 0, Math.PI * 2)
        context.stroke()
      }
    }
    frame = requestAnimationFrame(draw)
    return () => { cancelAnimationFrame(frame); removeEventListener('resize', resize) }
  }, [])

  return <canvas ref={canvasRef} className="question-particles" aria-hidden="true" />
}

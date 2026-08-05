import { useCallback, useEffect, useRef, useState } from 'react'
import { initializeFlyingBubbles, stepFlyingBubbles } from '../../engine/flyingBubblesMotion'
import type { FlyingBubbleState } from '../../types/flyingBubbles'
import { FlyingBubble } from './FlyingBubble'

export function FlyingBubblesSurface({ onExit, onRestartStory }: { onExit: () => void; onRestartStory: () => void }) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)
  const lastFrameRef = useRef(performance.now())
  const [bubbles, setBubbles] = useState<FlyingBubbleState[]>([])
  const restart = useCallback(() => { const rect = surfaceRef.current?.getBoundingClientRect(); setBubbles(initializeFlyingBubbles(rect?.width ?? innerWidth, rect?.height ?? innerHeight, String(Date.now()))) }, [])

  useEffect(() => { restart() }, [restart])
  useEffect(() => {
    const animate = (now: number) => {
      const rect = surfaceRef.current?.getBoundingClientRect()
      if (document.visibilityState !== 'hidden' && rect) setBubbles(current => stepFlyingBubbles(current, Math.min(40, now - lastFrameRef.current), rect.width, rect.height, now))
      lastFrameRef.current = now
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return <main ref={surfaceRef} className="flying-bubbles-surface" aria-label="Surface calme avec des bulles qui volent">
    {bubbles.map(bubble => <FlyingBubble key={bubble.id} bubble={bubble} />)}
    <div className="flying-bubbles-controls"><button onClick={onExit}>Quitter</button><button onClick={restart}>Recommencer</button><button className="quiet" onClick={onRestartStory}>Accueil</button></div>
  </main>
}

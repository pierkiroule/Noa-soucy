import { useCallback, useEffect, useRef, useState } from 'react'
import { initializeWordPetals, stepWordPetals } from '../../engine/floatingWordsMotion'
import type { WordPetalState } from '../../types/floatingWords'
import { WordPetal } from './WordPetal'

export function FloatingWordsSurface({ onExit, onRestartStory }: { onExit: () => void; onRestartStory: () => void }) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)
  const lastFrameRef = useRef(performance.now())
  const [petals, setPetals] = useState<WordPetalState[]>([])

  const restart = useCallback(() => {
    const rect = surfaceRef.current?.getBoundingClientRect()
    setPetals(initializeWordPetals(rect?.width ?? innerWidth, rect?.height ?? innerHeight, false, String(Date.now())))
  }, [])

  useEffect(() => { restart() }, [restart])
  useEffect(() => {
    const animate = (now: number) => {
      const rect = surfaceRef.current?.getBoundingClientRect()
      if (document.visibilityState !== 'hidden' && rect) setPetals(current => stepWordPetals(current, Math.min(40, now - lastFrameRef.current), rect.width, rect.height, now, false))
      lastFrameRef.current = now
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [])

  return <main ref={surfaceRef} className="floating-words-surface" aria-label="Surface calme avec des pétales orangés en mouvement">
    {petals.map(petal => <WordPetal key={petal.id} petal={petal} />)}
    <div className="floating-words-controls"><button onClick={onExit}>Quitter</button><button onClick={restart}>Recommencer</button><button className="quiet" onClick={onRestartStory}>Accueil</button></div>
  </main>
}

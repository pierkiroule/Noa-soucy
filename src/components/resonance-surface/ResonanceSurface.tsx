import { useEffect, useRef, useState } from 'react'
import { buildPairKey, resolveResonanceText } from '../../data/resonancePairs'
import { applyRippleImpulse, detectCollision, initializeBubbles, readResonanceSurfaceStorage, separateCollidingPair, stepBubbles, writeResonanceSurfaceStorage } from '../../engine/resonanceSurfacePhysics'
import type { BubbleState, CollisionEvent, RippleState } from '../../types/resonanceSurface'
import { MarigoldPetalBurst } from './MarigoldPetalBurst'
import { ProjectivePhrase } from './ProjectivePhrase'
import { ResonanceSurfaceControls } from './ResonanceSurfaceControls'
import { RippleLayer } from './RippleLayer'
import { VideoBubble } from './VideoBubble'

export function ResonanceSurface({ muted, onToggleMuted, onExit, onRestartStory }: { muted: boolean; onToggleMuted: () => void; onExit: () => void; onRestartStory: () => void }) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef<number>(0)
  const lastRef = useRef(performance.now())
  const lastCollisionRef = useRef(0)
  const selectedRef = useRef<BubbleState['id'][]>([])
  const reducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const [bubbles, setBubbles] = useState<BubbleState[]>([])
  const [ripples, setRipples] = useState<RippleState[]>([])
  const [event, setEvent] = useState<CollisionEvent | null>(null)
  const [phrase, setPhrase] = useState('')
  const [recentPairs, setRecentPairs] = useState<string[]>([])
  const [discovered, setDiscovered] = useState(() => readResonanceSurfaceStorage())
  const [hint, setHint] = useState(true)
  const [finished, setFinished] = useState(false)

  useEffect(() => { setDiscovered(current => { const next = { ...current, visitCount: current.visitCount + 1 }; writeResonanceSurfaceStorage(next); return next }) }, [])
  useEffect(() => {
    const rect = surfaceRef.current?.getBoundingClientRect()
    setBubbles(initializeBubbles(rect?.width ?? innerWidth, rect?.height ?? innerHeight, reducedMotion, String(readResonanceSurfaceStorage().visitCount)))
  }, [reducedMotion])
  useEffect(() => {
    const animate = (now: number) => {
      const rect = surfaceRef.current?.getBoundingClientRect()
      if (document.visibilityState !== 'hidden' && rect) setBubbles(current => {
        const stepped = stepBubbles(current, Math.min(40, now - lastRef.current), rect.width, rect.height, now, reducedMotion, phrase ? 0.38 : 1)
        const collision = detectCollision(stepped, now, Boolean(phrase), recentPairs, lastCollisionRef.current)
        if (collision) triggerCollision(collision, stepped, now)
        return stepped
      })
      lastRef.current = now
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [phrase, recentPairs, reducedMotion])

  const triggerCollision = (collision: CollisionEvent, source = bubbles, now = performance.now()) => {
    const key = buildPairKey(collision.firstId, collision.secondId)
    const text = resolveResonanceText(collision.firstId, collision.secondId)
    lastCollisionRef.current = now
    setEvent(collision); setPhrase(text); setRecentPairs(current => [key, ...current.filter(item => item !== key)].slice(0, 3))
    setDiscovered(current => { const next = { ...current, discoveredPairs: [...new Set([...current.discoveredPairs, key])], discoveredTexts: [...new Set([...current.discoveredTexts, text])] }; writeResonanceSurfaceStorage(next); return next })
    setBubbles(separateCollidingPair(source, collision, now))
    window.setTimeout(() => setPhrase(''), 6200)
    window.setTimeout(() => setEvent(null), 2200)
  }

  const handleSurfaceTap = (clientX: number, clientY: number) => {
    const rect = surfaceRef.current?.getBoundingClientRect(); if (!rect) return
    const origin = { x: clientX - rect.left, y: clientY - rect.top }
    setHint(false)
    setRipples(current => [...current, { id: crypto.randomUUID(), origin, radius: 10, opacity: 0.28, createdAt: Date.now() }])
    window.setTimeout(() => setRipples(current => current.slice(1)), 1800)
    if (phrase) { setPhrase(''); return }
    setBubbles(current => applyRippleImpulse(current, origin, reducedMotion))
  }

  const selectAccessible = (id: BubbleState['id']) => {
    if (!reducedMotion) return
    selectedRef.current = [...selectedRef.current, id].slice(-2)
    const [firstId, secondId] = selectedRef.current
    if (firstId && secondId && firstId !== secondId && !phrase) triggerCollision({ firstId, secondId, position: { x: innerWidth / 2, y: innerHeight / 2 }, createdAt: performance.now() })
  }

  if (finished) return <main className="resonance-final"><section><h1>Certaines images se sont rencontrées.</h1><p>Peut-être continueront-elles leur voyage autrement.</p><button className="quiet" onClick={onExit}>Revenir au conte</button><button className="primary" onClick={() => { setFinished(false); setRecentPairs([]) }}>Recommencer les résonances</button><button className="quiet" onClick={onRestartStory}>Accueil</button></section></main>
  return <main ref={surfaceRef} className="resonance-surface" onPointerDown={event => {
    if ((event.target as HTMLElement).closest('.resonance-controls')) return
    handleSurfaceTap(event.clientX, event.clientY)
  }}>
    {hint && <p className="surface-hint">Touchez l’eau</p>}
    <RippleLayer ripples={ripples}/>{bubbles.map(bubble => <VideoBubble key={bubble.id} bubble={bubble} reducedMotion={reducedMotion} onSelect={selectAccessible}/>) }
    <MarigoldPetalBurst event={event}/><ProjectivePhrase text={phrase} position={event?.position} onClose={() => setPhrase('')}/>
    <div className="sr-only" aria-label="Choisir deux images">{bubbles.map(bubble => <button key={bubble.id} onClick={() => selectAccessible(bubble.id)}>Choisir {bubble.id}</button>)}</div>
    <ResonanceSurfaceControls muted={muted} canFinish={discovered.discoveredPairs.length >= 3} onExit={onExit} onRestart={() => setRecentPairs([])} onToggleMuted={onToggleMuted} onFinish={() => { const next = { ...discovered, completedAt: new Date().toISOString() }; writeResonanceSurfaceStorage(next); setFinished(true) }}/>
  </main>
}

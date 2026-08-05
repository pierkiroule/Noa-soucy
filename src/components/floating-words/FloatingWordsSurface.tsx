import { useCallback, useEffect, useRef, useState } from 'react'
import { buildWordPairKey, resolveResourcePhrase } from '../../data/resourcePhrases'
import { applyTapImpulse, detectWordCollision, initializeWordPetals, readFloatingWordsStorage, separateWordPair, stepWordPetals, writeFloatingWordsStorage } from '../../engine/floatingWordsMotion'
import type { FloatingWordId } from '../../data/floatingWords'
import type { RippleState, WordCollisionEvent, WordPetalState } from '../../types/floatingWords'
import { PetalBurst } from './PetalBurst'
import { ResourcePhrase } from './ResourcePhrase'
import { RippleEffect } from './RippleEffect'
import { WordPetal } from './WordPetal'

export function FloatingWordsSurface({ onExit, onRestartStory }: { onExit: () => void; onRestartStory: () => void }) {
  const surfaceRef = useRef<HTMLDivElement>(null)
  const frameRef = useRef(0)
  const lastFrameRef = useRef(performance.now())
  const lastPhraseRef = useRef(0)
  const selectedWordsRef = useRef<FloatingWordId[]>([])
  const reducedMotion = typeof matchMedia !== 'undefined' && matchMedia('(prefers-reduced-motion: reduce)').matches
  const [petals, setPetals] = useState<WordPetalState[]>([])
  const [ripples, setRipples] = useState<RippleState[]>([])
  const [collision, setCollision] = useState<WordCollisionEvent | null>(null)
  const [phrase, setPhrase] = useState('')
  const [recentPairs, setRecentPairs] = useState<string[]>([])
  const [hint, setHint] = useState<'start' | 'after-first' | 'hidden'>('start')
  const [finished, setFinished] = useState(false)
  const [storage, setStorage] = useState(() => readFloatingWordsStorage())

  useEffect(() => { setStorage(current => { const next = { ...current, visitCount: current.visitCount + 1 }; writeFloatingWordsStorage(next); return next }) }, [])
  const showPhrase = useCallback((event: WordCollisionEvent, source: WordPetalState[], now = performance.now()) => {
    const pair = buildWordPairKey(event.firstId, event.secondId)
    lastPhraseRef.current = now
    setCollision(event); setPhrase(event.phrase); setRecentPairs(current => [pair, ...current.filter(item => item !== pair)].slice(0, 3))
    setStorage(current => { const next = { ...current, discoveredPairs: [...new Set([...current.discoveredPairs, pair])], discoveredPhrases: [...new Set([...current.discoveredPhrases, event.phrase])] }; writeFloatingWordsStorage(next); return next })
    setPetals(separateWordPair(source, event, now))
    window.setTimeout(() => setPhrase(''), 6200)
    window.setTimeout(() => setCollision(null), 1800)
    if (hint === 'hidden') setHint('after-first')
    window.setTimeout(() => setHint('hidden'), 3200)
  }, [hint])

  useEffect(() => { const rect = surfaceRef.current?.getBoundingClientRect(); setPetals(initializeWordPetals(rect?.width ?? innerWidth, rect?.height ?? innerHeight, reducedMotion, String(readFloatingWordsStorage().visitCount))) }, [reducedMotion])
  useEffect(() => {
    const animate = (now: number) => {
      const rect = surfaceRef.current?.getBoundingClientRect()
      if (document.visibilityState !== 'hidden' && rect) setPetals(current => {
        const next = stepWordPetals(current, Math.min(40, now - lastFrameRef.current), rect.width, rect.height, now, reducedMotion, phrase ? 0.42 : 1)
        const event = detectWordCollision(next, now, Boolean(phrase), recentPairs, lastPhraseRef.current)
        if (event) showPhrase(event, next, now)
        return next
      })
      lastFrameRef.current = now
      frameRef.current = requestAnimationFrame(animate)
    }
    frameRef.current = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(frameRef.current)
  }, [phrase, recentPairs, reducedMotion, showPhrase])

  const tapSurface = (clientX: number, clientY: number) => {
    const rect = surfaceRef.current?.getBoundingClientRect(); if (!rect) return
    if (phrase) { setPhrase(''); return }
    const origin = { x: clientX - rect.left, y: clientY - rect.top }
    setHint('hidden')
    if (!reducedMotion) {
      setRipples(current => [...current.slice(-2), { id: crypto.randomUUID(), origin, createdAt: Date.now() }])
      window.setTimeout(() => setRipples(current => current.slice(1)), 1400)
      setPetals(current => applyTapImpulse(current, origin, reducedMotion))
    }
  }

  const selectWord = (id: FloatingWordId) => {
    selectedWordsRef.current = [...selectedWordsRef.current, id].slice(-2)
    const [firstId, secondId] = selectedWordsRef.current
    if (!firstId || !secondId || firstId === secondId || phrase) return
    const phraseText = resolveResourcePhrase(firstId, secondId)
    showPhrase({ firstId, secondId, phrase: phraseText, position: { x: innerWidth / 2, y: innerHeight / 2 }, createdAt: performance.now() }, petals)
  }

  if (finished) return <main className="floating-words-final"><section><h1>Quelques mots se sont rencontrés.</h1><p>Peut-être continueront-ils leur chemin autrement.</p><button className="primary" onClick={() => { setFinished(false); selectedWordsRef.current = [] }}>Recommencer</button><button className="quiet" onClick={onExit}>Revenir au conte</button><button className="quiet" onClick={onRestartStory}>Accueil</button></section></main>
  return <main ref={surfaceRef} className="floating-words-surface" onPointerDown={event => { if ((event.target as HTMLElement).closest('.floating-words-controls')) return; tapSurface(event.clientX, event.clientY) }}>
    {hint !== 'hidden' && <p className="floating-words-hint">{hint === 'start' ? 'Touchez doucement la surface' : 'Laissez encore les mots se rencontrer'}</p>}
    <RippleEffect ripples={ripples}/>{petals.map(petal => <WordPetal key={petal.id} petal={petal} reducedMotion={reducedMotion} onSelect={selectWord}/>) }
    <PetalBurst event={collision}/><ResourcePhrase phrase={phrase} onClose={() => setPhrase('')}/>
    <div className="sr-only" aria-label="Choisir deux mots">{petals.map(petal => <button key={petal.id} onClick={() => selectWord(petal.id)}>Choisir {petal.label}</button>)}</div>
    <div className="floating-words-controls"><button onClick={onExit}>Quitter</button><button onClick={() => setPetals(initializeWordPetals(surfaceRef.current?.clientWidth ?? innerWidth, surfaceRef.current?.clientHeight ?? innerHeight, reducedMotion, String(Date.now())))}>Recommencer</button>{storage.discoveredPairs.length >= 3 && <><button onClick={() => setHint('hidden')}>Continuer</button><button className="primary" onClick={() => { const next = { ...storage, completedAt: new Date().toISOString() }; writeFloatingWordsStorage(next); setFinished(true) }}>Terminer ma traversée</button></>}</div>
  </main>
}

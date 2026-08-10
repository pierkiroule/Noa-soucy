import { useCallback, useEffect, useRef } from 'react'
import { metaphoricalResonances } from '../../data/metaphoricalResonances'
import { useMetaphoricalResonances } from '../../hooks/useMetaphoricalResonances'
import { ViewTransition } from '../../effects/ViewTransition'
import { ResonanceCompass } from './ResonanceCompass'
import { ResonanceIntro } from './ResonanceIntro'
import { ResonancePanel } from './ResonancePanel'
import { ResonanceSummary } from './ResonanceSummary'

export function MetaphoricalResonanceFlow({ onFinish, onRestartStory }: { onFinish:()=>void; onRestartStory:()=>void }) {
  const { state, visitedAnswers, openDirection, closeDirection, saveNote, deleteNote, resetResonances, completeForToday, returnToCompass, openCompass } = useMetaphoricalResonances()
  const lastButtonRef = useRef<HTMLElement | null>(null)
  const activeDirection = metaphoricalResonances.find(petal => petal.id === state.activeDirectionId)

  const openCompassDirection = (id: typeof metaphoricalResonances[number]['id']) => {
    lastButtonRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    openDirection(id)
  }
  const closeAndRestore = useCallback(() => {
    closeDirection()
    window.setTimeout(() => lastButtonRef.current?.focus(), 0)
  }, [closeDirection])

  useEffect(() => { document.body.classList.toggle('has-resonance-panel', Boolean(activeDirection)); return () => document.body.classList.remove('has-resonance-panel') }, [activeDirection])

  if (!state.opened) return <><ViewTransition variant="petals"/><ResonanceIntro onOpen={openCompass} onFinish={onFinish} /></>
  return <main className="story compass-flow">
    <ViewTransition key={state.completed ? 'summary' : 'compass'} variant={state.completed ? 'seeds' : 'petals'} />
    <div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div>
    {state.completed ? <ResonanceSummary visitedAnswers={visitedAnswers} onBackToCompass={returnToCompass} onFinish={onFinish} onRestartStory={onRestartStory} /> : <ResonanceCompass state={state} onOpenDirection={openCompassDirection} onFinishToday={completeForToday} onReset={resetResonances} />}
    {activeDirection && <ResonancePanel direction={activeDirection} note={state.answers[activeDirection.id]?.text ?? ''} onSave={text => saveNote(activeDirection.id, text)} onDelete={() => deleteNote(activeDirection.id)} onClose={closeAndRestore} />}
  </main>
}

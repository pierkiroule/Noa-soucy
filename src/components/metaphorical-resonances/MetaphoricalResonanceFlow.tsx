import { useEffect, useRef } from 'react'
import { metaphoricalResonances } from '../../data/metaphoricalResonances'
import { useMetaphoricalResonances } from '../../hooks/useMetaphoricalResonances'
import { ResonanceCompass } from './ResonanceCompass'
import { ResonanceIntro } from './ResonanceIntro'
import { ResonancePanel } from './ResonancePanel'
import { ResonanceSummary } from './ResonanceSummary'

export function MetaphoricalResonanceFlow({ onFinish, onRestartStory }: { onFinish:()=>void; onRestartStory:()=>void }) {
  const { state, visitedAnswers, openDirection, closeDirection, saveAnswer, resetResonances, completeForToday, returnToCompass, openCompass } = useMetaphoricalResonances()
  const lastButtonRef = useRef<HTMLElement | null>(null)
  const activeDirection = metaphoricalResonances.find(petal => petal.id === state.activeDirectionId)

  const openCompassDirection = (id: typeof metaphoricalResonances[number]['id']) => {
    lastButtonRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    openDirection(id)
  }
  const closeAndRestore = () => {
    closeDirection()
    window.setTimeout(() => lastButtonRef.current?.focus(), 0)
  }

  useEffect(() => { document.body.classList.toggle('has-resonance-panel', Boolean(activeDirection)); return () => document.body.classList.remove('has-resonance-panel') }, [activeDirection])

  if (!state.opened) return <ResonanceIntro onOpen={openCompass} onFinish={onFinish} />
  return <main className="story compass-flow">
    <div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div>
    {state.completed ? <ResonanceSummary visitedAnswers={visitedAnswers} onBackToCompass={returnToCompass} onFinish={onFinish} onRestartStory={onRestartStory} /> : <ResonanceCompass state={state} onOpenDirection={openCompassDirection} onFinishToday={completeForToday} onReset={resetResonances} />}
    {activeDirection && <ResonancePanel direction={activeDirection} value={state.answers[activeDirection.id]?.text ?? ''} onSave={text => saveAnswer(activeDirection.id, text)} onClose={closeAndRestore} />}
  </main>
}

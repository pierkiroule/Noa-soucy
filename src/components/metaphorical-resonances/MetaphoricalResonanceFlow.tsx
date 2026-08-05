import { useEffect, useRef } from 'react'
import { metaphoricalResonances } from '../../data/metaphoricalResonances'
import { useMetaphoricalResonances } from '../../hooks/useMetaphoricalResonances'
import { ResonanceFlower } from './ResonanceFlower'
import { ResonanceIntro } from './ResonanceIntro'
import { ResonancePanel } from './ResonancePanel'
import { ResonanceSummary } from './ResonanceSummary'

export function MetaphoricalResonanceFlow({ onFinish, onRestartStory }: { onFinish:()=>void; onRestartStory:()=>void }) {
  const { state, visitedAnswers, openPetal, closePetal, saveAnswer, resetResonances, completeForToday, returnToFlower, openFlower } = useMetaphoricalResonances()
  const lastButtonRef = useRef<HTMLElement | null>(null)
  const activePetal = metaphoricalResonances.find(petal => petal.id === state.activePetalId)

  const openFlowerPetal = (id: typeof metaphoricalResonances[number]['id']) => {
    lastButtonRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    openPetal(id)
  }
  const closeAndRestore = () => {
    closePetal()
    window.setTimeout(() => lastButtonRef.current?.focus(), 0)
  }

  useEffect(() => { document.body.classList.toggle('has-resonance-panel', Boolean(activePetal)); return () => document.body.classList.remove('has-resonance-panel') }, [activePetal])

  if (!state.opened) return <ResonanceIntro onOpen={openFlower} onFinish={onFinish} />
  return <main className="story flower-flow">
    <div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div>
    {state.completed ? <ResonanceSummary visitedAnswers={visitedAnswers} onBackToFlower={returnToFlower} onFinish={onFinish} onRestartStory={onRestartStory} /> : <ResonanceFlower state={state} onOpenPetal={openFlowerPetal} onFinishToday={completeForToday} onReset={resetResonances} />}
    {activePetal && <ResonancePanel petal={activePetal} value={state.answers[activePetal.id]?.text ?? ''} onSave={text => saveAnswer(activePetal.id, text)} onClose={closeAndRestore} />}
  </main>
}

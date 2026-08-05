import { useEffect, useMemo, useState } from 'react'
import { navigationStops } from '../../data/navigationStops'
import type { NavigationStopOption } from '../../data/navigationStops'
import { clearNavigationFlowerState, emptyNavigationFlowerState, goToFlowerStop, readNavigationFlowerState, writeNavigationFlowerState, chooseStop } from './navigationFlowerState'
import { NavigationFlowerReflection } from './NavigationFlowerReflection'
import { NavigationFlowerResult } from './NavigationFlowerResult'
import { NavigationFlowerStage } from './NavigationFlowerStage'
import { NavigationStop } from './NavigationStop'

type Stage = 'intro' | 'stops' | 'result' | 'reflection'
export function NavigationFlowerExperience({ onBackToEnding, onFinish }: { onBackToEnding: () => void; onFinish: () => void }) {
  const [state, setState] = useState(readNavigationFlowerState)
  const [stage, setStage] = useState<Stage>(state.completed ? 'result' : 'intro')
  const [locked, setLocked] = useState(false)
  const [selected, setSelected] = useState<string>()
  useEffect(() => writeNavigationFlowerState(state), [state])
  const stop = navigationStops[Math.min(state.currentStopIndex, navigationStops.length - 1)]
  const choose = (option: NavigationStopOption) => { if (locked) return; setLocked(true); setSelected(option.skillId); window.setTimeout(() => { const next = chooseStop(state, stop.id, option.skillId); setState(next); setLocked(false); setSelected(undefined); if (next.completed) setStage('result') }, 1700) }
  const reset = () => { clearNavigationFlowerState(); setState(emptyNavigationFlowerState()); setStage('intro') }
  const description = useMemo(() => Object.entries(state.selections).map(([stopId, skill]) => `${stopId}: ${skill}`).join(', '), [state.selections])
  return <main className="story compass-flow flower-flow"><div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div>
    {stage === 'intro' && <section className="flower-intro"><span className="eyebrow">Module facultatif</span><h1>La Fleur-Boussole des navigateurs de l’incertitude</h1><p>La mer ne demande pas toujours des réponses.</p><p>Parfois, elle demande seulement une manière de naviguer.</p><p>Huit escales vont maintenant vous être proposées.</p><p>À chaque escale, quelques pétales viendront flotter devant vous.</p><p>Ne cherchez pas le meilleur mot.</p><p>Touchez simplement celui qui vous appelle aujourd’hui.</p><p>À chaque choix, une onde se formera.</p><p>Et peu à peu, votre fleur de navigation apparaîtra.</p><small>Il n’y a ni bonne ni mauvaise réponse. Vos choix restent uniquement sur cet appareil.</small><div className="compass-actions"><button className="primary" onClick={() => setStage('stops')}>Commencer les escales</button><button className="quiet" onClick={onBackToEnding}>Retour à l’épilogue</button></div></section>}
    {stage === 'stops' && <><NavigationFlowerStage state={state}/><NavigationStop stop={stop} index={state.currentStopIndex} total={navigationStops.length} selected={selected} locked={locked} onChoose={choose} onBack={() => setState(current => goToFlowerStop(current, current.currentStopIndex - 1))}/><p className="sr-only" aria-live="polite">{description}</p></>}
    {stage === 'result' && <NavigationFlowerResult state={state} onContinue={() => setStage('reflection')} onRestart={reset}/>} 
    {stage === 'reflection' && <NavigationFlowerReflection value={state.reflection ?? ''} onChange={reflection => setState(current => ({ ...current, reflection }))} onFinish={() => { setState(current => ({ ...current, completed: true, completedAt: current.completedAt ?? new Date().toISOString() })); onFinish() }}/>} 
  </main>
}

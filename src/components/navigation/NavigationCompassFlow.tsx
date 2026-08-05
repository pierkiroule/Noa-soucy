import { useEffect, useMemo, useState } from 'react'
import { navigationSkills } from '../../data/navigationSkills'
import type { NavigationScore, NavigationSkillId } from '../../types/navigationCompass'
import { CompassIntro } from './CompassIntro'
import { CompassProgress } from './CompassProgress'
import { CompassQuestion } from './CompassQuestion'
import { CompassReflection } from './CompassReflection'
import { CompassResult } from './CompassResult'
import { buildCompassResult, clearNavigationCompassState, emptyCompassState, readNavigationCompassState, writeNavigationCompassState, type NavigationCompassStoredState } from './compassUtils'

type Stage = 'intro' | 'questions' | 'result' | 'reflection'

export function NavigationCompassFlow({ onBackToEnding, onFinish }: { onBackToEnding:()=>void; onFinish:()=>void }) {
  const [stage, setStage] = useState<Stage>('intro')
  const [state, setState] = useState<NavigationCompassStoredState>(() => readNavigationCompassState())
  useEffect(() => { writeNavigationCompassState(state) }, [state])
  const result = useMemo(() => isComplete(state.scores) ? buildCompassResult(state.scores as Record<NavigationSkillId, NavigationScore>, state.completedAt) : undefined, [state])
  const skill = navigationSkills[state.currentSkillIndex]
  const reset = () => { clearNavigationCompassState(); setState(emptyCompassState()); setStage('intro') }
  const start = () => setStage(result ? 'result' : 'questions')
  const select = (score: NavigationScore) => setState(current => ({ ...current, scores: { ...current.scores, [skill.id]: score } }))
  const next = () => {
    if (state.currentSkillIndex < navigationSkills.length - 1) setState(current => ({ ...current, currentSkillIndex: current.currentSkillIndex + 1 }))
    else setState(current => ({ ...current, completed: true, completedAt: current.completedAt ?? new Date().toISOString() }))
    if (state.currentSkillIndex === navigationSkills.length - 1) setStage('result')
  }
  const previous = () => setState(current => ({ ...current, currentSkillIndex: Math.max(0, current.currentSkillIndex - 1) }))
  const reflections = state.reflections
  const growthLabel = result ? navigationSkills.find(item => item.id === result.growthSkillIds[0])?.label : undefined
  const goReflection = () => { if (growthLabel && !reflections.growth) setState(current => ({ ...current, reflections: { ...current.reflections, growth: growthLabel } })); setStage('reflection') }
  return <main className="story compass-flow"><div className="story__brand"><span aria-hidden="true">◌</span> NAO SOUCI</div>{stage === 'intro' && <CompassIntro onStart={start} onBack={onBackToEnding}/>} {stage === 'questions' && <><CompassProgress current={state.currentSkillIndex + 1} total={navigationSkills.length}/><CompassQuestion icon={skill.icon} label={skill.label} statement={skill.statement} selected={state.scores[skill.id]} canGoBack={state.currentSkillIndex > 0} onSelect={select} onPrevious={previous} onNext={next}/></>} {stage === 'result' && result && <CompassResult result={result} onContinue={goReflection} onRestart={reset}/>} {stage === 'reflection' && <CompassReflection reflections={state.reflections} onChange={reflections => setState(current => ({ ...current, reflections }))} onFinish={onFinish} onRestart={reset}/>}</main>
}

function isComplete(scores: Partial<Record<NavigationSkillId, NavigationScore>>): boolean { return navigationSkills.every(skill => scores[skill.id]) }

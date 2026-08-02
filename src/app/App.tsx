import { useCallback, useEffect, useState } from 'react'
import { ChoiceScreen } from '../components/ChoiceScreen'
import { CinematicActPlayer } from '../components/CinematicActPlayer'
import { EndingScreen } from '../components/EndingScreen'
import { IntroScreen } from '../components/IntroScreen'
import { ProgressIndicator } from '../components/ProgressIndicator'
import { ResonancePlayer } from '../components/ResonancePlayer'
import { StoryPartition } from '../components/StoryPartition'
import { getCurrentBlock, goToNextBlock, goToPreviousBlock, recordChoice, resolveResonance, restartStory } from '../engine/storyEngine'
import { loadStory } from '../engine/storyLoader'
import { clearStoryState, loadStoryState, saveStoryState } from '../storage/storyStorage'
import type { StoryDefinition, StoryRuntimeState } from '../types/story'

export default function App() {
  const [story, setStory] = useState<StoryDefinition | null>(null)
  const [state, setState] = useState<StoryRuntimeState>(restartStory)
  const [saved, setSaved] = useState<StoryRuntimeState | null>(null)
  const [mode, setMode] = useState<'home' | 'reading' | 'partition'>('home')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => { loadStory().then((value) => { setStory(value); setSaved(loadStoryState(value)) }).catch((reason: unknown) => setError(reason instanceof Error ? reason.message : 'Une erreur inattendue est survenue.')) }, [])
  useEffect(() => { if (story && mode === 'reading') saveStoryState(story, state) }, [story, state, mode])

  const next = useCallback(() => { if (story) setState((value) => goToNextBlock(story, value)) }, [story])
  if (error) return <main className="screen status"><h1>Le conte reste fermé</h1><p>{error}</p><button className="button" onClick={() => location.reload()}>Réessayer</button></main>
  if (!story) return <main className="screen status" aria-live="polite"><p>Le conte se prépare…</p></main>

  const start = (nextState = restartStory()) => { setState(nextState); setMode('reading') }
  if (mode === 'home') return <IntroScreen metadata={story.metadata} canResume={Boolean(saved)} onStart={() => start()} onResume={() => start(saved ?? restartStory())} onRestart={() => { clearStoryState(); setSaved(null); start() }} onReadPartition={() => setMode('partition')} />
  if (mode === 'partition') return <StoryPartition story={story} onClose={() => setMode('home')} />

  const block = getCurrentBlock(story, state)
  const previous = state.currentBlockIndex > 0 ? () => setState(goToPreviousBlock) : undefined
  if (!block) return <main className="screen status"><p>Ce passage est introuvable.</p></main>

  let content
  if (block.type === 'act') content = <CinematicActPlayer act={story.acts[block.module]} onComplete={next} onPrevious={previous} />
  if (block.type === 'choice') content = <ChoiceScreen choice={story.choices[block.module]} selected={state.responses[block.module]?.[0]} onSelect={(id) => setState((value) => recordChoice(value, block.module, id ? [id] : []))} onNext={next} onPrevious={previous} />
  if (block.type === 'resonance') {
    const resonance = resolveResonance(story, state.responses, block.fromChoice)
    content = resonance ? <ResonancePlayer resonance={resonance} onComplete={next} /> : <main className="screen status"><p>Aucune résonance n’a été choisie.</p><button className="button" onClick={next}>Poursuivre</button></main>
  }
  if (block.type === 'ending') content = <EndingScreen ending={story.endings[block.module]} onReview={() => setState((value) => ({ ...value, currentBlockIndex: 0, completed: false }))} onRestart={() => { clearStoryState(); start() }} onHome={() => { setSaved(state); setMode('home') }} />

  return <><header className="masthead"><span>{story.metadata.title}</span><ProgressIndicator current={state.currentBlockIndex} total={story.storyboard.length} /></header>{content}</>
}

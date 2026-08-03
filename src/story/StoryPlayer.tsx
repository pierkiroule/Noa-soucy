import { useState } from 'react'
import { audioEngine } from './AudioEngine'
import { naoSouciStory } from './naoSouciStory'
import { PausePlayer } from './PausePlayer'
import { ScenePlayer } from './ScenePlayer'
import { StoryStateProvider, useStoryState } from './StoryState'

export function StoryPlayer() {
  return <StoryStateProvider definition={naoSouciStory}><StoryReader /></StoryStateProvider>
}

function StoryReader() {
  const { definition, state, start, restart, review } = useStoryState()
  const [muted, setMuted] = useState(false)
  const step = definition.steps[state.currentStepIndex]
  const hasAudio = definition.steps.some(item => item.type === 'scene' && Boolean(item.media.audio))
  const sceneNumber = definition.steps.slice(0, state.currentStepIndex + 1).filter(item => item.type === 'scene').length
  const sceneCount = definition.steps.filter(item => item.type === 'scene').length

  const toggleSound = () => {
    const nextMuted = !muted
    setMuted(nextMuted)
    audioEngine.mute(nextMuted)
  }

  if (!state.started) {
    return <main className="story">
      <Brand />
      <section className="intro">
        <div className="intro__content">
          <span className="eyebrow">Un conte audiovisuel interactif</span>
          <h1>{definition.title}</h1>
          <p>{definition.subtitle}</p>
          <button className="primary" onClick={start}>Commencer la traversée <span aria-hidden="true">→</span></button>
          <small>Environ 3 minutes · Vos choix restent sur cet appareil</small>
        </div>
        <div className="intro__horizon" aria-hidden="true"><i /><i /><i /></div>
      </section>
    </main>
  }

  return <main className="story">
    <Brand />
    <div className="story__status" aria-live="polite">
      <span>{step?.type === 'scene' ? `Chapitre ${sceneNumber} sur ${sceneCount}` : step?.type === 'pause' ? 'Temps de résonance' : 'Rivage'}</span>
    </div>
    <div className="global-progress" role="progressbar" aria-label="Progression du conte" aria-valuemin={0} aria-valuemax={100} aria-valuenow={Math.round(state.progress * 100)}>
      <i style={{ width: `${state.progress * 100}%` }} />
    </div>
    {hasAudio && <button className="sound" aria-pressed={muted} onClick={toggleSound}>{muted ? 'Activer le son' : 'Couper le son'}</button>}
    {step?.type === 'scene' && <ScenePlayer key={`${step.id}-${step.title}`} scene={step} />}
    {step?.type === 'pause' && <PausePlayer key={step.id} pause={step} />}
    {step?.type === 'ending' && <section className="ending">
      <span className="eyebrow">La rive</span>
      <h1>{step.title}</h1>
      <div className="ending__text">{step.text.split('\n').map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div>
      <div className="ending__mark" aria-hidden="true">✦</div>
      <div className="ending__actions">
        <button className="primary" onClick={review}>Revoir le conte</button>
        <button className="quiet" onClick={() => restart()}>Recommencer</button>
        <button className="quiet" onClick={() => restart(true)}>Revenir à l’accueil</button>
      </div>
    </section>}
  </main>
}

function Brand() {
  return <div className="story__brand" aria-label="Nao Souci"><span aria-hidden="true">◌</span> NAO SOUCI</div>
}

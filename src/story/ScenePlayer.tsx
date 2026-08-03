import { useEffect, useMemo } from 'react'
import { audioEngine } from './AudioEngine'
import { getActiveEffects } from './engine'
import { resolveSceneMedia } from './MediaResolver'
import { SceneStage } from './SceneStage'
import { useStoryState } from './StoryState'
import type { StoryScene } from './types'

export function ScenePlayer({ scene }: { scene: StoryScene }) {
  const { state, next, togglePause, setMedia } = useStoryState()
  const effects = useMemo(() => getActiveEffects(scene.effects, state.currentSceneTime), [scene.effects, state.currentSceneTime])
  const remaining = Math.max(0, Math.ceil(scene.duration - state.currentSceneTime))

  useEffect(() => {
    let active = true
    void resolveSceneMedia(scene).then(media => { if (active) setMedia(media) })
    void audioEngine.load(scene.media.audio).then(() => audioEngine.play())
    return () => { active = false; audioEngine.stop() }
  }, [scene, setMedia])

  useEffect(() => {
    if (!scene.manualAdvance && state.currentSceneTime >= scene.duration) next()
  }, [state.currentSceneTime, scene.duration, scene.manualAdvance, next])

  useEffect(() => {
    if (state.isPaused) audioEngine.pause()
    else audioEngine.resume()
  }, [state.isPaused])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLButtonElement) return
      if (!scene.manualAdvance && event.code === 'Space') { event.preventDefault(); togglePause() }
      if (event.code === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, togglePause, scene.manualAdvance])

  const fallback = () => setMedia({ kind: 'placeholder', fallbackSceneId: scene.media.fallbackSceneId }, 'Le média vidéo est illisible.')

  return <section className={`scene transition transition--${scene.transitionIn}`} aria-label={scene.title}>
    <SceneStage scene={scene} media={state.media} parameters={state.parameters} effects={effects} time={state.currentSceneTime} isPaused={state.isPaused} onMediaError={fallback} />
    <div className="scene__veil" />
    <article className={`scene__copy ${scene.manualAdvance ? 'scene__copy--long' : ''}`}>
      <span>{scene.title}</span>
      <div className="scene__narration">{scene.text.split('\n').map((line, index) => <p key={`${line}-${index}`}>{line}</p>)}</div>
    </article>
    <div className="scene__controls">
      {!scene.manualAdvance && <span className="scene__time" aria-hidden="true">{state.isPaused ? 'En pause' : `${remaining} s`}</span>}
      {!scene.manualAdvance && <button className="scene__pause" aria-pressed={state.isPaused} onClick={togglePause}>{state.isPaused ? 'Reprendre' : 'Pause'}</button>}
      <button className="scene__skip" onClick={next}>{scene.manualAdvance ? 'Continuer' : 'Passer'} <span aria-hidden="true">→</span></button>
    </div>
  </section>
}

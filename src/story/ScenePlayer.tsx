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
    if (state.currentSceneTime >= scene.duration) next()
  }, [state.currentSceneTime, scene.duration, next])

  useEffect(() => {
    if (state.isPaused) audioEngine.pause()
    else audioEngine.resume()
  }, [state.isPaused])

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.target instanceof HTMLButtonElement) return
      if (event.code === 'Space') { event.preventDefault(); togglePause() }
      if (event.code === 'ArrowRight') next()
    }
    window.addEventListener('keydown', onKeyDown)
    return () => window.removeEventListener('keydown', onKeyDown)
  }, [next, togglePause])

  const fallback = () => setMedia({ kind: 'placeholder', fallbackSceneId: scene.media.fallbackSceneId }, 'Le média vidéo est illisible.')

  return <section className={`scene transition transition--${scene.transitionIn}`} aria-label={scene.title}>
    <SceneStage scene={scene} media={state.media} parameters={state.parameters} effects={effects} time={state.currentSceneTime} isPaused={state.isPaused} onMediaError={fallback} />
    <div className="scene__veil" />
    <div className="scene__copy">
      <span>{scene.title}</span>
      <p>{scene.text}</p>
    </div>
    <div className="scene__controls">
      <span className="scene__time" aria-hidden="true">{state.isPaused ? 'En pause' : `${remaining} s`}</span>
      <button className="scene__pause" aria-pressed={state.isPaused} onClick={togglePause}>{state.isPaused ? 'Reprendre' : 'Pause'}</button>
      <button className="scene__skip" onClick={next}>Passer <span aria-hidden="true">→</span></button>
    </div>
  </section>
}

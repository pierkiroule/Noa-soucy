import { useEffect, useMemo, useRef, useState } from 'react'
import { loopAudioPlayer } from '../engine/LoopAudioPlayer'
import { BREATH_FADE_IN_MS, BREATH_FADE_OUT_MS, BREATH_GAP_MS, getBreathHoldDuration, splitTextIntoBreaths } from '../engine/storyText'
import type { StoryMediaVariant } from '../story/storyData'

interface Props {
  title:string; text:string; videoSrc:string; audioSrc:string; variant:StoryMediaVariant
  breathIndex:number; isPlaying:boolean; isMuted:boolean
  onBreathChange:(index:number)=>void; onPlayingChange:(playing:boolean)=>void; onComplete:()=>void
}

export function StoryMediaPlayer({ title, text, videoSrc, audioSrc, variant, breathIndex, isPlaying, isMuted, onBreathChange, onPlayingChange, onComplete }: Props) {
  const breaths = useMemo(() => splitTextIntoBreaths(text), [text])
  const [videoFailed, setVideoFailed] = useState(false)
  const [phase, setPhase] = useState<'in'|'hold'|'out'>('in')
  const [finished, setFinished] = useState(breathIndex >= breaths.length)
  const videoRef = useRef<HTMLVideoElement>(null)
  const safeIndex = Math.min(breathIndex, Math.max(0, breaths.length - 1))

  useEffect(() => {
    setVideoFailed(false); setFinished(false); setPhase('in')
    void loopAudioPlayer.load(audioSrc)
    return () => { void loopAudioPlayer.stop() }
  }, [audioSrc])

  useEffect(() => { loopAudioPlayer.setMuted(isMuted) }, [isMuted])
  useEffect(() => {
    if (isPlaying) { void videoRef.current?.play().catch(() => undefined); void loopAudioPlayer.resume() }
    else { videoRef.current?.pause(); loopAudioPlayer.pause() }
  }, [isPlaying])

  useEffect(() => {
    if (!isPlaying || finished || !breaths[safeIndex]) return
    setPhase('in')
    const holdTimer = window.setTimeout(() => setPhase('hold'), BREATH_FADE_IN_MS)
    const outTimer = window.setTimeout(() => setPhase('out'), BREATH_FADE_IN_MS + getBreathHoldDuration(breaths[safeIndex]))
    const cycleDuration = BREATH_FADE_IN_MS + getBreathHoldDuration(breaths[safeIndex]) + BREATH_FADE_OUT_MS + BREATH_GAP_MS
    const nextTimer = window.setTimeout(() => {
      if (safeIndex === breaths.length - 1) setFinished(true)
      else onBreathChange(safeIndex + 1)
    }, cycleDuration + (safeIndex === breaths.length - 1 ? 1750 : 0))
    return () => { clearTimeout(holdTimer); clearTimeout(outTimer); clearTimeout(nextTimer) }
  }, [breaths, safeIndex, isPlaying, finished, onBreathChange])

  const move = (index: number) => {
    setFinished(false); setPhase('in'); onBreathChange(Math.max(0, Math.min(breaths.length - 1, index)))
  }

  return <section className={`media-player media-player--${variant}`}>
    <div className={`media-player__fallback ${videoFailed ? 'is-visible' : ''}`} aria-hidden="true"><i/><i/><i/></div>
    {!videoFailed && <video ref={videoRef} className="media-player__video" src={videoSrc} autoPlay loop muted playsInline preload="auto" onError={() => { console.warn(`Vidéo indisponible : ${videoSrc}`); setVideoFailed(true) }} />}
    <div className="media-player__wash" aria-hidden="true" />
    <header className="media-player__title">{title}</header>
    <div className={`media-player__breath media-player__breath--${phase}`} aria-live="polite">{breaths[safeIndex]}</div>
    <div className="media-player__counter" aria-hidden="true">{safeIndex + 1} / {breaths.length}</div>
    <nav className="media-player__controls" aria-label="Contrôles de lecture">
      <button onClick={() => move(safeIndex - 1)} disabled={safeIndex === 0}>Précédent</button>
      <button onClick={() => onPlayingChange(!isPlaying)}>{isPlaying ? 'Pause' : 'Reprendre'}</button>
      <button onClick={() => move(safeIndex + 1)} disabled={safeIndex === breaths.length - 1}>Suivant</button>
    </nav>
    {finished && <button className="media-player__continue" onClick={onComplete}>{variant === 'resonance' ? 'Reprendre la traversée' : variant === 'epilogue' ? 'Terminer' : 'Continuer'} <span aria-hidden="true">→</span></button>}
  </section>
}

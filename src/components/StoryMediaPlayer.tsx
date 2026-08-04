import { useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
import { splitTextIntoBreaths } from '../engine/storyText'
import type { StoryMediaVariant } from '../story/storyData'

interface Props {
  title:string; text:string; videoSrc:string; variant:StoryMediaVariant
  breathIndex:number; isPlaying:boolean
  onBreathChange:(index:number)=>void; onPlayingChange:(playing:boolean)=>void; onComplete:()=>void
}

interface Ripple { id:number; x:number; y:number }

export function StoryMediaPlayer({ title, text, videoSrc, variant, breathIndex, isPlaying, onBreathChange, onPlayingChange, onComplete }: Props) {
  const breaths = useMemo(() => splitTextIntoBreaths(text), [text])
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const rippleId = useRef(0)
  const safeIndex = Math.min(breathIndex, Math.max(0, breaths.length - 1))
  const initialIndex = useRef(safeIndex)
  const isSeedResonance = variant === 'resonance' && /(?:^|\/)3\.mp4(?:[?#].*)?$/.test(videoSrc)
  const finished = isSeedResonance || safeIndex === breaths.length - 1

  useEffect(() => {
    if (isPlaying) void videoRef.current?.play().catch(() => undefined)
    else videoRef.current?.pause()
  }, [isPlaying])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (scroller) {
      const progress = breaths.length > 1 ? initialIndex.current / (breaths.length - 1) : 0
      scroller.scrollTo({ top: (scroller.scrollHeight - scroller.clientHeight) * progress })
    }
  }, [breaths.length])

  const handleScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const scrollableHeight = scroller.scrollHeight - scroller.clientHeight
    const progress = scrollableHeight > 0 ? scroller.scrollTop / scrollableHeight : 1
    const index = Math.max(0, Math.min(breaths.length - 1, Math.round(progress * (breaths.length - 1))))
    if (index !== safeIndex) onBreathChange(index)
  }

  const addRipple = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const ripple = { id: ++rippleId.current, x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    setRipples(current => [...current, ripple])
    window.setTimeout(() => setRipples(current => current.filter(item => item.id !== ripple.id)), 1100)
  }

  return <section className={`media-player media-player--${variant}${isSeedResonance ? ' media-player--seed-resonance' : ''}`}>
    <div className="media-player__wash" aria-hidden="true" />
    <header className="media-player__title">{title}</header>
    <div ref={scrollerRef} className="media-player__text-scroll" onScroll={handleScroll} onPointerDown={addRipple} aria-label={`${title}, texte à faire défiler verticalement`}>
      <div className="media-player__breath"><p>{text}</p></div>
    </div>
    <div className="media-player__visual" aria-label="Illustration vidéo du récit">
      <div className={`media-player__fallback ${videoFailed ? 'is-visible' : ''}`} aria-hidden="true"><i/><i/><i/></div>
      {!videoFailed && <video ref={videoRef} className={`media-player__video ${videoReady ? 'is-ready' : ''}`} src={videoSrc} autoPlay loop muted playsInline preload="auto" onLoadedData={() => setVideoReady(true)} onCanPlay={event => { setVideoReady(true); if (isPlaying) void event.currentTarget.play().catch(() => console.warn(`Lecture vidéo en attente : ${videoSrc}`)) }} onError={() => { console.warn(`Vidéo indisponible : ${videoSrc}`); setVideoFailed(true) }} />}
    </div>
    <div className="media-player__ripples" aria-hidden="true">{ripples.map(ripple => <i key={ripple.id} style={{ left: ripple.x, top: ripple.y }}/>)}</div>
    <div className="media-player__counter" aria-live="polite">{safeIndex + 1} / {breaths.length}</div>
    <nav className="media-player__controls" aria-label="Contrôles de lecture">
      <button onClick={() => onPlayingChange(!isPlaying)}>{isPlaying ? 'Pause' : 'Reprendre'}</button>
    </nav>
    {finished && <button className="media-player__continue" onClick={onComplete}>{variant === 'resonance' ? 'Reprendre la traversée' : variant === 'epilogue' ? 'Terminer' : 'Continuer'} <span aria-hidden="true">→</span></button>}
  </section>
}

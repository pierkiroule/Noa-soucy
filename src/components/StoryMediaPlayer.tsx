import { useCallback, useEffect, useMemo, useRef, useState, type PointerEvent as ReactPointerEvent } from 'react'
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
  const isResonance = variant === 'resonance'
  const finished = isResonance || safeIndex === breaths.length - 1

  const scrollToBreath = useCallback((index: number, behavior: ScrollBehavior = 'smooth') => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const nextIndex = Math.max(0, Math.min(breaths.length - 1, index))
    const scrollableHeight = scroller.scrollHeight - scroller.clientHeight
    const progress = breaths.length > 1 ? nextIndex / (breaths.length - 1) : 0
    scroller.scrollTo({ top: scrollableHeight * progress, behavior })
    onBreathChange(nextIndex)
  }, [breaths.length, onBreathChange])

  useEffect(() => {
    if (isPlaying) void videoRef.current?.play().catch(() => undefined)
    else videoRef.current?.pause()
  }, [isPlaying])

  useEffect(() => {
    scrollToBreath(initialIndex.current, 'auto')
  }, [scrollToBreath])

  const handleScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const scrollableHeight = scroller.scrollHeight - scroller.clientHeight
    const progress = scrollableHeight > 0 ? scroller.scrollTop / scrollableHeight : 1
    const index = Math.max(0, Math.min(breaths.length - 1, Math.round(progress * (breaths.length - 1))))
    if (index !== safeIndex) onBreathChange(index)
  }

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'ArrowDown' || event.key === 'PageDown') { event.preventDefault(); scrollToBreath(safeIndex + 1) }
    if (event.key === 'ArrowUp' || event.key === 'PageUp') { event.preventDefault(); scrollToBreath(safeIndex - 1) }
    if (event.key === 'Home') { event.preventDefault(); scrollToBreath(0) }
    if (event.key === 'End') { event.preventDefault(); scrollToBreath(breaths.length - 1) }
  }

  const addRipple = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.pointerType === 'mouse' && event.button !== 0) return
    const bounds = event.currentTarget.getBoundingClientRect()
    const ripple = { id: ++rippleId.current, x: event.clientX - bounds.left, y: event.clientY - bounds.top }
    setRipples(current => [...current, ripple])
    window.setTimeout(() => setRipples(current => current.filter(item => item.id !== ripple.id)), 1100)
  }

  return <section className={`media-player media-player--${variant}${isResonance ? ' media-player--resonance-bubble' : ''}`}>
    <div className="media-player__wash" aria-hidden="true" />
    <header className="media-player__title">{title}</header>
    <div ref={scrollerRef} className="media-player__text-scroll" tabIndex={0} onScroll={handleScroll} onKeyDown={handleKeyDown} onPointerDown={addRipple} aria-label={`${title}, texte à faire défiler verticalement`} aria-describedby="media-player-instructions">
      <div className="media-player__breath"><p>{text}</p></div>
    </div>
    <p id="media-player-instructions" className="media-player__instructions">Faites défiler doucement, ou utilisez les flèches haut et bas pour avancer souffle par souffle.</p>
    <div className="media-player__visual" aria-label="Illustration vidéo du récit">
      <div className={`media-player__fallback ${videoFailed ? 'is-visible' : ''}`} aria-hidden="true"><i/><i/><i/></div>
      {!videoFailed && <video ref={videoRef} className={`media-player__video ${videoReady ? 'is-ready' : ''}`} src={videoSrc} autoPlay loop muted playsInline preload="auto" onLoadedData={() => setVideoReady(true)} onCanPlay={event => { setVideoReady(true); if (isPlaying) void event.currentTarget.play().catch(() => console.warn(`Lecture vidéo en attente : ${videoSrc}`)) }} onError={() => { console.warn(`Vidéo indisponible : ${videoSrc}`); setVideoFailed(true) }} />}
    </div>
    <div className="media-player__ripples" aria-hidden="true">{ripples.map(ripple => <i key={ripple.id} style={{ left: ripple.x, top: ripple.y }}/>)}</div>
    <div className="media-player__counter" aria-live="polite">{safeIndex + 1} / {breaths.length}</div>
    <nav className="media-player__controls" aria-label="Contrôles de lecture">
      <button onClick={() => scrollToBreath(safeIndex - 1)} disabled={safeIndex === 0}>Souffle précédent</button>
      <button onClick={() => onPlayingChange(!isPlaying)}>{isPlaying ? 'Pause' : 'Reprendre'}</button>
      <button onClick={() => scrollToBreath(safeIndex + 1)} disabled={safeIndex === breaths.length - 1}>Souffle suivant</button>
    </nav>
    {finished && <button className="media-player__continue" onClick={onComplete}>{variant === 'resonance' ? 'Reprendre la traversée' : variant === 'epilogue' ? 'Terminer' : 'Continuer'} <span aria-hidden="true">→</span></button>}
  </section>
}

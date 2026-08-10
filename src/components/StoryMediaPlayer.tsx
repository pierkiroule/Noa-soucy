import { useEffect, useMemo, useRef, useState, type KeyboardEvent as ReactKeyboardEvent, type PointerEvent as ReactPointerEvent } from 'react'
import { narrationAudioPlayer } from '../engine/NarrationAudioPlayer'
import { narrationDuration, narrationScrollProgress, nextAutoScrollTop } from '../engine/narrationScroll'
import { splitTextIntoBreaths } from '../engine/storyText'
import type { StoryMediaVariant } from '../story/storyData'

interface Props {
  title:string; text:string; videoSrc:string; variant:StoryMediaVariant
  breathIndex:number
  narrationEnded:boolean; narrationSource?:string; narrationDurationSeconds?:number
  onBreathChange:(index:number)=>void; onComplete:()=>void
}

interface Ripple { id:number; x:number; y:number }

export function StoryMediaPlayer({ title, text, videoSrc, variant, breathIndex, narrationEnded, narrationSource, narrationDurationSeconds, onBreathChange, onComplete }: Props) {
  const breaths = useMemo(() => splitTextIntoBreaths(text), [text])
  const [videoFailed, setVideoFailed] = useState(false)
  const [videoReady, setVideoReady] = useState(false)
  const [ripples, setRipples] = useState<Ripple[]>([])
  const [reachedEnd, setReachedEnd] = useState(false)
  const [textVisible, setTextVisible] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null)
  const scrollerRef = useRef<HTMLDivElement>(null)
  const rippleId = useRef(0)
  const userScrollPausedUntil = useRef(0)
  const safeIndex = Math.min(breathIndex, Math.max(0, breaths.length - 1))
  const initialIndex = useRef(safeIndex)
  const isResonance = variant === 'resonance'
  const finished = isResonance || reachedEnd || safeIndex === breaths.length - 1

  useEffect(() => {
    const scroller = scrollerRef.current
    if (scroller) {
      const progress = breaths.length > 1 ? initialIndex.current / (breaths.length - 1) : 0
      scroller.scrollTo({ top: (scroller.scrollHeight - scroller.clientHeight) * progress })
    }
  }, [breaths.length])

  useEffect(() => {
    const scroller = scrollerRef.current
    if (!scroller || !narrationSource || isResonance || !textVisible) return

    let frame = 0
    let lastFrame = performance.now()
    const followNarration = (now: number) => {
      const audio = narrationAudioPlayer.getProgress(narrationSource)
      const scrollableHeight = scroller.scrollHeight - scroller.clientHeight
      if (audio?.playing && scrollableHeight > 0 && now >= userScrollPausedUntil.current) {
        const duration = narrationDuration(narrationDurationSeconds, audio.duration, text.length)
        const target = narrationScrollProgress(audio.currentTime, duration) * scrollableHeight
        // Follow both forward and backward corrections. Refusing a backward
        // correction made the scroller appear frozen whenever duration or
        // viewport measurements changed while the MP3 was playing.
        scroller.scrollTop = nextAutoScrollTop(scroller.scrollTop, target, now - lastFrame)
      }
      lastFrame = now
      frame = requestAnimationFrame(followNarration)
    }
    frame = requestAnimationFrame(followNarration)
    return () => cancelAnimationFrame(frame)
  }, [isResonance, narrationDurationSeconds, narrationSource, text.length, textVisible])

  const pauseAutoScroll = () => {
    // A deliberate gesture always wins. Following resumes gently after the
    // reader has been inactive for a few seconds.
    userScrollPausedUntil.current = performance.now() + 6000
  }

  const pauseForScrollKey = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    if (['ArrowUp', 'ArrowDown', 'PageUp', 'PageDown', 'Home', 'End', ' '].includes(event.key)) pauseAutoScroll()
  }

  const handleScroll = () => {
    const scroller = scrollerRef.current
    if (!scroller) return
    const scrollableHeight = scroller.scrollHeight - scroller.clientHeight
    const progress = scrollableHeight > 0 ? scroller.scrollTop / scrollableHeight : 1
    const index = Math.max(0, Math.min(breaths.length - 1, Math.round(progress * (breaths.length - 1))))
    if (index === breaths.length - 1) setReachedEnd(true)
    if (index !== safeIndex) onBreathChange(index)
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
    <button className="media-player__text-toggle" type="button" aria-pressed={textVisible} aria-controls="story-text" onClick={() => setTextVisible(visible => !visible)}>
      {textVisible ? 'Masquer le texte' : 'Afficher le texte'}
    </button>
    <div id="story-text" ref={scrollerRef} className={`media-player__text-scroll${textVisible ? '' : ' is-hidden'}`} onScroll={handleScroll} onWheel={pauseAutoScroll} onTouchMove={pauseAutoScroll} onKeyDown={pauseForScrollKey} onPointerDown={addRipple} onPointerMove={event => { if (event.buttons) pauseAutoScroll() }} aria-label={`${title}, texte à faire défiler verticalement`} aria-hidden={!textVisible} inert={!textVisible}>
      <div className="media-player__breath">
        <p>{text}</p>
        {finished && !narrationEnded && <button className="media-player__continue media-player__continue--inline" onClick={onComplete}>{isResonance ? 'Reprendre la traversée' : variant === 'epilogue' ? 'Terminer' : 'Continuer'} <span aria-hidden="true">→</span></button>}
      </div>
    </div>
    {narrationEnded && <button className="media-player__continue" onClick={onComplete}>{variant === 'epilogue' ? 'Terminer' : 'Chapitre suivant'} <span aria-hidden="true">→</span></button>}
    <div className="media-player__visual" aria-label="Illustration vidéo du récit">
      <div className={`media-player__fallback ${videoFailed ? 'is-visible' : ''}`} aria-hidden="true"><i/><i/><i/></div>
      {!videoFailed && <video ref={videoRef} className={`media-player__video ${videoReady ? 'is-ready' : ''}`} src={videoSrc} autoPlay loop muted playsInline preload="metadata" onLoadedData={() => setVideoReady(true)} onCanPlay={event => { setVideoReady(true); void event.currentTarget.play().catch(() => console.warn(`Lecture vidéo en attente : ${videoSrc}`)) }} onError={() => { console.warn(`Vidéo indisponible : ${videoSrc}`); setVideoFailed(true) }} />}
    </div>
    <div className="media-player__ripples" aria-hidden="true">{ripples.map(ripple => <i key={ripple.id} style={{ left: ripple.x, top: ripple.y }}/>)}</div>
  </section>
}

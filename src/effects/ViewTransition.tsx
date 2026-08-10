import { useEffect, useRef, type CSSProperties } from 'react'
import { audioReactivity } from '../engine/AudioReactivity'

const petals = Array.from({ length: 8 }, (_, index) => ({
  left: `${5 + (index * 83 % 91)}%`,
  delay: `${index * 90}ms`,
  flutterDelay: `${index * -54}ms`,
  duration: `${4.6 + (index % 4) * .52}s`,
  size: `${13 + (index * 7 % 10)}px`,
  driftA: `${-16 + (index * 31 % 35)}vw`,
  driftB: `${-12 + (index * 47 % 31)}vw`,
  driftAEnd: `${(-16 + (index * 31 % 35)) * -.45}vw`,
  driftBEnd: `${(-12 + (index * 47 % 31)) * -.65}vw`,
  opacity: `${.34 + (index * 13 % 42) / 100}`,
  hue: `${index % 5}`,
}))

const seeds = Array.from({ length: 28 }, (_, index) => {
  const angle = (index / 28) * Math.PI * 2 + (index % 4) * .1
  const distance = 20 + (index % 7) * 5
  return { x: `${Math.cos(angle) * distance}vmax`, y: `${Math.sin(angle) * distance}vmax`, delay: `${(index % 10) * 110}ms`, size: `${5 + (index % 5) * 2}px`, hue: `${index % 5}` }
})

/** Eight wind-borne petals, or a short seed bloom, between narrative views. */
export function ViewTransition({ variant = 'petals' }: { variant?: 'petals' | 'seeds' }) {
  const rootRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    if (variant !== 'petals') return
    let frame = 0
    let phase = 0
    const breathe = () => {
      const root = rootRef.current
      if (!root) return
      const levels = audioReactivity.sample()
      phase += .012 + levels.energy * .018
      root.style.setProperty('--fx-audio', levels.energy.toFixed(3))
      root.style.setProperty('--fx-voice', levels.voice.toFixed(3))
      root.style.setProperty('--fx-music', levels.music.toFixed(3))
      root.style.setProperty('--fx-gust-x', `${Math.sin(phase) * 5}vw`)
      root.style.setProperty('--fx-gust-px', `${Math.sin(phase) * 5}px`)
      root.style.setProperty('--fx-gust-neg-px', `${Math.sin(phase) * -5}px`)
      root.style.setProperty('--fx-audio-px', `${levels.energy * 6}px`)
      root.style.setProperty('--fx-audio-neg-px', `${levels.energy * -6}px`)
      root.style.setProperty('--fx-voice-y', `${levels.voice * -8}px`)
      root.style.setProperty('--fx-music-turn', `${levels.music * 24}deg`)
      root.style.setProperty('--fx-audio-turn', `${levels.energy * 15}deg`)
      frame = requestAnimationFrame(breathe)
    }
    frame = requestAnimationFrame(breathe)
    return () => cancelAnimationFrame(frame)
  }, [variant])

  return <div ref={rootRef} className={`view-transition view-transition--${variant}`} aria-hidden="true">
    <div className="view-transition__veil" />
    <div className="view-transition__heart"><i /><i /><i /></div>
    {variant === 'petals' ? petals.map((petal, index) => <i className="view-transition__particle" data-hue={petal.hue} key={index} style={{ '--fx-left': petal.left, '--fx-delay': petal.delay, '--fx-flutter-delay': petal.flutterDelay, '--fx-duration': petal.duration, '--fx-size': petal.size, '--fx-drift-a': petal.driftA, '--fx-drift-b': petal.driftB, '--fx-drift-a-end': petal.driftAEnd, '--fx-drift-b-end': petal.driftBEnd, '--fx-opacity': petal.opacity } as CSSProperties}><span /></i>) : seeds.map((seed, index) => <i className="view-transition__particle" data-hue={seed.hue} key={index} style={{ '--fx-x': seed.x, '--fx-y': seed.y, '--fx-delay': seed.delay, '--fx-size': seed.size } as CSSProperties} />)}
  </div>
}

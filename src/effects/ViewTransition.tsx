import { useEffect, useRef, type CSSProperties } from 'react'
import { audioReactivity } from '../engine/AudioReactivity'

const petals = Array.from({ length: 8 }, (_, index) => ({
  left: `${4 + (index * 37 % 89)}%`,
  top: `${13 + (index * 29 % 72)}%`,
  delay: `${-3 - index * 2.7}s`,
  flutterDelay: `${index * -.43}s`,
  duration: `${19 + (index % 4) * 3.2}s`,
  size: `${12 + (index * 7 % 9)}px`,
  driftA: `${-5 + (index * 17 % 12)}vw`,
  driftB: `${-4 + (index * 23 % 10)}vw`,
  driftStart: `${(-5 + (index * 17 % 12)) * -.35}vw`,
  driftEnd: `${(-4 + (index * 23 % 10)) * -.45}vw`,
  liftA: `${-8 + (index * 11 % 16)}px`,
  liftB: `${-6 + (index * 13 % 13)}px`,
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
  }, [])

  return <div ref={rootRef} className="view-transition view-transition--petals" aria-hidden="true">
    {petals.map((petal, index) => <i className="view-transition__particle view-transition__particle--petal" data-hue={petal.hue} key={index} style={{ '--fx-left': petal.left, '--fx-top': petal.top, '--fx-delay': petal.delay, '--fx-flutter-delay': petal.flutterDelay, '--fx-duration': petal.duration, '--fx-size': petal.size, '--fx-drift-a': petal.driftA, '--fx-drift-b': petal.driftB, '--fx-drift-start': petal.driftStart, '--fx-drift-end': petal.driftEnd, '--fx-lift-a': petal.liftA, '--fx-lift-b': petal.liftB } as CSSProperties}><span /></i>)}
    {variant === 'seeds' && <div className="view-transition__seeds">
      <div className="view-transition__veil" />
      <div className="view-transition__heart"><i /><i /><i /></div>
      {seeds.map((seed, index) => <i className="view-transition__particle view-transition__particle--seed" data-hue={seed.hue} key={index} style={{ '--fx-x': seed.x, '--fx-y': seed.y, '--fx-delay': seed.delay, '--fx-size': seed.size } as CSSProperties} />)}
    </div>}
  </div>
}

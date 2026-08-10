import type { CSSProperties } from 'react'

const particles = Array.from({ length: 28 }, (_, index) => {
  const angle = (index / 28) * Math.PI * 2 + (index % 4) * .1
  const distance = 20 + (index % 7) * 5
  const wave = (index % 2 ? -1 : 1) * (5 + index % 6)
  return {
    x: `${Math.cos(angle) * distance}vmax`, y: `${Math.sin(angle) * distance}vmax`,
    top: `${4 + (index * 17) % 88}%`,
    wave: `${wave}vh`, waveStart: `${wave * -.35}vh`, waveMiddle: `${wave * -.65}vh`, waveEnd: `${wave * .3}vh`,
    delay: `${(index % 10) * 110}ms`, duration: `${3.5 + (index % 6) * .24}s`,
    size: `${5 + (index % 5) * 2}px`, spin: `${180 + (index % 7) * 57}deg`,
    hue: `${index % 5}`,
  }
})

/** A short, non-interactive bloom that accompanies a change of narrative view. */
export function ViewTransition({ variant = 'petals' }: { variant?: 'petals' | 'seeds' }) {
  return <div className={`view-transition view-transition--${variant}`} aria-hidden="true">
    <div className="view-transition__veil" />
    <div className="view-transition__heart"><i /><i /><i /></div>
    {particles.map((particle, index) => <i className="view-transition__particle" data-hue={particle.hue} key={index} style={{ '--fx-x': particle.x, '--fx-y': particle.y, '--fx-top': particle.top, '--fx-wave': particle.wave, '--fx-wave-start': particle.waveStart, '--fx-wave-middle': particle.waveMiddle, '--fx-wave-end': particle.waveEnd, '--fx-delay': particle.delay, '--fx-duration': particle.duration, '--fx-size': particle.size, '--fx-spin': particle.spin } as CSSProperties} />)}
  </div>
}

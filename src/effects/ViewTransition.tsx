import type { CSSProperties } from 'react'

const particles = Array.from({ length: 28 }, (_, index) => {
  const angle = (index / 28) * Math.PI * 2 + (index % 4) * .1
  const distance = 20 + (index % 7) * 5
  return {
    x: `${Math.cos(angle) * distance}vmax`, y: `${Math.sin(angle) * distance}vmax`,
    bend: `${Math.cos(angle) * distance * .34 + Math.sin(angle + 1.2) * (5 + index % 5)}vmax`,
    rise: `${Math.sin(angle) * distance * .42}vmax`,
    delay: `${(index % 8) * 48}ms`, size: `${5 + (index % 5) * 2}px`, spin: `${80 + (index % 7) * 43}deg`,
    hue: `${index % 5}`,
  }
})

/** A short, non-interactive bloom that accompanies a change of narrative view. */
export function ViewTransition({ variant = 'petals' }: { variant?: 'petals' | 'seeds' }) {
  return <div className={`view-transition view-transition--${variant}`} aria-hidden="true">
    <div className="view-transition__veil" />
    <div className="view-transition__heart"><i /><i /><i /></div>
    {particles.map((particle, index) => <i className="view-transition__particle" data-hue={particle.hue} key={index} style={{ '--fx-x': particle.x, '--fx-y': particle.y, '--fx-bend': particle.bend, '--fx-rise': particle.rise, '--fx-delay': particle.delay, '--fx-size': particle.size, '--fx-spin': particle.spin } as CSSProperties} />)}
  </div>
}

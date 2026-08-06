import type { CSSProperties } from 'react'

const particles = Array.from({ length: 28 }, (_, index) => {
  const angle = (index / 28) * Math.PI * 2 + (index % 3) * .12
  const distance = 34 + (index % 7) * 9
  return {
    x: `${Math.cos(angle) * distance}vmax`, y: `${Math.sin(angle) * distance}vmax`,
    delay: `${(index % 6) * 24}ms`, size: `${7 + (index % 5) * 3}px`, spin: `${160 + (index % 8) * 57}deg`,
  }
})

/** A short, non-interactive bloom that accompanies a change of narrative view. */
export function ViewTransition({ variant = 'petals' }: { variant?: 'petals' | 'seeds' }) {
  return <div className={`view-transition view-transition--${variant}`} aria-hidden="true">
    <div className="view-transition__veil" />
    <div className="view-transition__heart"><i /><i /><i /></div>
    {particles.map((particle, index) => <i className="view-transition__particle" key={index} style={{ '--fx-x': particle.x, '--fx-y': particle.y, '--fx-delay': particle.delay, '--fx-size': particle.size, '--fx-spin': particle.spin } as CSSProperties} />)}
  </div>
}

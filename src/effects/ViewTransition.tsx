import type { CSSProperties } from 'react'

const pollen = Array.from({ length: 14 }, (_, index) => ({
  left: `${4 + index * 7}%`,
  delay: `${[-2, -11, -6, -14, -3, -9, -16, -5, -12, -7, -15, -1, -10, -4][index]}s`,
  duration: `${[15, 19, 15, 21, 15, 17, 15, 22, 15, 18, 15, 20, 15, 24][index]}s`,
  size: index % 3 === 2 ? '5px' : '7px',
  opacity: index % 3 === 2 ? '.17' : '.29',
}))

const seeds = Array.from({ length: 28 }, (_, index) => {
  const angle = (index / 28) * Math.PI * 2 + (index % 4) * .1
  const distance = 20 + (index % 7) * 5
  return { x: `${Math.cos(angle) * distance}vmax`, y: `${Math.sin(angle) * distance}vmax`, delay: `${(index % 10) * 110}ms`, size: `${5 + (index % 5) * 2}px`, hue: `${index % 5}` }
})

/** The home-page drift, mirrored upward and rendered as translucent pollen. */
export function ViewTransition({ variant = 'petals' }: { variant?: 'petals' | 'seeds' }) {
  return <div className="view-transition view-transition--petals" aria-hidden="true">
    <div className="view-transition__pollen">
      {pollen.map((grain, index) => <i key={index} style={{ '--fx-left': grain.left, '--fx-delay': grain.delay, '--fx-duration': grain.duration, '--fx-size': grain.size, '--fx-opacity': grain.opacity } as CSSProperties}><span /></i>)}
    </div>
    {variant === 'seeds' && <div className="view-transition__seeds">
      <div className="view-transition__veil" />
      <div className="view-transition__heart"><i /><i /><i /></div>
      {seeds.map((seed, index) => <i className="view-transition__particle view-transition__particle--seed" data-hue={seed.hue} key={index} style={{ '--fx-x': seed.x, '--fx-y': seed.y, '--fx-delay': seed.delay, '--fx-size': seed.size } as CSSProperties} />)}
    </div>}
  </div>
}

import type { CSSProperties } from 'react'
import { metaphoricalResonances, type ResonancePetalId } from '../../data/metaphoricalResonances'
import type { MetaphoricalResonanceState } from '../../types/metaphoricalResonances'
import { ResonanceCompassPoint } from './ResonanceCompassPoint'

const pollen = Array.from({ length: 18 }, (_, index) => {
  const drift = (index % 2 ? -1 : 1) * (12 + index % 5 * 4)
  return {
    left: `${5 + (index * 29) % 91}%`, top: `${8 + (index * 37) % 84}%`,
    size: `${2 + index % 3}px`, drift: `${drift}px`, driftEnd: `${drift * -.4}px`,
    delay: `${index * -730}ms`, duration: `${8.5 + index % 5 * 1.2}s`,
  }
})

export function ResonanceCompass({ state, onOpenDirection, onFinishToday, onReset }: { state:MetaphoricalResonanceState; onOpenDirection:(id:ResonancePetalId)=>void; onFinishToday:()=>void; onReset:()=>void }) {
  const visitedCount = Object.values(state.answers).filter(answer => answer?.visited).length
  return <section className={`compass-stage${state.activeDirectionId ? ' has-active-direction' : ''}`} aria-labelledby="compass-title">
    <div className="compass-pollen" aria-hidden="true">{pollen.map((particle, index) => <i key={index} style={{ '--pollen-left': particle.left, '--pollen-top': particle.top, '--pollen-size': particle.size, '--pollen-drift': particle.drift, '--pollen-drift-end': particle.driftEnd, '--pollen-delay': particle.delay, '--pollen-duration': particle.duration } as CSSProperties}/>)}</div>
    <div className="compass-heading">
      <span className="eyebrow">Boussole métaphorique</span>
      <h1 id="compass-title">La Boussole de Nao Souci</h1>
      <p>Touchez la direction qui vous appelle aujourd’hui.</p>
      {visitedCount > 0 && <small>{visitedCount === 1 ? '1 direction explorée' : `${visitedCount} directions explorées`}</small>}
    </div>
    <div className="compass-canvas">
      <svg className="compass-svg" viewBox="0 0 400 400" role="img" aria-labelledby="compass-svg-title">
        <title id="compass-svg-title">Boussole stylisée à huit directions</title>
        <defs><filter id="compass-texture"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8"/></filter></defs>
        <g transform="translate(200 210)" filter="url(#compass-texture)">
          {metaphoricalResonances.map((petal, index) => <ResonanceCompassPoint key={petal.id} direction={petal} index={index} active={state.activeDirectionId === petal.id} visited={Boolean(state.answers[petal.id]?.visited)} onOpen={() => onOpenDirection(petal.id)} />)}
          <circle className="compass-center" r="42" />
          <circle className="compass-center compass-center--inner" r="23" />
        </g>
      </svg>
    </div>
    <div className="compass-stage__actions">
      {visitedCount > 0 && <button className="primary" onClick={onFinishToday}>Terminer pour aujourd’hui</button>}
      <details><summary>Options</summary><button type="button" className="quiet" onClick={onReset}>Effacer mes résonances</button></details>
    </div>
  </section>
}

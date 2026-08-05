import { metaphoricalResonances, type ResonancePetalId } from '../../data/metaphoricalResonances'
import type { MetaphoricalResonanceState } from '../../types/metaphoricalResonances'
import { ResonancePetal } from './ResonancePetal'

export function ResonanceFlower({ state, onOpenPetal, onFinishToday, onReset }: { state:MetaphoricalResonanceState; onOpenPetal:(id:ResonancePetalId)=>void; onFinishToday:()=>void; onReset:()=>void }) {
  const visitedCount = Object.values(state.answers).filter(answer => answer?.visited).length
  return <section className={`flower-stage${state.activePetalId ? ' has-active-petal' : ''}`} aria-labelledby="flower-title">
    <div className="flower-heading">
      <span className="eyebrow">Résonances métaphoriques</span>
      <h1 id="flower-title">La Fleur-Boussole de Nao Souci</h1>
      <p>Touchez le pétale qui vous appelle aujourd’hui.</p>
      {visitedCount > 0 && <small>{visitedCount === 1 ? '1 pétale exploré' : `${visitedCount} pétales explorés`}</small>}
    </div>
    <div className="flower-canvas">
      <svg className="flower-svg" viewBox="0 0 400 400" role="img" aria-labelledby="flower-svg-title">
        <title id="flower-svg-title">Fleur-Boussole à huit pétales</title>
        <defs><filter id="watercolor"><feTurbulence type="fractalNoise" baseFrequency="0.9" numOctaves="2" seed="7" result="noise"/><feDisplacementMap in="SourceGraphic" in2="noise" scale="1.8"/></filter></defs>
        <g transform="translate(200 210)" filter="url(#watercolor)">
          {metaphoricalResonances.map((petal, index) => <ResonancePetal key={petal.id} petal={petal} index={index} active={state.activePetalId === petal.id} visited={Boolean(state.answers[petal.id]?.visited)} onOpen={() => onOpenPetal(petal.id)} />)}
          <circle className="flower-center" r="42" />
          <circle className="flower-center flower-center--inner" r="23" />
        </g>
      </svg>
      <ul className="flower-fallback" aria-label="Liste accessible des pétales">
        {metaphoricalResonances.map(petal => <li key={petal.id}><button type="button" onClick={() => onOpenPetal(petal.id)}>{petal.glyph} {petal.actionLabel}</button></li>)}
      </ul>
    </div>
    <div className="flower-stage__actions">
      {visitedCount > 0 && <button className="primary" onClick={onFinishToday}>Terminer pour aujourd’hui</button>}
      <details><summary>Options</summary><button type="button" className="quiet" onClick={onReset}>Effacer mes résonances</button></details>
    </div>
  </section>
}

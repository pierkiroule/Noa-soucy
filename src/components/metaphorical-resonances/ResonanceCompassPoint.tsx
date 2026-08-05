import type { CSSProperties } from 'react'
import type { MetaphoricalResonance } from '../../data/metaphoricalResonances'

const compassNeedlePaths = [
  'M 0 0 C -24 -34, -20 -104, 0 -136 C 24 -104, 28 -34, 0 0 Z',
  'M 0 0 C -30 -38, -22 -112, 4 -140 C 28 -106, 24 -36, 0 0 Z',
  'M 0 0 C -20 -30, -30 -100, -5 -132 C 20 -110, 34 -38, 0 0 Z',
  'M 0 0 C -28 -34, -18 -116, 2 -138 C 30 -108, 26 -30, 0 0 Z'
]
const colors = ['#f4b64e', '#e89537', '#d99a36', '#f0c45d']

export function ResonanceCompassPoint({ direction, index, active, visited, onOpen }: { direction:MetaphoricalResonance; index:number; active:boolean; visited:boolean; onOpen:()=>void }) {
  const angle = index * 45 - 90
  return <g className={`compass-point${visited ? ' is-visited' : ''}${active ? ' is-active' : ''}`} style={{ '--compass-angle': `${angle}deg`, '--compass-delay': `${index * 95}ms` } as CSSProperties}>
    <path d={compassNeedlePaths[index % compassNeedlePaths.length]} fill={colors[index % colors.length]} transform={`rotate(${angle})`} />
    {visited && <circle className="compass-point__visited-dot" r="4" cx="0" cy="-43" transform={`rotate(${angle})`} />}
    <foreignObject x="-48" y="-156" width="96" height="86" transform={`rotate(${angle})`}>
      <button type="button" className="compass-point__button" aria-label={`Ouvrir la direction ${direction.actionLabel}`} aria-pressed={visited} onClick={onOpen}>
        <span aria-hidden="true">{direction.glyph}</span><strong>{direction.actionLabel}</strong><em>{direction.title}</em>
      </button>
    </foreignObject>
  </g>
}

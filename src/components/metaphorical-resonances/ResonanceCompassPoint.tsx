import type { CSSProperties } from 'react'
import type { MetaphoricalResonance } from '../../data/metaphoricalResonances'

const compassNeedlePaths = [
  'M 0 0 C -24 -34, -20 -104, 0 -136 C 24 -104, 28 -34, 0 0 Z',
  'M 0 0 C -30 -38, -22 -112, 4 -140 C 28 -106, 24 -36, 0 0 Z',
  'M 0 0 C -20 -30, -30 -100, -5 -132 C 20 -110, 34 -38, 0 0 Z',
  'M 0 0 C -28 -34, -18 -116, 2 -138 C 30 -108, 26 -30, 0 0 Z'
]
const palettes = [
  ['#fff0a1', '#f4b64e', '#c96b28'],
  ['#ffe57a', '#e89537', '#b95725'],
  ['#fff2b0', '#d99a36', '#bd632b'],
  ['#fff6bd', '#f0c45d', '#d47a29'],
]

export function ResonanceCompassPoint({ direction, index, active, visited, onOpen }: { direction:MetaphoricalResonance; index:number; active:boolean; visited:boolean; onOpen:()=>void }) {
  const angle = index * 45 - 90
  const radians = angle * Math.PI / 180
  const glyphRadius = 160
  const glyphX = Math.cos(radians) * glyphRadius
  const glyphY = Math.sin(radians) * glyphRadius
  const gradientId = `petal-gradient-${direction.id}`
  const lightId = `petal-light-${direction.id}`
  const [light, middle, shade] = palettes[index % palettes.length]

  return <g className={`compass-point${visited ? ' is-visited' : ''}${active ? ' is-active' : ''}`} style={{ '--compass-delay': `${index * 95}ms`, '--wind-delay': `${index * -430}ms`, '--wind-duration': `${5.2 + index % 4 * .7}s`, '--light-duration': `${3.9 + index % 3 * .6}s`, '--wind-start': index % 2 ? '1.2deg' : '-1.2deg', '--wind-mid': index % 2 ? '-1.8deg' : '1.8deg', '--wind-end': index % 2 ? '-2.5deg' : '2.5deg' } as CSSProperties}>
    <g className="compass-point__petal" transform={`rotate(${angle + 90})`}>
      <defs>
        <linearGradient id={gradientId} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor={light}/><stop offset=".48" stopColor={middle}/><stop offset="1" stopColor={shade}/>
        </linearGradient>
        <linearGradient id={lightId} x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#fff" stopOpacity="0"/><stop offset=".52" stopColor="#fff8c9" stopOpacity=".72"/><stop offset="1" stopColor="#fff" stopOpacity="0"/>
        </linearGradient>
      </defs>
      <g className="compass-point__sail">
        <path className="compass-point__petal-base" d={compassNeedlePaths[index % compassNeedlePaths.length]} fill={`url(#${gradientId})`} />
        <path className="compass-point__petal-light" d={compassNeedlePaths[index % compassNeedlePaths.length]} fill={`url(#${lightId})`} />
        <path className="compass-point__petal-vein" d="M 0 -5 C -3 -44, 3 -88, 0 -126" />
      </g>
      {visited && <circle className="compass-point__visited-dot" r="4" cy="-43" />}
    </g>
    <foreignObject className="compass-point__glyph-object" x={glyphX - 48} y={glyphY - 34} width="96" height="68">
      <button type="button" className="compass-point__button" aria-label={`Ouvrir la direction ${direction.actionLabel}`} aria-pressed={visited} onClick={onOpen}>
        <span aria-hidden="true">{direction.glyph}</span>
        <strong>{direction.title}</strong>
      </button>
    </foreignObject>
  </g>
}

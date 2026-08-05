import { navigationSkills, navigationSkillIds, type NavigationSkill } from '../../data/navigationSkills'
import type { NavigationFlowerState } from './navigationFlowerState'

export function NavigationFlowerStage({ state, revealed = false }: { state: NavigationFlowerState; revealed?: boolean }) {
  const max = Math.max(1, ...navigationSkillIds.map(id => state.counts[id]))
  const desc = `Fleur de navigation. Les compétences les plus présentes aujourd’hui sont ${navigationSkillIds.filter(id => state.counts[id] === max).map(id => navigationSkills[id].shortLabel).slice(0, 2).join(' et ') || 'encore en attente'}.`
  return <figure className={`flower-stage ${revealed ? 'flower-stage--revealed' : ''}`} aria-label={desc}>
    <div className="flower-stage__water" aria-hidden="true"><i/><i/><i/></div>
    <svg className="flower-stage__svg" viewBox="0 0 240 240" role="img" aria-label={desc}>
      <title>{desc}</title><circle cx="120" cy="120" r="9" className="flower-heart" />
      {navigationSkillIds.map((id, index) => <FlowerPetal key={id} id={id} index={index} count={state.counts[id]} max={max} />)}
      {revealed && <><path className="walnut" d="M72 164c18 24 78 24 96 0-17 11-78 11-96 0Z"/><line className="horizon" x1="35" y1="82" x2="205" y2="82"/></>}
    </svg>
  </figure>
}
function FlowerPetal({ id, index, count, max }: { id: NavigationSkill; index: number; count: number; max: number }) {
  const angle = (Math.PI * 2 * index) / 8 - Math.PI / 2
  const length = count === 0 ? 22 : 34 + (count / max) * 44
  const cx = 120 + Math.cos(angle) * (length / 2 + 14)
  const cy = 120 + Math.sin(angle) * (length / 2 + 14)
  return <g className={`flower-petal ${count ? 'is-grown' : ''}`} style={{ transformOrigin: '120px 120px' }}>
    <ellipse cx={cx} cy={cy} rx="13" ry={length / 2} transform={`rotate(${(angle * 180) / Math.PI + 90} ${cx} ${cy})`} />
    {count > 0 && <text x={120 + Math.cos(angle) * 92} y={123 + Math.sin(angle) * 92} textAnchor="middle">{navigationSkills[id].shortLabel}</text>}
  </g>
}

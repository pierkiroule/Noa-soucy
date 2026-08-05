import { navigationSkills } from '../../data/navigationSkills'
import type { NavigationScore, NavigationSkillId } from '../../types/navigationCompass'
import { buildRadarPolygon, getRadarPoint } from './compassUtils'

const shortLabels = ['Observer', 'Adapter', 'Oser', 'Soin', 'Ancrer', 'Relier', 'Rebondir', 'Cap']

export function CompassChart({ scores }: { scores: Record<NavigationSkillId, NavigationScore> }) {
  const size = 320, center = size / 2, radius = 104
  const orderedScores = navigationSkills.map(skill => scores[skill.id])
  const description = navigationSkills.map(skill => `${skill.label} : ${scores[skill.id]} sur 5`).join('. ')
  return <figure className="compass-chart"><svg viewBox={`0 0 ${size} ${size}`} role="img" aria-label={`Boussole de navigation. ${description}.`}>
    <title>Boussole de navigation</title><desc>{description}</desc>
    {[1,2,3,4,5].map(level => <polygon key={level} className="compass-chart__grid" points={buildRadarPolygon([level,level,level,level,level,level,level,level] as NavigationScore[], radius, center, center)} />)}
    {navigationSkills.map((skill, index) => { const end = getRadarPoint(index, navigationSkills.length, 5, 5, radius, center, center); const labelPoint = getRadarPoint(index, navigationSkills.length, 5, 5, radius + 32, center, center); return <g key={skill.id}><line className="compass-chart__axis" x1={center} y1={center} x2={end.x} y2={end.y}/><text x={labelPoint.x} y={labelPoint.y} textAnchor="middle" dominantBaseline="middle">{shortLabels[index]}</text></g> })}
    <polygon className="compass-chart__sail" points={buildRadarPolygon(orderedScores, radius, center, center)} />
    {orderedScores.map((score, index) => { const point = getRadarPoint(index, orderedScores.length, score, 5, radius, center, center); return <circle key={navigationSkills[index].id} cx={point.x} cy={point.y} r="5" /> })}
  </svg><figcaption>{navigationSkills.map((skill, index) => <span key={skill.id}>{shortLabels[index]} — {skill.label}</span>)}</figcaption></figure>
}

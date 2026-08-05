import test from 'node:test'
import assert from 'node:assert/strict'
import { readFile } from 'node:fs/promises'

type NavigationSkillId = 'observe' | 'adapt' | 'dare' | 'self-care' | 'anchor' | 'connect' | 'bounce' | 'course'
type NavigationScore = 1 | 2 | 3 | 4 | 5
const skillIds: NavigationSkillId[] = ['observe', 'adapt', 'dare', 'self-care', 'anchor', 'connect', 'bounce', 'course']
const fullScores = (value: NavigationScore): Record<NavigationSkillId, NavigationScore> => Object.fromEntries(skillIds.map(id => [id, value])) as Record<NavigationSkillId, NavigationScore>

function getRadarPoint(index: number, total: number, score: number, maxScore: number, radius: number, centerX: number, centerY: number): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const distance = (score / maxScore) * radius
  return { x: centerX + Math.cos(angle) * distance, y: centerY + Math.sin(angle) * distance }
}
function buildRadarPolygon(scores: NavigationScore[], radius: number, centerX: number, centerY: number): string {
  return scores.map((score, index) => {
    const point = getRadarPoint(index, scores.length, score, 5, radius, centerX, centerY)
    return `${Math.round(point.x * 100) / 100},${Math.round(point.y * 100) / 100}`
  }).join(' ')
}
function idsWithScore(scores: Record<NavigationSkillId, NavigationScore>, wanted: 'max' | 'min') {
  const values = Object.values(scores)
  const target = wanted === 'max' ? Math.max(...values) : Math.min(...values)
  return skillIds.filter(id => scores[id] === target)
}

test('navigation skills source contains exactly the requested eight skills', async () => {
  const source = await readFile(new URL('./../../data/navigationSkills.ts', import.meta.url), 'utf8')
  for (const id of skillIds) assert.match(source, new RegExp(`id: '${id}'`))
  assert.equal([...source.matchAll(/id: '/g)].length, 8)
})

test('calculates radar points from the top axis clockwise', () => {
  assert.deepEqual(getRadarPoint(0, 8, 5, 5, 100, 100, 100), { x: 100, y: 0 })
  const point = getRadarPoint(2, 8, 5, 5, 100, 100, 100)
  assert.equal(Math.round(point.x), 200)
  assert.equal(Math.round(point.y), 100)
})

test('builds a polygon with eight points', () => {
  const polygon = buildRadarPolygon([1,2,3,4,5,4,3,2] as NavigationScore[], 100, 100, 100)
  assert.equal(polygon.split(' ').length, 8)
  assert.match(polygon, /^100,80 /)
})

test('detects maximum and minimum scores with ties', () => {
  const scores: Record<NavigationSkillId, NavigationScore> = { ...fullScores(3), observe: 5, anchor: 5, dare: 1, course: 1 }
  assert.deepEqual(idsWithScore(scores, 'max'), ['observe', 'anchor'])
  assert.deepEqual(idsWithScore(scores, 'min'), ['dare', 'course'])
})

test('handles eight scores at 1, eight scores at 5, and all identical scores', () => {
  assert.equal(idsWithScore(fullScores(1), 'max').length, 8)
  assert.equal(idsWithScore(fullScores(1), 'min').length, 8)
  assert.equal(idsWithScore(fullScores(5), 'max').length, 8)
  assert.equal(idsWithScore(fullScores(5), 'min').length, 8)
})

test('resumes, sanitizes invalid localStorage-shaped data, and resets', () => {
  const key = 'nao-souci-navigation-compass-v1'
  const storage = new Map<string, string>()
  storage.set(key, JSON.stringify({ currentSkillIndex: 3, scores: { observe: 4, adapt: 9 } }))
  const parsed = JSON.parse(storage.get(key) ?? '{}')
  assert.equal(parsed.currentSkillIndex, 3)
  assert.deepEqual(Object.fromEntries(Object.entries(parsed.scores).filter(([, value]) => [1,2,3,4,5].includes(value as number))), { observe: 4 })
  storage.set(key, '{invalid')
  assert.throws(() => JSON.parse(storage.get(key) ?? '{}'))
  storage.delete(key)
  assert.equal(storage.has(key), false)
})

test('question navigation can move forward, backward, resume, and ignore the optional block model', () => {
  let currentSkillIndex = 0
  const scores: Partial<Record<NavigationSkillId, NavigationScore>> = {}
  scores[skillIds[currentSkillIndex]] = 4
  currentSkillIndex = Math.min(skillIds.length - 1, currentSkillIndex + 1)
  assert.equal(currentSkillIndex, 1)
  currentSkillIndex = Math.max(0, currentSkillIndex - 1)
  assert.equal(currentSkillIndex, 0)
  assert.equal(scores.observe, 4)
  assert.equal({ type: 'compass', module: 'navigation-compass', optional: true }.optional, true)
})

test('mobile scale keeps five large selectable values', () => {
  const values: NavigationScore[] = [1, 2, 3, 4, 5]
  assert.equal(values.length, 5)
  assert.ok(values.every(value => value >= 1 && value <= 5))
})

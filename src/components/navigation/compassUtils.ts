import { navigationSkills } from '../../data/navigationSkills'
import type { NavigationCompassResult, NavigationScore, NavigationSkillId } from '../../types/navigationCompass'

export const NAVIGATION_COMPASS_STORAGE_KEY = 'nao-souci-navigation-compass-v1'
export const navigationScoreValues = [1, 2, 3, 4, 5] as const
export const navigationScoreLabels: Record<NavigationScore, string> = {
  1: 'Pas du tout comme moi',
  2: 'Un peu comme moi',
  3: 'Parfois comme moi',
  4: 'Souvent comme moi',
  5: 'Tout à fait comme moi'
}

export interface NavigationCompassReflections { strength:string; growth:string; nextStep:string }
export interface NavigationCompassStoredState {
  scores: Partial<Record<NavigationSkillId, NavigationScore>>
  currentSkillIndex: number
  completed: boolean
  reflections: NavigationCompassReflections
  completedAt?: string
}

export const emptyReflections = (): NavigationCompassReflections => ({ strength: '', growth: '', nextStep: '' })
export const emptyCompassState = (): NavigationCompassStoredState => ({ scores: {}, currentSkillIndex: 0, completed: false, reflections: emptyReflections() })

export function getRadarPoint(index: number, total: number, score: number, maxScore: number, radius: number, centerX: number, centerY: number): { x: number; y: number } {
  const angle = (Math.PI * 2 * index) / total - Math.PI / 2
  const distance = (score / maxScore) * radius
  return { x: centerX + Math.cos(angle) * distance, y: centerY + Math.sin(angle) * distance }
}

export function buildRadarPolygon(scores: NavigationScore[], radius: number, centerX: number, centerY: number): string {
  return scores.map((score, index) => {
    const point = getRadarPoint(index, scores.length, score, 5, radius, centerX, centerY)
    return `${round(point.x)},${round(point.y)}`
  }).join(' ')
}

export function getSkillIdsWithScore(scores: Record<NavigationSkillId, NavigationScore>, wanted: 'max' | 'min'): NavigationSkillId[] {
  const values = Object.values(scores)
  const target = wanted === 'max' ? Math.max(...values) : Math.min(...values)
  return navigationSkills.filter(skill => scores[skill.id] === target).map(skill => skill.id)
}

export function buildCompassResult(scores: Record<NavigationSkillId, NavigationScore>, completedAt = new Date().toISOString()): NavigationCompassResult {
  return { scores, strongestSkillIds: getSkillIdsWithScore(scores, 'max'), growthSkillIds: getSkillIdsWithScore(scores, 'min'), completedAt }
}

export function readNavigationCompassState(storage: Storage = localStorage): NavigationCompassStoredState {
  try {
    const parsed = JSON.parse(storage.getItem(NAVIGATION_COMPASS_STORAGE_KEY) ?? 'null') as NavigationCompassStoredState | null
    if (!parsed || typeof parsed !== 'object') return emptyCompassState()
    const scores = sanitizeScores(parsed.scores)
    const currentSkillIndex = Number.isInteger(parsed.currentSkillIndex) ? clamp(parsed.currentSkillIndex, 0, navigationSkills.length - 1) : 0
    return { scores, currentSkillIndex, completed: Boolean(parsed.completed) && Object.keys(scores).length === navigationSkills.length, reflections: { ...emptyReflections(), ...(parsed.reflections ?? {}) }, completedAt: typeof parsed.completedAt === 'string' ? parsed.completedAt : undefined }
  } catch { return emptyCompassState() }
}

export function writeNavigationCompassState(state: NavigationCompassStoredState, storage: Storage = localStorage) {
  storage.setItem(NAVIGATION_COMPASS_STORAGE_KEY, JSON.stringify(state))
}

export function clearNavigationCompassState(storage: Storage = localStorage) { storage.removeItem(NAVIGATION_COMPASS_STORAGE_KEY) }

function sanitizeScores(scores: unknown): Partial<Record<NavigationSkillId, NavigationScore>> {
  if (!scores || typeof scores !== 'object') return {}
  return Object.fromEntries(navigationSkills.flatMap(skill => {
    const value = (scores as Record<string, unknown>)[skill.id]
    return navigationScoreValues.includes(value as NavigationScore) ? [[skill.id, value as NavigationScore]] : []
  })) as Partial<Record<NavigationSkillId, NavigationScore>>
}
function clamp(value: number, min: number, max: number) { return Math.min(Math.max(value, min), max) }
function round(value: number) { return Math.round(value * 100) / 100 }

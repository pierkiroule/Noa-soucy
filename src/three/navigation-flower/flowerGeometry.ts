import type { NavigationSkill } from '../../data/navigationSkills'
export interface FlowerPetalState { skillId: NavigationSkill; angle: number; count: number; maxCount: number; currentLength: number; targetLength: number }
export const FLOWER_ANGLES: Record<NavigationSkill, number> = { observe: 0, adapt: Math.PI / 4, dare: Math.PI / 2, breathe: (3 * Math.PI) / 4, anchor: Math.PI, connect: (5 * Math.PI) / 4, bounce: (3 * Math.PI) / 2, course: (7 * Math.PI) / 4 }
export function getTargetLength(count: number, maxCount: number, minLength = 28, growthRange = 58) { const normalized = maxCount === 0 ? 0 : count / maxCount; return minLength + normalized * growthRange }
export function smoothLength(currentLength: number, targetLength: number) { return currentLength + (targetLength - currentLength) * 0.06 }

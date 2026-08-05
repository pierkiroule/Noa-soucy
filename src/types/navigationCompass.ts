import type { NavigationSkill } from '../data/navigationSkills'
export type NavigationSkillId = NavigationSkill
export type NavigationScore = 1 | 2 | 3 | 4 | 5
export interface NavigationSkillScore { skillId: NavigationSkillId; score: NavigationScore }
export interface NavigationCompassResult { scores: Record<NavigationSkillId, NavigationScore>; strongestSkillIds: NavigationSkillId[]; growthSkillIds: NavigationSkillId[]; completedAt: string }

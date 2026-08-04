import type { ParticleMode } from './particleTypes.ts'

export const keywordMap = {
  wind: ['vent', 'souffle', 'dériver', 'dérive', 'voile', 'horizon'],
  seed: ['graine', 'racine', 'terre', 'pousse', 'grandir', 'naître'],
  light: ['lumière', 'éclat', 'aurore', 'soleil', 'briller', 'pétale'],
  water: ['mer', 'vague', 'vagues', 'écume', 'pluie', 'goutte', 'eau'],
  silence: ['silence', 'attendre', 'longtemps', 'immobile', 'calme', 'lentement'],
} as const

export const normalizeParticleText = (text:string) => text.toLocaleLowerCase('fr').normalize('NFD').replace(/[\u0300-\u036f]/g, '')
const priority = new Set(['silence', 'attendre', 'immobile', 'longtemps'])
export function detectParticleMode(visibleText:string):ParticleMode {
  const words = normalizeParticleText(visibleText).match(/[a-z]+/g) ?? []
  if (words.some(word => priority.has(word))) return 'silence'
  const modes = Object.keys(keywordMap) as Exclude<ParticleMode, 'none'>[]
  const scores = modes.map(mode => [mode, keywordMap[mode].reduce((sum, keyword) => sum + words.filter(word => word === normalizeParticleText(keyword)).length, 0)] as const)
  const winner = scores.reduce((best, current) => current[1] > best[1] ? current : best, ['wind', 0] as const)
  return winner[1] ? winner[0] : 'none'
}

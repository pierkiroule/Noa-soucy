import type { TagDefinition } from '../types'
import { randomItem } from '../utils/random'
import { universes } from './univers/library'
import type { PoetryUniverse } from './univers'

const recentFragments: string[] = []
const RECENT_LIMIT = 24

function scoreUniverse(universe: PoetryUniverse, resonances: TagDefinition[]) {
  return resonances.reduce(
    (score, resonance) => score + (universe.affinities[resonance.id] ?? 0),
    0,
  )
}

function dominantUniverse(resonances: TagDefinition[]) {
  return universes
    .map((universe, order) => ({ universe, order, score: scoreUniverse(universe, resonances) }))
    .sort((a, b) => b.score - a.score || a.order - b.order)[0].universe
}

function pickFresh(fragments: string[]) {
  const fresh = fragments.filter((fragment) => !recentFragments.includes(fragment))
  const fragment = randomItem(fresh.length > 0 ? fresh : fragments)

  recentFragments.push(fragment)
  if (recentFragments.length > RECENT_LIMIT) {
    recentFragments.splice(0, recentFragments.length - RECENT_LIMIT)
  }

  return fragment
}

export function generateCreation(resonances: TagDefinition[]) {
  if (resonances.length === 0) {
    throw new Error('Une résonance est nécessaire pour faire fleurir une création.')
  }

  const dominant = dominantUniverse(resonances)
  const text = [
    pickFresh(dominant.intros),
    pickFresh(dominant.images),
    pickFresh(dominant.developments),
    pickFresh(dominant.openings),
    pickFresh(dominant.endings),
  ].join('\n\n')

  return { text, universe: dominant.id }
}

export function generatePollenSuggestions(resonances: TagDefinition[]) {
  if (resonances.length === 0) {
    return { suggestions: [], universe: 'graine' }
  }

  const dominant = dominantUniverse(resonances)
  const fragments = [
    ...dominant.intros,
    ...dominant.images,
    ...dominant.developments,
    ...dominant.openings,
    ...dominant.endings,
    `${dominant.intros[0]}\n${dominant.images[1]}`,
    `${dominant.developments[1]}\n${dominant.endings[0]}`,
  ]

  return {
    universe: dominant.id,
    suggestions: fragments.map((text, index) => ({
      id: `${dominant.id}-${Date.now()}-${index}`,
      text,
    })),
  }
}

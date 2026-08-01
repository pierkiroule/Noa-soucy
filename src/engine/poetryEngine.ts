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

  const ranked = universes
    .map((universe, order) => ({
      universe,
      order,
      score: scoreUniverse(universe, resonances),
    }))
    .sort((a, b) => b.score - a.score || a.order - b.order)

  const dominant = ranked[0].universe
  const text = [
    pickFresh(dominant.intros),
    pickFresh(dominant.images),
    pickFresh(dominant.developments),
    pickFresh(dominant.openings),
    pickFresh(dominant.endings),
  ].join('\n\n')

  return { text, universe: dominant.id }
}

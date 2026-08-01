import type { TagDefinition } from '../types'
import { randomItem } from '../utils/random'
import { brume } from './univers/brume'
import { eau } from './univers/eau'
import { feu } from './univers/feu'
import { nuit } from './univers/nuit'
import { pierre } from './univers/pierre'
import { souffle } from './univers/souffle'
import type { PoetryUniverse } from './univers'

const universes: PoetryUniverse[] = [
  pierre,
  brume,
  feu,
  eau,
  nuit,
  souffle,
]

/**
 * Ces vers font entrer la résonance choisie dans la création par une image
 * sobre, ouverte et impersonnelle.
 */
const tagEchoes: Record<string, string[]> = {
  heavy: [
    'Le poids dessine une ombre lente au bord du chemin.',
    'La terre demeure sous ce qui pèse.',
  ],
  burn: [
    'La chaleur trace un cercle de lumière dans la nuit.',
    'Une braise demeure, silencieuse et claire.',
  ],
  overflow: [
    'L’eau dépasse un instant le dessin de ses rives.',
    'La vague ouvre le paysage avant de se retirer.',
  ],
  freeze: [
    'Sous la glace, une eau très lente poursuit son passage.',
    'Le givre suspend les contours sans les effacer.',
  ],
  loop: [
    'La spirale revient, légèrement déplacée dans la lumière.',
    'Le cercle contient d’infimes variations.',
  ],
  blur: [
    'La brume déplace doucement la frontière des choses.',
    'Les contours reposent derrière une lumière pâle.',
  ],
  invade: [
    'Le vent occupe le paysage, puis change de direction.',
    'Un tourbillon traverse l’espace sans en fixer les limites.',
  ],
  change: [
    'Une pousse claire apparaît dans la matière sombre.',
    'La graine entrouvre lentement son silence.',
  ],
  hurt: [
    'La fêlure recueille un mince trait de lumière.',
    'Une ligne fragile traverse la surface.',
  ],
  isolate: [
    'Une île se tient dans la clarté calme du soir.',
    'La distance donne au silence une forme nouvelle.',
  ],
  last: [
    'Le temps dépose ses anneaux invisibles.',
    'La saison avance dans une lumière presque immobile.',
  ],
  breathe: [
    'Un souffle entrouvre l’espace.',
    'L’air circule entre les formes silencieuses.',
  ],
}

function scoreUniverse(universe: PoetryUniverse, tags: TagDefinition[]) {
  return tags.reduce(
    (score, tag) => score + (universe.affinities[tag.id] ?? 0),
    0,
  )
}

function rankUniverses(tags: TagDefinition[]) {
  return universes
    .map((universe, order) => ({
      universe,
      score: scoreUniverse(universe, tags),
      order,
    }))
    .sort((a, b) => b.score - a.score || a.order - b.order)
}

function pickEcho(tags: TagDefinition[]) {
  const candidates = tags.flatMap((tag) => tagEchoes[tag.id] ?? [])

  return candidates.length > 0 ? randomItem(candidates) : null
}

/**
 * Compose une création en suivant un arc : accueillir, mettre en image,
 * reconnaître le ressenti, ouvrir, puis laisser une dernière respiration.
 */
export function generateCreation(tags: TagDefinition[]): string {
  if (tags.length === 0) {
    throw new Error('Au moins une résonance est nécessaire pour créer.')
  }

  const rankedUniverses = rankUniverses(tags)
  const primary = rankedUniverses[0].universe
  const secondary = rankedUniverses.find(
    ({ score, universe }) => score > 0 && universe.id !== primary.id,
  )?.universe
  const echo = pickEcho(tags)

  const recognition = [
    randomItem(primary.developments),
    echo,
  ].filter(Boolean).join('\n')

  return [
    randomItem(primary.intros),
    randomItem(primary.images),
    recognition,
    randomItem(secondary?.openings ?? primary.openings),
    randomItem(primary.endings),
  ].join('\n\n')
}

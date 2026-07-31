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
 * Ces vers font entrer le ressenti choisi dans le poème. Ils sont volontairement
 * concrets et sans diagnostic : le moteur accompagne, il n'interprète pas.
 */
const tagEchoes: Record<string, string[]> = {
  heavy: [
    'Tu peux déposer un instant ce que tu portes depuis si longtemps.',
    'Tes épaules méritent aussi la douceur du sol.',
  ],
  burn: [
    'Cette chaleur témoigne peut-être de quelque chose qui compte profondément.',
    'Même ce qui brûle en toi peut être approché avec douceur.',
  ],
  overflow: [
    'Ton trop-plein n’est pas une faute : il cherche une rive assez vaste.',
    'Tu n’es pas la vague, tu es aussi l’espace qui peut l’accueillir.',
  ],
  empty: [
    'Le vide peut être une clairière, pas seulement une absence.',
    'Là où tout semble retiré, une place demeure pour le nouveau.',
  ],
  shake: [
    'Ce qui tremble cherche parfois une nouvelle manière de tenir debout.',
    'Tu peux vaciller sans perdre ta place dans le monde.',
  ],
  freeze: [
    'L’immobile aussi prépare parfois son dégel.',
    'Tu as le droit d’attendre que le mouvement revienne à toi.',
  ],
  loop: [
    'La spirale repasse au même endroit, mais jamais tout à fait à la même hauteur.',
    'Une pensée qui revient peut aussi apprendre à repartir autrement.',
  ],
  blur: [
    'Tu peux avancer sans exiger de toi un horizon parfaitement net.',
    'Le flou n’enlève rien à la vérité de ton prochain pas.',
  ],
  block: [
    'Une porte fermée n’efface pas toutes les autres issues.',
    'Ce qui résiste invite peut-être à inventer un autre geste.',
  ],
  trap: [
    'Chaque nœud possède un fil qui ne demande qu’à être suivi.',
    'Tu peux desserrer doucement ce que la force ne sait pas défaire.',
  ],
  invade: [
    'Tout ce qui te traverse n’a pas à devenir ta demeure.',
    'Ton espace intérieur est plus vaste que ce qui l’occupe aujourd’hui.',
  ],
  darken: [
    'Même assombri, ton ciel n’a pas perdu ses étoiles.',
    'La lumière peut se reposer sans avoir disparu.',
  ],
  change: [
    'Le désir de changement est déjà une racine tournée vers demain.',
    'Quelque chose en toi a commencé avant même le premier pas.',
  ],
  hurt: [
    'La fêlure ne diminue pas ta valeur ; elle indique où mettre la tendresse.',
    'Ce qui fait mal mérite une présence, pas une injonction.',
  ],
  isolate: [
    'Même depuis ton île, tu appartiens encore à l’archipel.',
    'La distance n’a pas défait tous les liens invisibles.',
  ],
  doubt: [
    'Douter ne t’enlève pas ta boussole ; cela te rend attentif au chemin.',
    'Tu peux ne pas savoir encore, et rester pleinement en route.',
  ],
  last: [
    'Ce qui dure n’est pas condamné à durer de la même façon.',
    'Même les longues saisons finissent par changer de lumière.',
  ],
  breathe: [
    'Ton souffle est une porte que le monde ne peut pas fermer.',
    'Prends seulement l’espace nécessaire au prochain souffle.',
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
 * Compose un poème cohérent en suivant un arc : accueillir, mettre en image,
 * reconnaître le ressenti, ouvrir, puis laisser une dernière respiration.
 */
export function generatePoem(tags: TagDefinition[]): string {
  if (tags.length === 0) {
    throw new Error('Au moins un ressenti est nécessaire pour créer un poème.')
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

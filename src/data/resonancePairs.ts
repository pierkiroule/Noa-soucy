import type { ResonanceBubbleId } from './resonanceBubbles.ts'

export function buildPairKey(first: ResonanceBubbleId, second: ResonanceBubbleId): string {
  return [first, second].sort().join('|')
}

export const resonancePairTexts: Record<string, string> = {
  'rain|seed': 'Certaines choses n’attendent pas qu’on les pousse. Elles attendent simplement les bonnes conditions.',
  'leaf|twig': 'Il suffit parfois de peu pour qu’un appui devienne un abri.',
  'flower|wind': 'On ne choisit pas toujours le vent. On peut apprendre à lui répondre.',
  'horizon|waves': 'Même lorsque le rivage disparaît, une direction peut rester vivante.',
  'light|seed': 'Certaines ressources apparaissent lorsqu’un regard se pose autrement.',
  'flower|waves': 'Ce qui paraît fragile peut parfois devenir une manière d’avancer.',
  'leaf|rain': 'Ce qui accueille peut aussi retenir juste assez pour laisser quelque chose grandir.',
  'horizon|wind': 'Une direction ne donne pas toujours un chemin. Elle donne parfois seulement un mouvement.',
  'light|waves': 'Certaines traversées changent moins la mer que la façon de la regarder.',
  'seed|twig': 'Une naissance minuscule trouve parfois son premier appui dans presque rien.',
  'flower|light': 'Il existe des présences qui ouvrent la lumière sans chercher à la retenir.',
  'rain|waves': 'Tout ce qui tombe ne se perd pas. Certaines gouttes rejoignent un mouvement plus vaste.',
}

export const defaultResonanceText = 'Deux images se rencontrent. Peut-être qu’une troisième histoire commence entre elles.'

export function resolveResonanceText(first: ResonanceBubbleId, second: ResonanceBubbleId): string {
  return resonancePairTexts[buildPairKey(first, second)] ?? defaultResonanceText
}

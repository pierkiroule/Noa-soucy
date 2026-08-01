import type { TagDefinition } from '../types'
import { randomItem } from '../utils/random'

const resonanceImages: Record<string, string[]> = {
  heavy: [
    'Une pierre repose au bord du jardin.',
    'La mousse dessine lentement la surface du rocher.',
  ],
  burn: [
    'Une braise demeure sous la cendre claire.',
    'La flamme éclaire un cercle dans la nuit.',
  ],
  overflow: [
    'L’eau rejoint doucement les contours de la rive.',
    'Une vague traverse le reflet du ciel.',
  ],
  freeze: [
    'Le givre révèle les nervures d’une feuille.',
    'Sous la glace, une lumière reste suspendue.',
  ],
  loop: [
    'Une spirale se déploie au cœur de la fougère.',
    'Le vent revient parmi les herbes hautes.',
  ],
  blur: [
    'La brume efface un instant la lisière.',
    'Les formes apparaissent dans une lumière diffuse.',
  ],
  invade: [
    'Le vent traverse tout le paysage.',
    'Les herbes gagnent les pierres du sentier.',
  ],
  hurt: [
    'Une fêlure laisse passer un trait de lumière.',
    'La pluie se dépose au creux d’un pétale.',
  ],
  change: [
    'Une pousse soulève un peu de terre.',
    'Le bourgeon entrouvre une saison nouvelle.',
  ],
  isolate: [
    'La lune veille au-dessus d’un jardin silencieux.',
    'Une île se dessine dans la clarté du soir.',
  ],
  last: [
    'La lumière se déplace lentement sur la pierre.',
    'Les saisons déposent leurs couleurs successives.',
  ],
  breathe: [
    'Une bulle d’air remonte vers la surface.',
    'La fenêtre ouverte accueille le passage du vent.',
  ],
}

const openings = [
  'Dans le jardin, un silence prend forme.',
  'À la lisière du jour, le paysage se recueille.',
  'Quelques traces se rencontrent dans la lumière.',
]

const endings = [
  'Une fleur demeure dans la lumière.',
  'Le jardin garde cette résonance.',
  'Quelque chose fleurit, simplement.',
]

export function generatePoem(resonances: TagDefinition[]): string {
  if (resonances.length === 0) {
    throw new Error('Une résonance est nécessaire pour faire fleurir une création.')
  }

  const images = resonances.map((resonance) =>
    randomItem(resonanceImages[resonance.id]),
  )

  return [
    randomItem(openings),
    ...images,
    randomItem(endings),
  ].join('\n\n')
}

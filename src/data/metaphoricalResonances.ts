export type ResonancePetalId =
  | 'storm'
  | 'shell'
  | 'seed'
  | 'roots'
  | 'flower'
  | 'wind'
  | 'horizon'
  | 'journey'

export interface MetaphoricalResonance {
  id: ResonancePetalId
  title: string
  actionLabel: string
  glyph: string
  quote: string
  question: string
  helperText?: string
}

export const metaphoricalResonances: MetaphoricalResonance[] = [
  { id: 'storm', title: 'La tempête', actionLabel: 'Traverser', glyph: '🌊', quote: 'La nuit avait tout brassé. Le ciel. L’eau. Le sable du silence.', question: 'Qu’est-ce qui vous bouscule ou rend votre traversée incertaine aujourd’hui ?', helperText: 'Vous pouvez nommer une situation, une émotion, une question ou simplement une sensation.' },
  { id: 'shell', title: 'La coquille', actionLabel: 'Protéger', glyph: '🌰', quote: 'La petite coquille apparaissait entre deux vagues, puis revenait.', question: 'Qu’est-ce qui vous aide encore à tenir ou à rester à flot ?', helperText: 'Une personne, une habitude, un lieu, une valeur, un souvenir ou une qualité.' },
  { id: 'seed', title: 'La graine', actionLabel: 'Grandir', glyph: '🌱', quote: 'Certaines choses poussent mieux lorsqu’on leur laisse le temps de choisir leur histoire.', question: 'Qu’est-ce qui cherche doucement à grandir dans votre vie ?', helperText: 'Quelque chose de très discret peut déjà être en train de commencer.' },
  { id: 'roots', title: 'Les racines', actionLabel: 'S’appuyer', glyph: '🌿', quote: 'Une racine cherchait son chemin, grain après grain.', question: 'Sur quoi pouvez-vous prendre appui dans cette traversée ?', helperText: 'Pensez aux ressources déjà disponibles, même modestes.' },
  { id: 'flower', title: 'La fleur', actionLabel: 'Fleurir', glyph: '🌼', quote: 'Une fleur de souci ouvrit son visage au-dessus de la mer.', question: 'Quelle ressource en vous pourrait aujourd’hui devenir une voile ?', helperText: 'Une capacité, une envie, une relation, une expérience ou une valeur.' },
  { id: 'wind', title: 'Le vent', actionLabel: 'S’ajuster', glyph: '🌬️', quote: 'La petite coquille ne suivait plus seulement les vagues. Elle répondait au vent.', question: 'À quoi pourriez-vous répondre autrement, sans chercher à tout contrôler ?', helperText: 'Qu’est-ce qui ne dépend pas de vous ? Et quel ajustement reste possible ?' },
  { id: 'horizon', title: 'L’horizon', actionLabel: 'S’orienter', glyph: '🌅', quote: 'Même lorsque le rivage disparaît, une direction peut rester vivante.', question: 'Vers quoi aimeriez-vous vous rapprocher, même si le chemin reste flou ?', helperText: 'Une direction peut être plus simple qu’un objectif précis.' },
  { id: 'journey', title: 'La traversée', actionLabel: 'Avancer', glyph: '⛵', quote: 'Il existe des voyages que l’on dérange à vouloir les conduire.', question: 'Quel serait le plus petit mouvement possible pour poursuivre votre traversée ?', helperText: 'Choisissez un geste simple, réaliste et observable.' }
]

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
  meaning: string
  invitation: string
  question: string
  helperText?: string
}

export const metaphoricalResonances: MetaphoricalResonance[] = [
  {
    id: 'storm',
    title: 'La tempête',
    actionLabel: 'Traverser',
    glyph: '🌊',
    quote: 'La nuit avait tout brassé. Le ciel. L’eau. Le sable du silence.',
    meaning: 'La tempête représente les soucis qui prennent toute la place. Quand tout se mélange, il est difficile de savoir par où commencer.',
    invitation: 'Reconnaissez simplement ce qui est difficile. Nommer un souci aide parfois à le regarder plus clairement, sans devoir le régler tout de suite.',
    question: 'Quel souci vous pèse ou vous bouscule le plus aujourd’hui ?',
    helperText: 'Une situation, une émotion ou une inquiétude. Quelques mots suffisent.',
  },
  {
    id: 'shell',
    title: 'La coquille',
    actionLabel: 'Protéger',
    glyph: '🌰',
    quote: 'La petite coquille apparaissait entre deux vagues, puis revenait.',
    meaning: 'La coquille représente ce qui vous protège : un lieu calme, une personne de confiance, une habitude rassurante ou le droit de dire non.',
    invitation: 'Pensez à ce qui vous permet de souffler. Se protéger peut aussi vouloir dire faire une pause ou faire respecter ses limites.',
    question: 'Qu’est-ce qui pourrait vous aider à vous sentir protégé ou soutenu aujourd’hui ?',
    helperText: 'Une personne, un lieu, une activité, une limite ou un moment pour vous.',
  },
  {
    id: 'seed',
    title: 'La graine',
    actionLabel: 'Grandir',
    glyph: '🌱',
    quote: 'Certaines choses poussent mieux lorsqu’on leur laisse le temps de choisir leur histoire.',
    meaning: 'La graine représente une envie ou un changement qui commence. Une petite idée ou l’envie d’aller mieux est déjà un début.',
    invitation: 'Remarquez ce que vous aimeriez voir grandir. Cette envie a surtout besoin de temps, d’attention et d’un premier geste simple.',
    question: 'Qu’aimeriez-vous voir commencer ou grandir dans votre vie ?',
    helperText: 'Une relation, une activité, un apprentissage ou une façon de prendre soin de vous.',
  },
  {
    id: 'roots',
    title: 'Les racines',
    actionLabel: 'S’appuyer',
    glyph: '🌿',
    quote: 'Une racine cherchait son chemin, grain après grain.',
    meaning: 'Les racines représentent ce qui vous aide déjà à tenir : vos proches, vos habitudes, vos qualités et les difficultés déjà dépassées.',
    invitation: 'Vous n’avez pas à repartir de zéro. Cherchez un appui connu que vous pourriez utiliser aujourd’hui.',
    question: 'Sur qui ou sur quoi pouvez-vous compter en ce moment ?',
    helperText: 'Une personne, une qualité, une expérience passée ou une ressource concrète.',
  },
  {
    id: 'flower',
    title: 'La fleur',
    actionLabel: 'Fleurir',
    glyph: '🌼',
    quote: 'Une fleur de souci ouvrit son visage au-dessus de la mer.',
    meaning: 'La fleur représente ce qui vous fait du bien malgré les soucis : une qualité, un plaisir simple, une relation ou une activité.',
    invitation: 'Pensez à une source de joie que vous oubliez parfois. Faites-lui une petite place aujourd’hui, sans chercher à être parfait.',
    question: 'Qu’est-ce qui pourrait vous apporter un peu d’énergie ou de joie aujourd’hui ?',
    helperText: 'Une musique, une personne, une promenade, une activité créative ou une qualité.',
  },
  {
    id: 'wind',
    title: 'Le vent',
    actionLabel: 'S’ajuster',
    glyph: '🌬️',
    quote: 'La petite coquille ne suivait plus seulement les vagues. Elle répondait au vent.',
    meaning: 'Le vent représente ce que vous ne décidez pas : les réactions des autres, un imprévu, le passé ou certaines contraintes.',
    invitation: 'Séparez ce que vous pouvez changer de ce qui ne dépend pas de vous. Gardez votre énergie pour une action possible.',
    question: 'Dans ce souci, qu’est-ce qui dépend de vous, même un tout petit peu ?',
    helperText: 'Changer une action, demander de l’aide, prendre du recul ou attendre.',
  },
  {
    id: 'horizon',
    title: 'L’horizon',
    actionLabel: 'S’orienter',
    glyph: '🌅',
    quote: 'Même lorsque le rivage disparaît, une direction peut rester vivante.',
    meaning: 'L’horizon représente la direction où vous aimeriez aller malgré vos soucis. Vous n’avez pas besoin de connaître tout le chemin.',
    invitation: 'Qu’est-ce qui compte maintenant : plus de calme, de confiance, de lien, de liberté ou de stabilité ? Faites-en votre repère.',
    question: 'Vers quoi aimeriez-vous avancer dans les prochains jours ?',
    helperText: 'Choisissez une direction simple plutôt qu’un grand objectif à réussir.',
  },
  {
    id: 'journey',
    title: 'La traversée',
    actionLabel: 'Avancer',
    glyph: '⛵',
    quote: 'Il existe des voyages que l’on dérange à vouloir les conduire.',
    meaning: 'La traversée, c’est le chemin fait avec vos soucis, un jour après l’autre. Avancer peut être résoudre une petite partie, demander du soutien ou se reposer.',
    invitation: 'Choisissez une étape possible aujourd’hui ou demain. Un geste simple est souvent plus utile qu’une grande décision.',
    question: 'Quel petit pas pourriez-vous faire pour mieux vivre ou résoudre ce souci ?',
    helperText: 'Envoyer un message, prendre un rendez-vous, noter une idée, faire une pause ou parler à quelqu’un.',
  },
]

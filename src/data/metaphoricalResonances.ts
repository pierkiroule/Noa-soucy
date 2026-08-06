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
    meaning: 'La tempête représente les soucis qui prennent beaucoup de place : une difficulté, un conflit, une peur ou une période de changement. Quand tout se mélange, il peut être difficile de savoir par où commencer.',
    invitation: 'Vous pouvez simplement reconnaître ce qui est difficile en ce moment. Mettre un nom sur un souci aide parfois à le regarder plus clairement, sans devoir le régler tout de suite.',
    question: 'Quel souci vous pèse ou vous bouscule le plus aujourd’hui ?',
    helperText: 'Vous pouvez penser à une situation précise, à une émotion ou à une inquiétude. Quelques mots suffisent.',
  },
  {
    id: 'shell',
    title: 'La coquille',
    actionLabel: 'Protéger',
    glyph: '🌰',
    quote: 'La petite coquille apparaissait entre deux vagues, puis revenait.',
    meaning: 'La coquille représente ce qui vous protège quand vous traversez un souci. Ce peut être un endroit calme, une personne de confiance, une habitude rassurante ou le droit de dire non.',
    invitation: 'Pensez à ce qui vous permet de souffler et de vous sentir un peu plus en sécurité. Se protéger peut aussi vouloir dire faire une pause ou demander que vos limites soient respectées.',
    question: 'Qu’est-ce qui pourrait vous aider à vous sentir protégé ou soutenu aujourd’hui ?',
    helperText: 'Une personne, un lieu, une activité, une limite ou un petit moment pour vous peuvent déjà faire une différence.',
  },
  {
    id: 'seed',
    title: 'La graine',
    actionLabel: 'Grandir',
    glyph: '🌱',
    quote: 'Certaines choses poussent mieux lorsqu’on leur laisse le temps de choisir leur histoire.',
    meaning: 'La graine représente une envie ou un changement qui commence à peine. Il n’est pas nécessaire d’avoir un grand projet : une petite idée ou l’envie d’aller un peu mieux est déjà un début.',
    invitation: 'Remarquez ce que vous aimeriez voir grandir dans votre vie. Comme une graine, cette envie a surtout besoin d’un peu de temps, d’attention et d’un premier geste simple.',
    question: 'Qu’aimeriez-vous voir commencer ou grandir dans votre vie ?',
    helperText: 'Cela peut être une relation, une activité, une confiance nouvelle, un apprentissage ou une façon de prendre soin de vous.',
  },
  {
    id: 'roots',
    title: 'Les racines',
    actionLabel: 'S’appuyer',
    glyph: '🌿',
    quote: 'Une racine cherchait son chemin, grain après grain.',
    meaning: 'Les racines représentent tout ce qui vous aide déjà à tenir face aux soucis. Ce sont vos proches, vos habitudes utiles, vos qualités, vos connaissances et les difficultés que vous avez déjà réussi à dépasser.',
    invitation: 'Vous n’avez peut-être pas à repartir de zéro. Cherchez un appui que vous connaissez déjà et que vous pourriez utiliser de nouveau aujourd’hui.',
    question: 'Sur qui ou sur quoi pouvez-vous compter en ce moment ?',
    helperText: 'Pensez à une personne, une qualité, une expérience passée ou une ressource concrète qui vous aide réellement.',
  },
  {
    id: 'flower',
    title: 'La fleur',
    actionLabel: 'Fleurir',
    glyph: '🌼',
    quote: 'Une fleur de souci ouvrit son visage au-dessus de la mer.',
    meaning: 'La fleur représente ce qui vous fait du bien et vous redonne de l’énergie malgré les soucis. Elle peut être une qualité personnelle, un plaisir simple, une relation ou une activité dans laquelle vous vous sentez vous-même.',
    invitation: 'Pensez à une force ou à une source de joie que vous oubliez parfois. Vous pouvez lui faire une petite place aujourd’hui, sans chercher à être parfait ni productif.',
    question: 'Qu’est-ce qui pourrait vous apporter un peu d’énergie ou de joie aujourd’hui ?',
    helperText: 'Une musique, une personne, une promenade, une activité créative ou l’une de vos qualités peuvent être un bon point de départ.',
  },
  {
    id: 'wind',
    title: 'Le vent',
    actionLabel: 'S’ajuster',
    glyph: '🌬️',
    quote: 'La petite coquille ne suivait plus seulement les vagues. Elle répondait au vent.',
    meaning: 'Le vent représente ce que vous ne pouvez pas décider : les réactions des autres, un imprévu, le passé ou certaines contraintes. Vous ne contrôlez pas le vent, mais vous pouvez parfois changer votre manière d’y répondre.',
    invitation: 'Essayez de séparer ce que vous pouvez changer de ce qui ne dépend pas de vous. Cela permet de garder votre énergie pour une action réellement possible.',
    question: 'Dans ce souci, qu’est-ce qui dépend de vous, même un tout petit peu ?',
    helperText: 'Vous pourriez changer une action, demander de l’aide, prendre du recul ou choisir de ne pas agir tout de suite.',
  },
  {
    id: 'horizon',
    title: 'L’horizon',
    actionLabel: 'S’orienter',
    glyph: '🌅',
    quote: 'Même lorsque le rivage disparaît, une direction peut rester vivante.',
    meaning: 'L’horizon représente la direction dans laquelle vous aimeriez aller après ou malgré vos soucis. Vous n’avez pas besoin de connaître tout le chemin : savoir ce que vous voulez retrouver ou préserver peut déjà vous guider.',
    invitation: 'Demandez-vous ce qui compte le plus pour vous maintenant : plus de calme, de confiance, de lien, de liberté ou de stabilité. Cette réponse peut servir de repère pour la suite.',
    question: 'Vers quoi aimeriez-vous avancer dans les prochains jours ?',
    helperText: 'Choisissez une direction simple qui vous fait du bien, plutôt qu’un grand objectif à réussir.',
  },
  {
    id: 'journey',
    title: 'La traversée',
    actionLabel: 'Avancer',
    glyph: '⛵',
    quote: 'Il existe des voyages que l’on dérange à vouloir les conduire.',
    meaning: 'La traversée, c’est le chemin que vous faites avec vos soucis, un jour après l’autre. Avancer ne veut pas dire que tout va bien : cela peut être résoudre une petite partie du problème, demander du soutien, se reposer ou essayer autrement.',
    invitation: 'Choisissez une étape assez petite pour être possible aujourd’hui ou demain. Un geste simple est souvent plus utile qu’une grande décision difficile à tenir.',
    question: 'Quel petit pas pourriez-vous faire pour mieux vivre ou résoudre ce souci ?',
    helperText: 'Par exemple : envoyer un message, prendre un rendez-vous, noter une idée, faire une pause ou parler à une personne de confiance.',
  },
]

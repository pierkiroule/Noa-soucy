import type { FloatingWordId } from './floatingWords.ts'

export function buildWordPairKey(first: FloatingWordId, second: FloatingWordId): string {
  return [first, second].sort().join('|')
}

export const resourcePhrases: Record<string, string> = {
  'attendre|grandir': 'Certaines choses grandissent mieux lorsqu’on leur laisse du temps.',
  'observer|respirer': 'Ralentir un instant peut parfois rendre le chemin plus visible.',
  'avancer|oser': 'Un petit pas suffit parfois à remettre le voyage en mouvement.',
  'garder-le-cap|sadapter': 'Changer de route ne signifie pas toujours perdre sa direction.',
  'respirer|sancrer': 'Retrouver un appui peut commencer par un simple souffle.',
  'prendre-soin|relier': 'Prendre soin de soi passe parfois par le fait de ne pas rester seul.',
  'accueillir|faire-confiance': 'Accueillir ce qui vient n’empêche pas de rester attentif à ce qui compte.',
  'choisir|oser': 'Choisir ne demande pas toujours d’être certain. Parfois, il suffit d’essayer.',
  'grandir|rebondir': 'Après une difficulté, quelque chose peut reprendre forme autrement.',
  'choisir|observer': 'Regarder plus longtemps peut aider une direction à apparaître.',
  'attendre|faire-confiance': 'Attendre n’est pas toujours renoncer. Cela peut être laisser une place au possible.',
  'rebondir|sadapter': 'S’adapter, c’est parfois retrouver de l’élan sans revenir exactement au même endroit.',
  'garder-le-cap|relier': 'Un lien peut devenir un repère lorsque l’horizon disparaît.',
  'prendre-soin|sancrer': 'Les appuis les plus simples sont parfois ceux qui nous aident le plus à tenir.',
  'accueillir|respirer': 'Respirer peut créer juste assez d’espace pour accueillir ce qui est là.',
}

export const defaultResourcePhrase = 'Deux mots se rencontrent. Peut-être qu’une nouvelle manière d’avancer peut naître entre eux.'

export function resolveResourcePhrase(first: FloatingWordId, second: FloatingWordId): string {
  return resourcePhrases[buildWordPairKey(first, second)] ?? defaultResourcePhrase
}

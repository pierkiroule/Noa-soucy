import type { ResonanceSeedDefinition } from '../types/resonanceSeeds'

export const resonanceSeeds: ResonanceSeedDefinition[] = [
  { id:'links', title:'Graine des Liens', subtitle:'Ceux qui rendent la traversée moins solitaire.' },
  { id:'supports', title:'Graine des Appuis', subtitle:'Ce qui aide à tenir quand ça tangue.' },
  { id:'clearings', title:'Graine des Éclaircies', subtitle:'Ce qui fait du bien, même un peu.' },
  { id:'impulses', title:'Graine des Élans', subtitle:'Ce qui donne envie de repartir.' },
  { id:'possibles', title:'Graine des Possibles', subtitle:'Ce qui pourrait encore arriver.' },
]

/** Des mots volontairement ouverts : ils sont proposés, jamais interprétés. */
export const resonanceWordTags = [
  'Amitié', 'Famille', 'Présence', 'Écoute', 'Entraide', 'Confiance',
  'Calme', 'Repos', 'Respirer', 'Musique', 'Nature', 'Rire',
  'Courage', 'Patience', 'Curiosité', 'Créativité', 'Mouvement',
  'Espoir', 'Rêve', 'Découverte', 'Liberté', 'Douceur', 'Joie', 'Temps',
] as const

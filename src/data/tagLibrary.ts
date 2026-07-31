import type { TagDefinition } from '../types'

export const tagLibrary: TagDefinition[] = [
  // Impacts corporels et émotionnels

  {
    id: 'heavy',
    label: 'Ça pèse',
    symbol: '🪨',
    category: 'impact',
    meanings: [
      'poids',
      'pierre',
      'lenteur',
      'profondeur',
    ],
  },
  {
    id: 'burn',
    label: 'Ça brûle',
    symbol: '🔥',
    category: 'impact',
    meanings: [
      'feu',
      'chaleur',
      'intensité',
      'braise',
    ],
  },
  {
    id: 'overflow',
    label: 'Ça déborde',
    symbol: '🌊',
    category: 'impact',
    meanings: [
      'vague',
      'courant',
      'débordement',
      'ampleur',
    ],
  },
  {
    id: 'shake',
    label: 'Ça secoue',
    symbol: '⚡',
    category: 'impact',
    meanings: [
      'orage',
      'frisson',
      'mouvement',
      'instabilité',
    ],
  },

  // Effets mentaux

  {
    id: 'loop',
    label: 'Ça tourne',
    symbol: '🌀',
    category: 'mental',
    meanings: [
      'boucle',
      'spirale',
      'retour',
      'répétition',
    ],
  },
  {
    id: 'blur',
    label: 'Ça embrouille',
    symbol: '🌫️',
    category: 'mental',
    meanings: [
      'brume',
      'flou',
      'hésitation',
      'contours',
    ],
  },
  {
    id: 'block',
    label: 'Ça bloque',
    symbol: '🚧',
    category: 'mental',
    meanings: [
      'obstacle',
      'fermeture',
      'seuil',
      'immobilité',
    ],
  },
  {
    id: 'darken',
    label: 'Ça assombrit',
    symbol: '🌧️',
    category: 'mental',
    meanings: [
      'nuit',
      'ombre',
      'pluie',
      'retrait',
    ],
  },

  // Mouvements et tensions

  {
    id: 'change',
    label: 'Ça appelle un changement',
    symbol: '🌱',
    category: 'movement',
    meanings: [
      'graine',
      'pousse',
      'commencement',
      'passage',
    ],
  },
  {
    id: 'hurt',
    label: 'Ça fait mal',
    symbol: '💔',
    category: 'movement',
    meanings: [
      'fêlure',
      'fragilité',
      'cicatrice',
      'tendresse',
    ],
  },
  {
    id: 'doubt',
    label: 'Ça fait douter',
    symbol: '❓',
    category: 'movement',
    meanings: [
      'question',
      'hésitation',
      'carrefour',
      'incertitude',
    ],
  },
  {
    id: 'breathe',
    label: 'Ça cherche de l’air',
    symbol: '🫧',
    category: 'movement',
    meanings: [
      'souffle',
      'espace',
      'ouverture',
      'légèreté',
    ],
  },
]

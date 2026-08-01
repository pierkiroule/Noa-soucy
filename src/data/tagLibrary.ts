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
    id: 'freeze',
    label: 'Ça fige',
    symbol: '🧊',
    category: 'impact',
    meanings: [
      'gel',
      'arrêt',
      'suspension',
      'immobilité',
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
    id: 'invade',
    label: 'Ça envahit',
    symbol: '🌪️',
    category: 'mental',
    meanings: [
      'tourbillon',
      'occupation',
      'bruit',
      'ampleur',
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
    id: 'isolate',
    label: 'Ça isole',
    symbol: '🌙',
    category: 'movement',
    meanings: [
      'distance',
      'nuit',
      'île',
      'silence',
    ],
  },
  {
    id: 'last',
    label: 'Ça dure',
    symbol: '⏳',
    category: 'movement',
    meanings: [
      'temps',
      'attente',
      'saison',
      'patience',
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

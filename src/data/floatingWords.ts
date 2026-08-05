export type FloatingWordId =
  | 'observer'
  | 'respirer'
  | 'attendre'
  | 'oser'
  | 'sadapter'
  | 'sancrer'
  | 'relier'
  | 'grandir'
  | 'rebondir'
  | 'avancer'
  | 'accueillir'
  | 'choisir'
  | 'faire-confiance'
  | 'prendre-soin'
  | 'garder-le-cap'

export interface FloatingWordDefinition {
  id: FloatingWordId
  label: string
}

export const floatingWords: FloatingWordDefinition[] = [
  { id: 'observer', label: 'Observer' },
  { id: 'respirer', label: 'Respirer' },
  { id: 'attendre', label: 'Attendre' },
  { id: 'oser', label: 'Oser' },
  { id: 'sadapter', label: 'S’adapter' },
  { id: 'sancrer', label: 'S’ancrer' },
  { id: 'relier', label: 'Relier' },
  { id: 'grandir', label: 'Grandir' },
  { id: 'rebondir', label: 'Rebondir' },
  { id: 'avancer', label: 'Avancer' },
  { id: 'accueillir', label: 'Accueillir' },
  { id: 'choisir', label: 'Choisir' },
  { id: 'faire-confiance', label: 'Faire confiance' },
  { id: 'prendre-soin', label: 'Prendre soin' },
  { id: 'garder-le-cap', label: 'Garder le cap' },
]

export const DEFAULT_VISIBLE_WORD_COUNT = 9

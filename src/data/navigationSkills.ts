export type NavigationSkill =
  | 'observe'
  | 'adapt'
  | 'dare'
  | 'breathe'
  | 'anchor'
  | 'connect'
  | 'bounce'
  | 'course'

export const navigationSkills = {
  observe: { id: 'observe', label: 'Observer', shortLabel: 'Observer', resultText: 'Vous savez ralentir et regarder avant d’agir.' },
  adapt: { id: 'adapt', label: 'S’adapter', shortLabel: 'Adapter', resultText: 'Vous savez modifier votre manière d’avancer lorsque le vent change.' },
  dare: { id: 'dare', label: 'Oser', shortLabel: 'Oser', resultText: 'Vous savez parfois faire un premier pas sans tout connaître de la route.' },
  breathe: { id: 'breathe', label: 'Respirer', shortLabel: 'Respirer', resultText: 'Vous savez créer un peu d’espace lorsque tout devient trop dense.' },
  anchor: { id: 'anchor', label: 'S’ancrer', shortLabel: 'Ancrer', resultText: 'Vous connaissez certains appuis qui vous aident à retrouver de la stabilité.' },
  connect: { id: 'connect', label: 'Relier', shortLabel: 'Relier', resultText: 'Vous savez vous appuyer sur les liens et ne pas tout traverser seul.' },
  bounce: { id: 'bounce', label: 'Rebondir', shortLabel: 'Rebondir', resultText: 'Vous savez peu à peu retrouver un mouvement après une difficulté.' },
  course: { id: 'course', label: 'Garder le cap', shortLabel: 'Cap', resultText: 'Vous savez rester relié à ce qui compte pour vous, même dans le brouillard.' }
} as const

export const navigationSkillIds = Object.keys(navigationSkills) as NavigationSkill[]
export type NavigationSkillId = NavigationSkill

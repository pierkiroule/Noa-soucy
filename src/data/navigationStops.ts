import type { NavigationSkill } from './navigationSkills.ts'

export interface NavigationStopOption { skillId: NavigationSkill; label: string }
export interface NavigationStop { id: string; title: string; prompt: string; options: NavigationStopOption[] }

export const navigationStops = [
  { id: 'fog', title: 'Quand la brume descend', prompt: 'Le rivage s’efface. La mer devient plus silencieuse. Quel geste vous vient en premier ?', options: [{ skillId: 'observe', label: 'Observer' }, { skillId: 'breathe', label: 'Respirer' }, { skillId: 'connect', label: 'Relier' }] },
  { id: 'changing-wind', title: 'Quand le vent change', prompt: 'La direction n’est plus la même. Que faites-vous naturellement ?', options: [{ skillId: 'adapt', label: 'M’adapter' }, { skillId: 'anchor', label: 'M’ancrer' }, { skillId: 'course', label: 'Garder le cap' }] },
  { id: 'first-move', title: 'Quand il faut commencer', prompt: 'La route n’est pas claire, mais quelque chose invite à avancer.', options: [{ skillId: 'dare', label: 'Oser' }, { skillId: 'observe', label: 'Observer' }, { skillId: 'breathe', label: 'Respirer' }] },
  { id: 'fatigue', title: 'Quand la fatigue arrive', prompt: 'Le voyage pèse davantage. Qu’est-ce qui vous soutient le mieux ?', options: [{ skillId: 'breathe', label: 'Respirer' }, { skillId: 'connect', label: 'Relier' }, { skillId: 'anchor', label: 'M’ancrer' }] },
  { id: 'rough-sea', title: 'Quand la mer remue', prompt: 'Tout devient plus instable. Quel mouvement vous ressemble le plus ?', options: [{ skillId: 'anchor', label: 'M’ancrer' }, { skillId: 'adapt', label: 'M’adapter' }, { skillId: 'course', label: 'Garder le cap' }] },
  { id: 'crew', title: 'Quand on ne peut pas tout faire seul', prompt: 'La traversée devient trop vaste pour une seule embarcation.', options: [{ skillId: 'connect', label: 'Relier' }, { skillId: 'breathe', label: 'Respirer' }, { skillId: 'bounce', label: 'Rebondir' }] },
  { id: 'after-storm', title: 'Après la tempête', prompt: 'Le calme revient. Quel élan apparaît en premier ?', options: [{ skillId: 'bounce', label: 'Rebondir' }, { skillId: 'observe', label: 'Observer' }, { skillId: 'dare', label: 'Oser' }] },
  { id: 'hidden-horizon', title: 'Quand l’horizon reste invisible', prompt: 'La route continue, mais le rivage ne se montre pas encore.', options: [{ skillId: 'course', label: 'Garder le cap' }, { skillId: 'adapt', label: 'M’adapter' }, { skillId: 'connect', label: 'Relier' }] }
] as const satisfies readonly NavigationStop[]

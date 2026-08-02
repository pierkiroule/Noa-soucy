import type { NavigationStyleId } from '../types'
export interface NavigationStyle { id: NavigationStyleId; title: string; symbol: string; narrative: string }
export const navigationStyles: NavigationStyle[] = [
 ['follow-current','Suivre le courant','≈','Nao suit le courant, attentive à ses inflexions.'],['adjust-sail','Ajuster la voile','△','Nao ajuste la voile sans brusquer le vent.'],['seek-shelter','Chercher un abri','⌂','Nao longe les eaux calmes à la recherche d’un abri.'],['navigate-slowly','Naviguer lentement','·','Nao avance lentement, à la mesure de l’eau.'],['hold-course','Garder le cap','↑','Nao garde son cap au milieu des mouvements.'],['explore-detour','Explorer un détour','↝','Nao accueille un détour et découvre un autre passage.']
].map(([id,title,symbol,narrative]) => ({id:id as NavigationStyleId,title,symbol,narrative}))

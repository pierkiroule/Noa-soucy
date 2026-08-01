import type { LandscapeId } from '../types'
export interface Landscape { id: LandscapeId; title: string; symbol: string; description: string; narrative: { texture: string }; visual: { palette: string }; sound: { ambience: string } }
export const landscapes: Landscape[] = [
  ['mist','Brume','◌','L’horizon se tient tout près.','voilée','bleu brume','souffle mat'],
  ['swell','Houle','∿','Le paysage monte et descend.','ample','gris mer','vagues lentes'],
  ['storm','Tempête','≋','Les éléments occupent tout l’espace.','vive','bleu nuit','rafales'],
  ['night','Nuit','●','Les contours se découvrent autrement.','sombre','indigo','eau nocturne'],
  ['counter-current','Courant contraire','⇠','L’eau résiste au mouvement.','dense','acier','courant profond'],
  ['uncertain-clearing','Éclaircie incertaine','◐','Une lumière passe sans se fixer.','changeante','ambre pâle','accalmie'],
].map(([id,title,symbol,description,texture,palette,ambience]) => ({ id:id as LandscapeId,title,symbol,description,narrative:{texture},visual:{palette},sound:{ambience} }))

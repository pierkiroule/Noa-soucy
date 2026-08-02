export type SceneId = 'drift' | 'growth' | 'navigation'
export type OceanChoice = 'Brume' | 'Houle' | 'Courant contraire' | 'Nuit' | 'Tempête' | 'Mer immobile' | 'Rien pour l’instant'
export type ResourceChoice = 'Une présence' | 'Une parole' | 'Un souvenir' | 'Une idée' | 'Une valeur' | 'Une limite' | 'Un appui' | 'Rien pour l’instant'
export type VisualMood = { mist:number; waves:number; darkness:number; current:number; warmth:number; roots:number }
export interface SceneConfig { id:SceneId; title:string; media:string; durationMs:number; narration:string; palette:[string,string,string]; audio?:{ ambience?:string; music?:string; narration?:string }; effects:string[] }
export interface StoryProgress { step:number; ocean?:OceanChoice; resource?:ResourceChoice }

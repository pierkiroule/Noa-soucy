export type ResonanceSeedId = 'links' | 'supports' | 'clearings' | 'impulses' | 'possibles'

export interface ResonanceSeedDefinition { id:ResonanceSeedId; title:string; subtitle:string }
export interface ResonanceNode { id:string; seedId:ResonanceSeedId; label:string; parentId:string|null; createdAt:string }
export interface ResonancePlantation { seedId:ResonanceSeedId; plantedAt:string; nodes:ResonanceNode[] }
export interface ResonanceGardenState { plantations:Partial<Record<ResonanceSeedId, ResonancePlantation>> }
export type PlantGrowthStage = 'seed'|'sprout'|'stem'|'leaves'|'bud'|'flower'

export type LandscapeId = 'mist' | 'swell' | 'storm' | 'night' | 'counter-current' | 'uncertain-clearing'
export type ResourceId = 'direction' | 'light' | 'connection' | 'lightness' | 'beginning' | 'courage' | 'presence' | 'landmark' | 'breath' | 'support' | 'gentleness' | 'rhythm'
export type NavigationStyleId = 'follow-current' | 'adjust-sail' | 'seek-shelter' | 'navigate-slowly' | 'hold-course' | 'explore-detour'
export type MovementId = 'opening' | 'embarkation' | 'departure' | 'landscape' | 'first-resource' | 'deepening' | 'passage' | 'second-resource' | 'navigation' | 'shift' | 'horizon' | 'provisional-shore'
export type SceneMedium = 'text' | 'audio' | 'video' | 'svg' | 'three'

export interface JourneyScene {
  id: string
  movement: MovementId
  durationMs: number
  conditions?: { landscapes?: LandscapeId[]; resources?: ResourceId[]; navigationStyles?: NavigationStyleId[] }
  text: { variants: string[] }
  audio?: { ambience?: string; narration?: string; music?: string }
  video?: { src?: string; overlay?: string }
  three?: { sceneId?: string; parameters?: Record<string, number | string | boolean> }
  transition?: { type: 'fade' | 'dissolve' | 'drift'; durationMs: number }
  weight?: number
}
export interface JourneyPartition { id: string; title: string; durationMs: number; movements: { movement: MovementId; durationMs: number; required: boolean }[] }
export interface JourneyChoices { landscape: LandscapeId; resources: ResourceId[]; navigationStyle: NavigationStyleId }
export interface ComposedScene extends JourneyScene { renderedText: string; durationMs: number }
export interface ComposedJourney { id: string; partitionId: string; choices: JourneyChoices; scenes: ComposedScene[] }
export interface SavedJourney { id: string; createdAt: string; partitionId: string; landscape: LandscapeId; resources: ResourceId[]; navigationStyle: NavigationStyleId; sceneIds: string[]; renderedTexts: string[] }

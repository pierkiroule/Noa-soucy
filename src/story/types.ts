export type StoryStepType = 'scene' | 'pause' | 'ending'
export type SceneId = 'drift' | 'growth' | 'navigation'
export type PauseId = 'ocean-resonance' | 'resource-resonance'
export type MediaKind = 'video' | 'audio' | 'three' | 'placeholder'
export type TransitionId = 'fade' | 'ink-wash' | 'paper-dissolve'
export type VisualEffectId = 'blue-wash' | 'storm-wash' | 'mist' | 'debris' | 'earth' | 'seed' | 'roots' | 'stem' | 'flower' | 'wind-lines' | 'horizon-light' | 'forward-motion'
export type ParameterValue = number | string | boolean

export interface EffectCue { id:string; start:number; duration:number; effect:VisualEffectId; intensity?:number; params?:Record<string,ParameterValue> }
export interface ActiveEffect extends EffectCue { progress:number; effectiveIntensity:number }
export interface SceneMedia { video?:string; audio?:string; poster?:string; fallbackSceneId:SceneId }
export interface StoryScene { type:'scene'; id:SceneId; title:string; duration:number; text:string; media:SceneMedia; effects:EffectCue[]; transitionIn:TransitionId; transitionOut:TransitionId }
export interface ProjectiveOption { id:string; label:string; params:Record<string,ParameterValue> }
export interface StoryPause { type:'pause'; id:PauseId; title:string; question:string; helperText?:string; maxChoices:number; options:ProjectiveOption[]; allowSkip:boolean }
export interface StoryEnding { type:'ending'; id:string; title:string; text:string }
export type StoryStep = StoryScene | StoryPause | StoryEnding
export interface StoryDefinition { id:string; title:string; subtitle:string; steps:StoryStep[] }
export interface StoryResponses { [pauseId:string]:string[] }
export interface StoryVisualParameters { fogDensity?:number; waveIntensity?:number; darkness?:number; horizontalDrift?:number; lightIntensity?:number; growthSpeed?:number; stability?:number; windIntensity?:number }
export interface ResolvedSceneMedia { kind:'video'|'placeholder'; source?:string; fallbackSceneId:SceneId; warning?:string }
export interface StoryRuntimeState { storyId:string; currentStepIndex:number; currentSceneTime:number; isPlaying:boolean; isPaused:boolean; responses:StoryResponses; parameters:StoryVisualParameters; progress:number; media?:ResolvedSceneMedia; error?:string; started:boolean; completed:boolean }

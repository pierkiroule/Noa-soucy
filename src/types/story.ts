export type NarratorType = 'sailor' | 'inner-voice'

export interface MediaConfig {
  video?: string | null
  voice?: string | null
  music?: string | null
  ambience?: string | null
  poster?: string | null
}

export interface ActModule {
  id: string
  title: string
  text: string
  narrator: 'sailor'
  media?: MediaConfig
}

export interface ChoiceOption {
  id: string
  label: string
  description?: string
  resonanceId: string
}

export interface ChoiceModule {
  id: string
  question: string
  helperText?: string
  options: ChoiceOption[]
  maxChoices: 1
  allowSkip?: boolean
}

export interface ResonanceThreeConfig {
  sceneId: string
  audioReactive: boolean
  palette?: string
  intensity?: number
  parameters?: Record<string, number | string | boolean>
}

export interface ResonanceModule {
  id: string
  title?: string
  text: string
  narrator: 'inner-voice'
  sourceChoiceId: string
  sourceOptionId: string
  media?: Pick<MediaConfig, 'voice' | 'ambience'>
  three?: ResonanceThreeConfig
}

export interface EndingModule {
  id: string
  title: string
  text: string
  narrator: 'sailor'
  media?: MediaConfig
}

export type StoryboardBlock =
  | { type: 'act'; module: string }
  | { type: 'choice'; module: string }
  | { type: 'resonance'; fromChoice: string }
  | { type: 'ending'; module: string }

export interface StoryMetadata { id: string; title: string; subtitle: string; version: number }
export interface StoryDefinition {
  metadata: StoryMetadata
  acts: Record<string, ActModule>
  choices: Record<string, ChoiceModule>
  resonances: Record<string, ResonanceModule>
  endings: Record<string, EndingModule>
  storyboard: StoryboardBlock[]
}
export interface StoryResponses { [choiceId: string]: string[] }
export interface StoryRuntimeState { currentBlockIndex: number; responses: StoryResponses; completed: boolean }

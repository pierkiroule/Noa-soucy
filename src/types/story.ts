export type StoryBlockType = 'act' | 'choice' | 'pause' | 'ending'

export interface MediaConfig { voice?: string; music?: string; ambience?: string; video?: string; threeSceneId?: string }
export interface StoryMetadata { id: string; title: string; subtitle: string; version: number }
export interface ActVariantCondition { choiceId: string; includes: string[] }
export interface TextActVariant { id: string; title?: string; text: string; when?: ActVariantCondition; isDefault?: boolean; media?: MediaConfig }
export interface TextActModule { id: string; title: string; text?: string; variants?: TextActVariant[]; media?: MediaConfig }
export interface ChoiceOption { id: string; label: string; description?: string }
export interface ChoiceModule { id: string; question: string; helperText?: string; options: ChoiceOption[]; maxChoices: 1; allowSkip?: boolean }
export interface PauseModule { id: string; title?: string; text?: string }
export interface EndingModule { id: string; title: string; text: string }
export type StoryboardBlock =
  | { type: 'act'; module: string }
  | { type: 'choice'; module: string }
  | { type: 'pause'; module: string }
  | { type: 'ending'; module: string }
export interface StoryDefinition { metadata: StoryMetadata; acts: Record<string, TextActModule>; choices: Record<string, ChoiceModule>; pauses?: Record<string, PauseModule>; endings: Record<string, EndingModule>; storyboard: StoryboardBlock[] }
export interface StoryResponses { [choiceId: string]: string[] }
export interface StoryRuntimeState { currentBlockIndex: number; responses: StoryResponses; completed: boolean }

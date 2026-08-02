import type { StoryDefinition, StoryRuntimeState } from '../types/story'
const KEY = 'nao-souci:story-state'
interface Stored { storyId: string; version: number; currentBlockIndex: number; responses: StoryRuntimeState['responses']; completed: boolean; updatedAt: string }
export function saveStoryState(story: StoryDefinition, state: StoryRuntimeState): void {
  const value: Stored = { storyId: story.metadata.id, version: story.metadata.version, ...state, updatedAt: new Date().toISOString() }
  localStorage.setItem(KEY, JSON.stringify(value))
}
export function loadStoryState(story: StoryDefinition): StoryRuntimeState | null {
  try {
    const value = JSON.parse(localStorage.getItem(KEY) ?? 'null') as Stored | null
    if (!value || value.storyId !== story.metadata.id || value.version !== story.metadata.version || value.currentBlockIndex < 0 || value.currentBlockIndex >= story.storyboard.length) return null
    return { currentBlockIndex: value.currentBlockIndex, responses: value.responses ?? {}, completed: Boolean(value.completed) }
  } catch { return null }
}
export const clearStoryState = (): void => localStorage.removeItem(KEY)

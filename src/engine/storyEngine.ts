import { selectActVariant } from './choiceResolver.ts'
import type { StoryDefinition, StoryResponses, StoryRuntimeState, StoryboardBlock, TextActModule } from '../types/story'

export const getCurrentBlock = (story: StoryDefinition, state: StoryRuntimeState): StoryboardBlock | null => story.storyboard[state.currentBlockIndex] ?? null
export function resolveActContent(act: TextActModule, responses: StoryResponses) {
  const variant = selectActVariant(act, responses)
  return { title: variant?.title ?? act.title, text: variant?.text ?? act.text ?? '', ...(variant && { variantId: variant.id }) }
}
export function goToNextBlock(story: StoryDefinition, state: StoryRuntimeState): StoryRuntimeState {
  const last = Math.max(0, story.storyboard.length - 1)
  const next = Math.min(state.currentBlockIndex + 1, last)
  return { ...state, currentBlockIndex: next, completed: next === last && story.storyboard[next]?.type === 'ending' }
}
export const goToPreviousBlock = (state: StoryRuntimeState): StoryRuntimeState => ({ ...state, currentBlockIndex: Math.max(0, state.currentBlockIndex - 1), completed: false })
export const recordChoice = (state: StoryRuntimeState, choiceId: string, selectedOptionIds: string[]): StoryRuntimeState => ({ ...state, responses: { ...state.responses, [choiceId]: selectedOptionIds.slice(0, 1) } })
export const restartStory = (): StoryRuntimeState => ({ currentBlockIndex: 0, responses: {}, completed: false })

import type { ResonanceModule, StoryDefinition, StoryResponses, StoryRuntimeState, StoryboardBlock } from '../types/story'

export const getCurrentBlock = (story: StoryDefinition, state: StoryRuntimeState): StoryboardBlock | null => story.storyboard[state.currentBlockIndex] ?? null
export const resolveActContent = (act: StoryDefinition['acts'][string]) => ({ title: act.title, text: act.text })

export function resolveResonance(story: StoryDefinition, responses: StoryResponses, choiceId: string): ResonanceModule | null {
  const selectedId = responses[choiceId]?.[0]
  const option = story.choices[choiceId]?.options.find(({ id }) => id === selectedId)
  return option ? story.resonances[option.resonanceId] ?? null : null
}

export function goToNextBlock(story: StoryDefinition, state: StoryRuntimeState): StoryRuntimeState {
  let next = Math.min(state.currentBlockIndex + 1, Math.max(0, story.storyboard.length - 1))
  while (story.storyboard[next]?.type === 'resonance') {
    const resonanceBlock = story.storyboard[next]
    if (resonanceBlock.type !== 'resonance' || resolveResonance(story, state.responses, resonanceBlock.fromChoice)) break
    next++
  }
  const last = Math.max(0, story.storyboard.length - 1)
  next = Math.min(next, last)
  return { ...state, currentBlockIndex: next, completed: next === last && story.storyboard[next]?.type === 'ending' }
}

export const goToPreviousBlock = (state: StoryRuntimeState): StoryRuntimeState => ({ ...state, currentBlockIndex: Math.max(0, state.currentBlockIndex - 1), completed: false })
export const recordChoice = (state: StoryRuntimeState, choiceId: string, selectedOptionIds: string[]): StoryRuntimeState => ({ ...state, responses: { ...state.responses, [choiceId]: selectedOptionIds.slice(0, 1) } })
export const restartStory = (): StoryRuntimeState => ({ currentBlockIndex: 0, responses: {}, completed: false })

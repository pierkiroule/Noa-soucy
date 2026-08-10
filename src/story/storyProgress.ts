export const STORY_PROGRESS_VERSION = 4

export interface StoryProgress {
  version: number
  currentBlockIndex: number
  currentBreathIndex: number
  isMuted: boolean
  selectedChoices: Record<string, string>
  activeResonanceId?: string
  completed: boolean
}

export const initialStoryProgress: StoryProgress = {
  version: STORY_PROGRESS_VERSION,
  currentBlockIndex: 0,
  currentBreathIndex: 0,
  isMuted: false,
  selectedChoices: {},
  completed: false,
}

const isSafeIndex = (value: unknown): value is number => Number.isSafeInteger(value) && (value as number) >= 0

export function parseStoryProgress(serialized: string | null): StoryProgress {
  try {
    const saved = JSON.parse(serialized ?? 'null') as Record<string, unknown> | null
    if (!saved || typeof saved !== 'object' || saved.version !== STORY_PROGRESS_VERSION) return initialStoryProgress

    const selectedChoices = Object.fromEntries(Object.entries(saved.selectedChoices && typeof saved.selectedChoices === 'object' && !Array.isArray(saved.selectedChoices) ? saved.selectedChoices : {})
      .filter((entry): entry is [string, string] => typeof entry[1] === 'string'))

    return {
      version: STORY_PROGRESS_VERSION,
      currentBlockIndex: isSafeIndex(saved.currentBlockIndex) ? saved.currentBlockIndex : 0,
      currentBreathIndex: isSafeIndex(saved.currentBreathIndex) ? saved.currentBreathIndex : 0,
      isMuted: saved.isMuted === true,
      selectedChoices,
      ...(typeof saved.activeResonanceId === 'string' ? { activeResonanceId: saved.activeResonanceId } : {}),
      completed: saved.completed === true,
    }
  } catch {
    return initialStoryProgress
  }
}

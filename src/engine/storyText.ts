export const BREATH_FADE_IN_MS = 700
export const BREATH_FADE_OUT_MS = 700
export const BREATH_GAP_MS = 250

export function splitTextIntoBreaths(text: string): string[] {
  return text
    .split(/\||\r?\n+/)
    .map(part => part.trim())
    .filter(Boolean)
}

export function getBreathHoldDuration(text: string): number {
  const wordCount = text.trim().split(/\s+/).filter(Boolean).length
  return Math.min(7000, Math.max(2600, 2200 + wordCount * 320))
}

export function getBreathCycleDuration(text: string): number {
  return BREATH_FADE_IN_MS + getBreathHoldDuration(text) + BREATH_FADE_OUT_MS + BREATH_GAP_MS
}

/** Approximate French narration speed, used only while audio metadata is unavailable. */
export const NARRATION_CHARACTERS_PER_SECOND = 12.5

/**
 * Selects the best available duration for the scroll clock. A duration recorded
 * with the story is deterministic, native audio metadata is the next best
 * source, and text length keeps the feature working while metadata is loading.
 */
export function narrationDuration(configuredDuration: number | undefined, audioDuration: number | undefined, characterCount: number) {
  if (configuredDuration && Number.isFinite(configuredDuration) && configuredDuration > 0) return configuredDuration
  if (audioDuration && Number.isFinite(audioDuration) && audioDuration > 0) return audioDuration
  return Number.isFinite(characterCount) && characterCount > 0 ? characterCount / NARRATION_CHARACTERS_PER_SECOND : 0
}

/** Maps narration time onto the useful reading window. */
export function narrationScrollProgress(currentTime: number, duration: number) {
  if (!Number.isFinite(currentTime) || !Number.isFinite(duration) || duration <= 0) return 0
  const elapsedProgress = Math.max(0, Math.min(1, currentTime / duration))
  const leadIn = 0.04
  const tail = 0.08
  return Math.max(0, Math.min(1, (elapsedProgress - leadIn) / (1 - leadIn - tail)))
}

/** Smoothly converges on the narration target in either direction. */
export function nextAutoScrollTop(current: number, target: number, elapsed: number) {
  if (!Number.isFinite(current) || !Number.isFinite(target)) return current
  const safeElapsed = Math.max(0, Math.min(64, elapsed))
  const easing = 1 - Math.exp(-safeElapsed / 420)
  return current + (target - current) * easing
}

/** Approximate French narration speed, including spaces and punctuation. */
export const NARRATION_CHARACTERS_PER_SECOND = 12.5

/**
 * Estimates reading progress from elapsed time and text length. This deliberately
 * avoids HTMLAudioElement.duration, which is unreliable for progressively loaded
 * MP3 files on some mobile browsers.
 */
export function narrationScrollProgress(currentTime: number, characterCount: number) {
  if (!Number.isFinite(currentTime) || !Number.isFinite(characterCount) || characterCount <= 0) return 0
  const estimatedDuration = characterCount / NARRATION_CHARACTERS_PER_SECOND
  const elapsedProgress = Math.max(0, Math.min(1, currentTime / estimatedDuration))
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

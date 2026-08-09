/**
 * Maps narration time to reading-surface progress.
 *
 * A short lead-in keeps the opening still while the listener settles in, and a
 * short tail makes the last lines arrive before the voice ends. Between those
 * anchors the mapping stays linear: it is predictable even without word-level
 * timestamps and naturally adapts to every recording duration.
 */
export function narrationScrollProgress(currentTime: number, duration: number) {
  if (!Number.isFinite(currentTime) || !Number.isFinite(duration) || duration <= 0) return 0
  const audioProgress = Math.max(0, Math.min(1, currentTime / duration))
  const leadIn = 0.04
  const tail = 0.08
  return Math.max(0, Math.min(1, (audioProgress - leadIn) / (1 - leadIn - tail)))
}

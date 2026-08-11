export function isStoryRoute(pathname: string): boolean {
  return pathname === '/n' || pathname === '/n/'
}

export const NUT_ID_PATTERN = /^[A-Za-z0-9_-]{4,40}$/

export type NaoTravelRoute =
  | { kind: 'journey', nutId: string }
  | { kind: 'passers', nutId: string }
  | { kind: 'invalid' }
  | { kind: 'none' }

export function parseNaoTravelRoute(pathname: string): NaoTravelRoute {
  const parts = pathname.split('/').filter(Boolean)
  if (parts[0] !== 'n' || parts.length < 2) return { kind: 'none' }
  const nutId = decodeURIComponentSafe(parts[1])
  if (!NUT_ID_PATTERN.test(nutId)) return { kind: 'invalid' }
  if (parts.length === 2) return { kind: 'journey', nutId }
  if (parts.length === 3 && parts[2] === 'passers') return { kind: 'passers', nutId }
  return { kind: 'invalid' }
}

function decodeURIComponentSafe(value: string): string {
  try { return decodeURIComponent(value) }
  catch { return '' }
}

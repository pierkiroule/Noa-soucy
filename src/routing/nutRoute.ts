export function readNutToken(pathname: string): string | null {
  const match = pathname.match(/^\/n\/([^/]+)\/?$/)
  if (!match) return null
  try {
    const token = decodeURIComponent(match[1])
    return /^[A-Za-z0-9_-]{6,128}$/.test(token) ? token : null
  } catch { return null }
}

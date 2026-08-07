import type { NutSession } from '../types/nutAccess.ts'

const PREFIX = 'nao-nut-session:'

export function getNutSession(nutToken: string): NutSession | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(`${PREFIX}${nutToken}`) ?? 'null')
    if (!value || typeof value !== 'object') return null
    const session = value as Partial<NutSession>
    return session.nutToken === nutToken && typeof session.deviceId === 'string' && typeof session.sessionToken === 'string'
      ? session as NutSession
      : null
  } catch { return null }
}

export function saveNutSession(session: NutSession): void {
  localStorage.setItem(`${PREFIX}${session.nutToken}`, JSON.stringify(session))
}

export function removeNutSession(nutToken: string): void {
  localStorage.removeItem(`${PREFIX}${nutToken}`)
}

export function clearAllNutSessions(): void {
  for (let index = localStorage.length - 1; index >= 0; index -= 1) {
    const key = localStorage.key(index)
    if (key?.startsWith(PREFIX)) localStorage.removeItem(key)
  }
}

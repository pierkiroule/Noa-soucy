import type { NutAccessService } from './nutAccessService.ts'
import type { NutAccessStatus } from '../types/nutAccess.ts'

type Invoke = (name: string, options: { body: unknown }) => Promise<{ data: unknown; error: Error | null }>

export function assertNutAccessStatus(value: unknown): NutAccessStatus {
  if (value === 'free' || value === 'mine' || value === 'locked') return value
  throw new Error('Invalid nut access status')
}

export function createSupabaseNutAccessService(invokeFunction: Invoke): NutAccessService {
  const invoke = async (action: 'status' | 'associate' | 'dissociate', nutToken: string, deviceId: string) => {
    const { data, error } = await invokeFunction('nut-access', { body: { action, nutToken, deviceId } })
    if (error) throw error
    return assertNutAccessStatus((data as { status?: unknown } | null)?.status)
  }
  return {
    getStatus: (nutToken, deviceId) => invoke('status', nutToken, deviceId),
    associate: (nutToken, deviceId) => invoke('associate', nutToken, deviceId),
    dissociate: (nutToken, deviceId) => invoke('dissociate', nutToken, deviceId),
  }
}

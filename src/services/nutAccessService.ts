import type { NutAccessStatus } from '../types/nutAccess.ts'
import { mockNutAccessService } from './mockNutAccessService.ts'
import { shouldUseMockNutAccess } from './nutAccessMode.ts'

export interface NutAccessService {
  getStatus(nutToken: string, deviceId: string): Promise<NutAccessStatus>
  associate(nutToken: string, deviceId: string): Promise<NutAccessStatus>
  dissociate(nutToken: string, deviceId: string): Promise<NutAccessStatus>
}

// En développement, l'absence de .env.local conserve la simulation NFC utilisable.
// Une valeur explicite à false permet toujours de tester Supabase localement.
const useMock = shouldUseMockNutAccess(
  import.meta.env?.VITE_USE_MOCK_NUT_ACCESS,
  import.meta.env?.DEV ?? false,
)
export const nutAccessMode = useMock ? 'mock' : 'supabase'
let remoteService: Promise<NutAccessService> | undefined
const getService = () => {
  if (useMock) return Promise.resolve(mockNutAccessService)
  remoteService ??= import('./supabaseNutAccessService').then(module => module.supabaseNutAccessService)
  return remoteService
}

export const nutAccessService: NutAccessService = {
  async getStatus(nutToken, deviceId) { return (await getService()).getStatus(nutToken, deviceId) },
  async associate(nutToken, deviceId) { return (await getService()).associate(nutToken, deviceId) },
  async dissociate(nutToken, deviceId) { return (await getService()).dissociate(nutToken, deviceId) },
}

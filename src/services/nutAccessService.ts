import type { NutAccessStatus } from '../types/nutAccess.ts'
import { mockNutAccessService } from './mockNutAccessService.ts'

export interface NutAccessService {
  getStatus(nutToken: string, deviceId: string): Promise<NutAccessStatus>
  associate(nutToken: string, deviceId: string): Promise<NutAccessStatus>
  dissociate(nutToken: string, deviceId: string): Promise<NutAccessStatus>
}

const useMock = import.meta.env?.VITE_USE_MOCK_NUT_ACCESS === 'true'
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

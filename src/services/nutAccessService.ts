import type { NutAccessStatus, NutSession } from '../types/nutAccess.ts'
import { mockNutAccessService } from './mockNutAccessService.ts'

export interface NutAccessService {
  getStatus(nutToken: string): Promise<NutAccessStatus>
  associate(nutToken: string): Promise<NutSession>
  verify(nutToken: string): Promise<boolean>
  dissociate(nutToken: string): Promise<void>
}

// Point d'échange unique : une future implémentation Supabase remplacera ce mock.
export const nutAccessService: NutAccessService = mockNutAccessService

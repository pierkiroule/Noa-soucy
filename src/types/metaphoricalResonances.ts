import type { ResonancePetalId } from '../data/metaphoricalResonances'

export interface ResonanceAnswer {
  petalId: ResonancePetalId
  text: string
  visited: boolean
  updatedAt: string
}

export interface MetaphoricalResonanceState {
  opened: boolean
  activePetalId: ResonancePetalId | null
  answers: Partial<Record<ResonancePetalId, ResonanceAnswer>>
  completed: boolean
}

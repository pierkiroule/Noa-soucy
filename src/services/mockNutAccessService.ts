import type { NutAccessService } from './nutAccessService.ts'
import type { NutAccessStatus } from '../types/nutAccess.ts'
import { getOrCreateDeviceId } from './deviceIdentity.ts'

const MOCK_KEY = 'nao-mock-nuts'
export type MockNutRecord = { nutToken: string; associatedDeviceId: string | null }

function readRecords(): MockNutRecord[] {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(MOCK_KEY) ?? '[]')
    return Array.isArray(value) ? value.filter((item): item is MockNutRecord => Boolean(item) && typeof item.nutToken === 'string' && (item.associatedDeviceId === null || typeof item.associatedDeviceId === 'string')) : []
  } catch { return [] }
}

function writeRecords(records: MockNutRecord[]) { localStorage.setItem(MOCK_KEY, JSON.stringify(records)) }
function recordFor(nutToken: string) { return readRecords().find(record => record.nutToken === nutToken) }
function setDevice(nutToken: string, associatedDeviceId: string | null) {
  const records = readRecords().filter(record => record.nutToken !== nutToken)
  writeRecords([...records, { nutToken, associatedDeviceId }])
}

export const mockNutAccessService: NutAccessService = {
  async getStatus(nutToken, deviceId): Promise<NutAccessStatus> {
    const associated = recordFor(nutToken)?.associatedDeviceId ?? null
    if (!associated) return 'free'
    return associated === deviceId ? 'mine' : 'locked'
  },
  async associate(nutToken, deviceId): Promise<NutAccessStatus> {
    const record = recordFor(nutToken)
    if (record?.associatedDeviceId && record.associatedDeviceId !== deviceId) throw new Error('Nut unavailable')
    setDevice(nutToken, deviceId)
    return 'mine'
  },
  async dissociate(nutToken, deviceId) {
    if (recordFor(nutToken)?.associatedDeviceId === deviceId) setDevice(nutToken, null)
    return 'free'
  },
}

export function setMockNutState(nutToken: string, state: 'free' | 'mine' | 'locked') {
  setDevice(nutToken, state === 'free' ? null : state === 'mine' ? getOrCreateDeviceId() : `other-${crypto.randomUUID()}`)
}

export function resetMockNuts() { localStorage.removeItem(MOCK_KEY) }

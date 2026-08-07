import { getOrCreateDeviceId } from './deviceIdentity.ts'
import type { NutAccessService } from './nutAccessService.ts'
import type { NutAccessStatus, NutSession } from '../types/nutAccess.ts'

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
  async getStatus(nutToken): Promise<NutAccessStatus> {
    const associated = recordFor(nutToken)?.associatedDeviceId ?? null
    if (!associated) return 'free'
    return associated === getOrCreateDeviceId() ? 'mine' : 'locked'
  },
  async associate(nutToken): Promise<NutSession> {
    const deviceId = getOrCreateDeviceId()
    const record = recordFor(nutToken)
    if (record?.associatedDeviceId && record.associatedDeviceId !== deviceId) throw new Error('Nut unavailable')
    setDevice(nutToken, deviceId)
    return { nutToken, deviceId, sessionToken: crypto.randomUUID() }
  },
  async verify(nutToken) { return this.getStatus(nutToken).then(status => status === 'mine') },
  async dissociate(nutToken) {
    if (recordFor(nutToken)?.associatedDeviceId === getOrCreateDeviceId()) setDevice(nutToken, null)
  },
}

export function setMockNutState(nutToken: string, state: 'free' | 'mine' | 'locked') {
  setDevice(nutToken, state === 'free' ? null : state === 'mine' ? getOrCreateDeviceId() : `other-${crypto.randomUUID()}`)
}

export function resetMockNuts() { localStorage.removeItem(MOCK_KEY) }

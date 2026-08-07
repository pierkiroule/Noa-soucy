import assert from 'node:assert/strict'
import { beforeEach, test } from 'node:test'
import { getOrCreateDeviceId } from './deviceIdentity.ts'
import { mockNutAccessService, resetMockNuts, setMockNutState } from './mockNutAccessService.ts'
import { clearAllNutSessions, getNutSession, removeNutSession, saveNutSession } from './nutSessionStorage.ts'

class MemoryStorage implements Storage {
  private values = new Map<string, string>()
  get length() { return this.values.size }
  clear() { this.values.clear() }
  getItem(key: string) { return this.values.get(key) ?? null }
  key(index: number) { return [...this.values.keys()][index] ?? null }
  removeItem(key: string) { this.values.delete(key) }
  setItem(key: string, value: string) { this.values.set(key, String(value)) }
}

beforeEach(() => { Object.defineProperty(globalThis, 'localStorage', { value: new MemoryStorage(), configurable: true }) })

test('getOrCreateDeviceId crée puis conserve un identifiant', () => {
  const first = getOrCreateDeviceId()
  assert.ok(first)
  assert.equal(getOrCreateDeviceId(), first)
})

test('la session locale est enregistrée, retirée et nettoyée', () => {
  const session = { nutToken: 'walnut1', deviceId: 'phone', sessionToken: 'session' }
  saveNutSession(session)
  assert.deepEqual(getNutSession('walnut1'), session)
  saveNutSession({ ...session, nutToken: 'walnut2' })
  removeNutSession('walnut1')
  assert.equal(getNutSession('walnut1'), null)
  clearAllNutSessions()
  assert.equal(getNutSession('walnut2'), null)
})

test('une valeur locale corrompue est ignorée', () => {
  localStorage.setItem('nao-nut-session:walnut1', '{cassé')
  localStorage.setItem('nao-mock-nuts', '{cassé')
  assert.equal(getNutSession('walnut1'), null)
  return assert.doesNotReject(() => mockNutAccessService.getStatus('walnut1'))
})

test('les états libre, associée ici et associée ailleurs sont distingués', async () => {
  assert.equal(await mockNutAccessService.getStatus('walnut1'), 'free')
  setMockNutState('walnut1', 'mine')
  assert.equal(await mockNutAccessService.getStatus('walnut1'), 'mine')
  setMockNutState('walnut1', 'locked')
  assert.equal(await mockNutAccessService.getStatus('walnut1'), 'locked')
})

test('association, refresh, offre et réassociation suivent le cycle attendu', async () => {
  const first = await mockNutAccessService.associate('walnut1')
  saveNutSession(first)
  assert.equal(await mockNutAccessService.verify('walnut1'), true)
  assert.equal(getNutSession('walnut1')?.sessionToken, first.sessionToken)
  await mockNutAccessService.dissociate('walnut1')
  removeNutSession('walnut1')
  assert.equal(await mockNutAccessService.verify('walnut1'), false)
  const second = await mockNutAccessService.associate('walnut1')
  assert.notEqual(second.sessionToken, first.sessionToken)
  assert.equal(await mockNutAccessService.getStatus('walnut1'), 'mine')
  resetMockNuts()
  assert.equal(await mockNutAccessService.getStatus('walnut1'), 'free')
})

test('une noix associée ailleurs refuse une association', async () => {
  setMockNutState('walnut1', 'locked')
  await assert.rejects(() => mockNutAccessService.associate('walnut1'))
})

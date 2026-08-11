import assert from 'node:assert/strict'
import test from 'node:test'
import handler, { createNaoPassagesHandler, isValidDisplayName, isValidNutId } from './nao-passages.ts'

type SqlCall = { text: string; values: unknown[] }
function mockSql(rows: Record<string, unknown>[], calls: SqlCall[] = []) {
  return async (strings: TemplateStringsArray, ...values: unknown[]) => {
    calls.push({ text: strings.join('?'), values })
    return rows
  }
}

test('validates nut ids', () => {
  assert.equal(isValidNutId('NAO0042'), true)
  assert.equal(isValidNutId('abc_'), true)
  assert.equal(isValidNutId('abc'), false)
  assert.equal(isValidNutId('NAO 0042'), false)
})

test('validates trimmed display names', () => {
  assert.equal(isValidDisplayName(' Luna '), true)
  assert.equal(isValidDisplayName('   '), false)
  assert.equal(isValidDisplayName('a'.repeat(61)), false)
})

test('GET returns only public passer fields using a parameterized query', async () => {
  const calls: SqlCall[] = []
  const sql = mockSql([{ id: 7, display_name: 'Luna', location_label: 'Nantes', created_at: '2026-08-11T07:00:00.000Z', nut_id: 'must-not-leak' }], calls)
  const response = await createNaoPassagesHandler(async () => sql)(new Request('https://example.test/api/nao-passages?nutId=NAO0042'))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { nutId: 'NAO0042', passers: [{ id: 7, displayName: 'Luna', locationLabel: 'Nantes', createdAt: '2026-08-11T07:00:00.000Z' }] })
  assert.match(calls[0]!.text, /ORDER BY created_at ASC, id ASC/)
  assert.deepEqual(calls[0]!.values, ['NAO0042'])
})

test('POST trims, parameterizes and returns the inserted passer', async () => {
  const calls: SqlCall[] = []
  const sql = mockSql([{ id: 8, display_name: 'Luna', location_label: 'Nantes', created_at: new Date('2026-08-11T07:00:00.000Z') }], calls)
  const response = await createNaoPassagesHandler(async () => sql)(new Request('https://example.test/api/nao-passages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nutId: 'NAO0042', displayName: ' Luna ', locationLabel: ' Nantes ' }) }))
  assert.equal(response.status, 201)
  assert.deepEqual(await response.json(), { passer: { id: 8, displayName: 'Luna', locationLabel: 'Nantes', createdAt: '2026-08-11T07:00:00.000Z' } })
  assert.deepEqual(calls[0]!.values, ['NAO0042', 'Luna', 'Nantes'])
})

test('returns a clean response when DATABASE_URL is absent', async () => {
  const previous = process.env.DATABASE_URL
  delete process.env.DATABASE_URL
  const response = await handler(new Request('https://example.test/api/nao-passages?nutId=NAO0042'))
  if (previous !== undefined) process.env.DATABASE_URL = previous
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { error: 'Service temporarily unavailable' })
})

test('does not expose Neon errors', async () => {
  const response = await createNaoPassagesHandler(async () => async () => { throw new Error('secret database detail') })(new Request('https://example.test/api/nao-passages?nutId=NAO0042'))
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { error: 'Service temporarily unavailable' })
})

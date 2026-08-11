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
  const sql = mockSql([{ id: 7, display_name: 'Luna', location_label: 'Nantes', created_at: '2026-08-11T07:00:00.000Z', grains: ['silence', 'lueur'], nut_id: 'must-not-leak' }], calls)
  const response = await createNaoPassagesHandler(async () => sql)(new Request('https://example.test/api/nao-passages?nutId=NAO0042'))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { nutId: 'NAO0042', passers: [{ id: 7, displayName: 'Luna', locationLabel: 'Nantes', createdAt: '2026-08-11T07:00:00.000Z', grains: ['silence', 'lueur'] }] })
  assert.match(calls[0]!.text, /ORDER BY p.created_at ASC, p.id ASC/)
  assert.deepEqual(calls[0]!.values, ['NAO0042'])
})

test('GET returns an empty grains array for a passer without a grain', async () => {
  const sql = mockSql([{ id: 9, display_name: 'Sacha', location_label: null, created_at: '2026-08-11T08:00:00.000Z', grains: null }])
  const response = await createNaoPassagesHandler(async () => sql)(new Request('https://example.test/api/nao-passages?nutId=NAO0042'))
  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { nutId: 'NAO0042', passers: [{ id: 9, displayName: 'Sacha', locationLabel: null, createdAt: '2026-08-11T08:00:00.000Z', grains: [] }] })
})

test('POST trims, parameterizes and returns the inserted passer', async () => {
  const calls: SqlCall[] = []
  const sql = mockSql([{ id: 8, display_name: 'Luna', location_label: 'Nantes', created_at: new Date('2026-08-11T07:00:00.000Z'), grains: ['Vent froid', 'lueur'] }], calls)
  const response = await createNaoPassagesHandler(async () => sql)(new Request('https://example.test/api/nao-passages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nutId: 'NAO0042', displayName: ' Luna ', locationLabel: ' Nantes ', grains: ['  Vent   froid ', 'lueur'] }) }))
  assert.equal(response.status, 201)
  assert.deepEqual(await response.json(), { passer: { id: 8, displayName: 'Luna', locationLabel: 'Nantes', createdAt: '2026-08-11T07:00:00.000Z', grains: ['Vent froid', 'lueur'] } })
  assert.deepEqual(calls[0]!.values, ['NAO0042', 'Luna', 'Nantes', ['Vent froid', 'lueur']])
  assert.match(calls[0]!.text, /WITH passage AS/)
  assert.match(calls[0]!.text, /INSERT INTO nao_grains/)
})

test('POST accepts and atomically inserts a passage without grains', async () => {
  const calls: SqlCall[] = []
  const sql = mockSql([{ id: 9, display_name: 'Sacha', location_label: null, created_at: '2026-08-11T08:00:00.000Z', grains: [] }], calls)
  const response = await createNaoPassagesHandler(async () => sql)(new Request('https://example.test/api/nao-passages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nutId: 'NAO0042', displayName: 'Sacha', grains: [] }) }))
  assert.equal(response.status, 201)
  assert.deepEqual(await response.json(), { passer: { id: 9, displayName: 'Sacha', locationLabel: null, createdAt: '2026-08-11T08:00:00.000Z', grains: [] } })
  assert.deepEqual(calls[0]!.values, ['NAO0042', 'Sacha', null, []])
  assert.match(calls[0]!.text, /LEFT JOIN inserted_grains/)
})

test('POST refuses missing, blank, overlong or excessive grains before accessing Neon', async () => {
  let databaseAccessed = false
  const request = (grains: unknown) => createNaoPassagesHandler(async () => {
    databaseAccessed = true
    return mockSql([])
  })(new Request('https://example.test/api/nao-passages', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ nutId: 'NAO0042', displayName: 'Luna', grains }) }))

  for (const grains of [undefined, ['   '], ['a'.repeat(81)], ['un', 'deux', 'trois', 'quatre']]) {
    assert.equal((await request(grains)).status, 400)
  }
  assert.equal(databaseAccessed, false)
})

test('returns a clean response when DATABASE_URL is absent', async () => {
  const previous = process.env.DATABASE_URL
  delete process.env.DATABASE_URL
  const response = await handler.fetch(new Request('https://example.test/api/nao-passages?nutId=NAO0042'))
  if (previous !== undefined) process.env.DATABASE_URL = previous
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { error: 'Service temporarily unavailable' })
})

test('health reports configuration without accessing Neon', async () => {
  const previous = process.env.DATABASE_URL
  process.env.DATABASE_URL = 'postgresql://must-not-be-returned'
  let databaseAccessed = false
  const response = await createNaoPassagesHandler(async () => {
    databaseAccessed = true
    return mockSql([])
  })(new Request('https://example.test/api/nao-passages?health=1'))
  if (previous === undefined) delete process.env.DATABASE_URL
  else process.env.DATABASE_URL = previous

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true, databaseUrlConfigured: true })
  assert.equal(databaseAccessed, false)
})

test('dbhealth runs only SELECT 1 AS ok with an abort signal', async () => {
  const calls: SqlCall[] = []
  let signal: AbortSignal | undefined
  const response = await createNaoPassagesHandler(async (options) => {
    signal = options?.signal
    return mockSql([{ ok: 1 }], calls)
  })(new Request('https://example.test/api/nao-passages?dbhealth=1'))

  assert.equal(response.status, 200)
  assert.deepEqual(await response.json(), { ok: true, database: true })
  assert.equal(signal instanceof AbortSignal, true)
  assert.deepEqual(calls, [{ text: 'SELECT 1 AS ok', values: [] }])
})

test('dbhealth returns 503 without exposing database errors', async () => {
  const response = await createNaoPassagesHandler(async () => async () => {
    throw new Error('secret database detail')
  })(new Request('https://example.test/api/nao-passages?dbhealth=1'))

  assert.equal(response.status, 503)
  assert.deepEqual(await response.json(), { ok: false, database: false })
})

test('does not expose Neon errors', async () => {
  const response = await createNaoPassagesHandler(async () => async () => { throw new Error('secret database detail') })(new Request('https://example.test/api/nao-passages?nutId=NAO0042'))
  assert.equal(response.status, 500)
  assert.deepEqual(await response.json(), { error: 'Service temporarily unavailable' })
})

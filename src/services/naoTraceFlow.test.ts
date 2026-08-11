import assert from 'node:assert/strict'
import test from 'node:test'
import { continueWithoutNaoTrace, leaveNaoTrace } from './naoTraceFlow.ts'

test('« Laisser juste une trace » appelle le POST avec grains: []', async t => {
  const previousFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = previousFetch })
  globalThis.fetch = async (_input, init) => {
    assert.equal(init?.method, 'POST')
    assert.deepEqual(JSON.parse(String(init?.body)), { nutId: 'NAO0042', displayName: 'Sacha', grains: [] })
    return new Response(JSON.stringify({ passer: { id: 13, displayName: 'Sacha', locationLabel: null, createdAt: '2026-08-11T00:00:00Z', grains: [] } }))
  }

  const passer = await leaveNaoTrace({ nutId: 'NAO0042', displayName: 'Sacha', grains: [] })
  assert.deepEqual(passer.grains, [])
})

test('« Continuer sans laisser de trace » continue sans appeler l’API', () => {
  let continued = false
  const previousFetch = globalThis.fetch
  globalThis.fetch = async () => { throw new Error('fetch ne doit pas être appelé') }
  try {
    continueWithoutNaoTrace(() => { continued = true })
    assert.equal(continued, true)
  } finally {
    globalThis.fetch = previousFetch
  }
})

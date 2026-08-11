import assert from 'node:assert/strict'
import test from 'node:test'
import { addNaoPasser, getNaoPassers, hasRegisteredNaoPassage, saveRegisteredNaoPassage } from './naoPassages.ts'

test('ajoute un passage, avec une localisation optionnelle', async t => {
  const previousFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = previousFetch })
  globalThis.fetch = async (_input, init) => {
    assert.equal(init?.method, 'POST')
    assert.deepEqual(JSON.parse(String(init?.body)), { nutId: 'NAO0042', displayName: 'Luna', grains: ['lueur'] })
    return new Response(JSON.stringify({ passer: { id: 12, displayName: 'Luna', locationLabel: null, createdAt: '2026-08-11T00:00:00Z' } }))
  }
  assert.equal((await addNaoPasser({ nutId: 'NAO0042', displayName: 'Luna', grains: ['lueur'] })).id, 12)
})

test('propage une indisponibilité POST ou GET', async t => {
  const previousFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = previousFetch })
  globalThis.fetch = async () => new Response('{}', { status: 503 })
  await assert.rejects(addNaoPasser({ nutId: 'NAO0042', displayName: 'Luna', grains: ['lueur'] }))
  await assert.rejects(getNaoPassers('NAO0042'))
})

test('récupère la liste collective', async t => {
  const previousFetch = globalThis.fetch
  t.after(() => { globalThis.fetch = previousFetch })
  globalThis.fetch = async input => {
    assert.equal(String(input), '/api/nao-passages?nutId=NAO0042')
    return new Response(JSON.stringify({ nutId: 'NAO0042', passers: [] }))
  }
  assert.deepEqual((await getNaoPassers('NAO0042')).passers, [])
})

test('la trace locale utilise exclusivement la clé de la noix', () => {
  const values = new Map<string, string>([['nao-souci:audiovisual-progress:v4', 'conte-intact'], ['nao-resonances', 'boussole-intact']])
  const previousStorage = globalThis.localStorage
  Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: (key: string) => values.get(key) ?? null, setItem: (key: string, value: string) => values.set(key, value) } })
  try {
    assert.equal(hasRegisteredNaoPassage('NAO0042'), false)
    saveRegisteredNaoPassage('NAO0042', 12)
    assert.equal(hasRegisteredNaoPassage('NAO0042'), true)
    assert.equal(values.get('nao-passer:NAO0042'), '12')
    assert.equal(values.get('nao-souci:audiovisual-progress:v4'), 'conte-intact')
    assert.equal(values.get('nao-resonances'), 'boussole-intact')
  } finally {
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: previousStorage })
  }
})

import assert from 'node:assert/strict'
import test from 'node:test'
import { parseNaoTravelRoute } from './storyRoute.ts'

test('reconnaît la route NFC d’une noix', () => {
  assert.deepEqual(parseNaoTravelRoute('/n/NAO0042'), { kind: 'journey', nutId: 'NAO0042' })
  assert.deepEqual(parseNaoTravelRoute('/n/NAO0042/passers'), { kind: 'passers', nutId: 'NAO0042' })
})

test('refuse les identifiants invalides sans confondre la route historique', () => {
  assert.deepEqual(parseNaoTravelRoute('/n/a!'), { kind: 'invalid' })
  assert.deepEqual(parseNaoTravelRoute('/n/123'), { kind: 'invalid' })
  assert.deepEqual(parseNaoTravelRoute('/n'), { kind: 'none' })
  assert.deepEqual(parseNaoTravelRoute('/'), { kind: 'none' })
})

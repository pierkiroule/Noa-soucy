import assert from 'node:assert/strict'
import test from 'node:test'
import { canAccessStory } from './useNutAccess.ts'

test('le conte est bloqué tant que la noix n’est pas associée ici', () => {
  for (const status of ['loading', 'free', 'locked', 'error'] as const) assert.equal(canAccessStory({ status, nutToken: 'walnut1', isAssociated: false }), false)
})

test('le conte est autorisé uniquement pour mine', () => {
  assert.equal(canAccessStory({ status: 'mine', nutToken: 'walnut1', isAssociated: true }), true)
})

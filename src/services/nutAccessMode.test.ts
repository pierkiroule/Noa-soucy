import assert from 'node:assert/strict'
import test from 'node:test'
import { shouldUseMockNutAccess } from './nutAccessMode.ts'

test('la simulation reste active en développement sans fichier env local', () => {
  assert.equal(shouldUseMockNutAccess(undefined, true), true)
})

test('une configuration explicite choisit toujours le service demandé', () => {
  assert.equal(shouldUseMockNutAccess('true', false), true)
  assert.equal(shouldUseMockNutAccess('false', true), false)
})

test('Supabase reste le défaut en production', () => {
  assert.equal(shouldUseMockNutAccess(undefined, false), false)
})

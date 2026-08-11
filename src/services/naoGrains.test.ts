import assert from 'node:assert/strict'
import test from 'node:test'
import { cleanGrain, suggestedGrains } from './naoGrains.ts'

test('nettoie un grain personnel sans en changer le sens', () => {
  assert.equal(cleanGrain('  Vent   froid  '), 'Vent froid')
  assert.equal(cleanGrain('   '), '')
})

test('propose les vingt grains sensoriels sans catégories', () => {
  assert.equal(suggestedGrains.length, 20)
  assert.deepEqual(suggestedGrains.slice(0, 3), ['horizon', 'silence', 'frisson'])
})

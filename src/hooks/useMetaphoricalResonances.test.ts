import test from 'node:test'
import assert from 'node:assert/strict'
import { metaphoricalResonances } from '../data/metaphoricalResonances.ts'
import { initialMetaphoricalResonanceState, markVisitedState, openPetalState, closePetalState, saveAnswerState, readStoredResonances, resetResonancesState, toStoredResonances, METAPHORICAL_RESONANCES_STORAGE_KEY } from './useMetaphoricalResonances.ts'

const now = '2026-08-05T00:00:00.000Z'

test('opens a petal and marks it visited', () => {
  const state = openPetalState(initialMetaphoricalResonanceState, 'seed', now)
  assert.equal(state.opened, true)
  assert.equal(state.activePetalId, 'seed')
  assert.equal(state.answers.seed?.visited, true)
})

test('closes the panel without removing visited state', () => {
  const state = closePetalState(openPetalState(initialMetaphoricalResonanceState, 'wind', now))
  assert.equal(state.activePetalId, null)
  assert.equal(state.answers.wind?.visited, true)
})

test('saves and modifies an answer', () => {
  const first = saveAnswerState(initialMetaphoricalResonanceState, 'roots', 'Un appui', now)
  const second = saveAnswerState(first, 'roots', 'Un appui plus précis', now)
  assert.equal(second.answers.roots?.text, 'Un appui plus précis')
  assert.equal(second.answers.roots?.visited, true)
})

test('serializes summary data for visited petals only', () => {
  const state = markVisitedState(saveAnswerState(initialMetaphoricalResonanceState, 'flower', '', now), 'storm', now)
  const stored = toStoredResonances(state, now)
  assert.deepEqual(stored.visitedPetalIds.sort(), ['flower', 'storm'])
  assert.equal(stored.completedAt, now)
})

test('handles invalid localStorage content', () => {
  const storage = { getItem: (key: string) => key === METAPHORICAL_RESONANCES_STORAGE_KEY ? '{bad json' : null }
  assert.deepEqual(readStoredResonances(storage), initialMetaphoricalResonanceState)
})

test('resets resonance state', () => {
  assert.deepEqual(resetResonancesState(), initialMetaphoricalResonanceState)
})

test('defines the eight expected petals for free navigation', () => {
  assert.deepEqual(metaphoricalResonances.map(petal => petal.id), ['storm', 'shell', 'seed', 'roots', 'flower', 'wind', 'horizon', 'journey'])
})

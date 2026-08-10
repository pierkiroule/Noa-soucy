import test from 'node:test'
import assert from 'node:assert/strict'
import { metaphoricalResonances } from '../data/metaphoricalResonances.ts'
import { initialMetaphoricalResonanceState, markVisitedState, openDirectionState, closeDirectionState, saveResonanceNoteState, deleteResonanceNoteState, readStoredResonances, resetResonancesState, toStoredResonances, METAPHORICAL_RESONANCES_STORAGE_KEY } from './useMetaphoricalResonances.ts'

const now = '2026-08-05T00:00:00.000Z'

test('opens a direction and marks it visited', () => {
  const state = openDirectionState(initialMetaphoricalResonanceState, 'seed', now)
  assert.equal(state.opened, true)
  assert.equal(state.activeDirectionId, 'seed')
  assert.equal(state.answers.seed?.visited, true)
})

test('closes the panel without removing visited state', () => {
  const state = closeDirectionState(openDirectionState(initialMetaphoricalResonanceState, 'wind', now))
  assert.equal(state.activeDirectionId, null)
  assert.equal(state.answers.wind?.visited, true)
})

test('revisits a direction without requiring notes', () => {
  const first = markVisitedState(initialMetaphoricalResonanceState, 'roots', now)
  const second = markVisitedState(first, 'roots', '2026-08-06T00:00:00.000Z')
  assert.equal(second.answers.roots?.text, '')
  assert.equal(second.answers.roots?.updatedAt, now)
  assert.equal(second.answers.roots?.visited, true)
})

test('saves, modifies and deletes a resonance note while keeping the direction visited', () => {
  const saved = saveResonanceNoteState(initialMetaphoricalResonanceState, 'roots', '  Une image de forêt  ', now)
  assert.equal(saved.answers.roots?.text, 'Une image de forêt')
  const modified = saveResonanceNoteState(saved, 'roots', 'Un arbre ancien', '2026-08-06T00:00:00.000Z')
  assert.equal(modified.answers.roots?.text, 'Un arbre ancien')
  const deleted = deleteResonanceNoteState(modified, 'roots', '2026-08-07T00:00:00.000Z')
  assert.equal(deleted.answers.roots?.text, '')
  assert.equal(deleted.answers.roots?.visited, true)
})

test('serializes summary data for visited directions only', () => {
  const state = markVisitedState(markVisitedState(initialMetaphoricalResonanceState, 'flower', now), 'storm', now)
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

test('defines the eight expected directions for free navigation', () => {
  assert.deepEqual(metaphoricalResonances.map(direction => direction.id), ['storm', 'shell', 'seed', 'roots', 'flower', 'wind', 'horizon', 'journey'])
})

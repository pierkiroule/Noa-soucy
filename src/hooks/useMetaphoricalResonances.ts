import { useCallback, useEffect, useMemo, useState } from 'react'
import { metaphoricalResonances, type ResonancePetalId } from '../data/metaphoricalResonances.ts'
import type { MetaphoricalResonanceState, ResonanceAnswer } from '../types/metaphoricalResonances'

export const METAPHORICAL_RESONANCES_STORAGE_KEY = 'nao-souci-metaphorical-resonances-v1'

interface StoredResonances { answers: MetaphoricalResonanceState['answers']; completedAt: string | null }

const resonanceIds = new Set<string>(metaphoricalResonances.map(({ id }) => id))

export const initialMetaphoricalResonanceState: MetaphoricalResonanceState = { opened: false, activeDirectionId: null, answers: {}, completed: false }

export function openDirectionState(state: MetaphoricalResonanceState, id: ResonancePetalId, now = new Date().toISOString()): MetaphoricalResonanceState {
  return markVisitedState({ ...state, opened: true, activeDirectionId: id }, id, now)
}

export function closeDirectionState(state: MetaphoricalResonanceState): MetaphoricalResonanceState {
  return { ...state, activeDirectionId: null }
}


export function markVisitedState(state: MetaphoricalResonanceState, id: ResonancePetalId, now = new Date().toISOString()): MetaphoricalResonanceState {
  const current = state.answers[id]
  return { ...state, answers: { ...state.answers, [id]: { petalId: id, text: current?.text ?? '', visited: true, updatedAt: current?.updatedAt ?? now } } }
}

export function saveResonanceNoteState(state: MetaphoricalResonanceState, id: ResonancePetalId, text: string, now = new Date().toISOString()): MetaphoricalResonanceState {
  return { ...state, answers: { ...state.answers, [id]: { petalId: id, text: text.trim(), visited: true, updatedAt: now } } }
}

export function deleteResonanceNoteState(state: MetaphoricalResonanceState, id: ResonancePetalId, now = new Date().toISOString()): MetaphoricalResonanceState {
  const current = state.answers[id]
  if (!current) return state
  return { ...state, answers: { ...state.answers, [id]: { ...current, text: '', updatedAt: now } } }
}

export function resetResonancesState(): MetaphoricalResonanceState {
  return initialMetaphoricalResonanceState
}

export function readStoredResonances(storage: Pick<Storage, 'getItem'> = localStorage): MetaphoricalResonanceState {
  try {
    const parsed = JSON.parse(storage.getItem(METAPHORICAL_RESONANCES_STORAGE_KEY) ?? 'null') as Partial<StoredResonances> | null
    if (!parsed || typeof parsed !== 'object') return initialMetaphoricalResonanceState
    const answers: MetaphoricalResonanceState['answers'] = {}
    if (parsed.answers && typeof parsed.answers === 'object' && !Array.isArray(parsed.answers)) {
      for (const [id, candidate] of Object.entries(parsed.answers)) {
        if (!resonanceIds.has(id) || !candidate || typeof candidate !== 'object') continue
        const answer = candidate as Partial<ResonanceAnswer>
        if (answer.petalId !== id || typeof answer.text !== 'string' || answer.visited !== true || typeof answer.updatedAt !== 'string') continue
        answers[id as ResonancePetalId] = { petalId: id as ResonancePetalId, text: answer.text, visited: true, updatedAt: answer.updatedAt }
      }
    }
    const completed = typeof parsed.completedAt === 'string' && parsed.completedAt.length > 0
    return { opened: completed || Object.keys(answers).length > 0, activeDirectionId: null, answers, completed }
  } catch { return initialMetaphoricalResonanceState }
}

export function toStoredResonances(state: MetaphoricalResonanceState, completedAt: string | null = state.completed ? new Date().toISOString() : null): StoredResonances {
  return { answers: state.answers, completedAt }
}

export function useMetaphoricalResonances() {
  const [state, setState] = useState<MetaphoricalResonanceState>(() => typeof localStorage === 'undefined' ? initialMetaphoricalResonanceState : readStoredResonances())
  useEffect(() => {
    try { localStorage.setItem(METAPHORICAL_RESONANCES_STORAGE_KEY, JSON.stringify(toStoredResonances(state))) }
    catch (error) { console.warn('Résonances non enregistrées', error) }
  }, [state])

  const openCompass = useCallback(() => setState(current => ({ ...current, opened: true, completed: false })), [])
  const openDirection = useCallback((id: ResonancePetalId) => setState(current => openDirectionState(current, id)), [])
  const closeDirection = useCallback(() => setState(closeDirectionState), [])
  const markVisited = useCallback((id: ResonancePetalId) => setState(current => markVisitedState(current, id)), [])
  const saveNote = useCallback((id: ResonancePetalId, text: string) => setState(current => saveResonanceNoteState(current, id, text)), [])
  const deleteNote = useCallback((id: ResonancePetalId) => setState(current => deleteResonanceNoteState(current, id)), [])
  const resetResonances = useCallback(() => {
    try { localStorage.removeItem(METAPHORICAL_RESONANCES_STORAGE_KEY) }
    catch (error) { console.warn('Résonances non supprimées', error) }
    setState(resetResonancesState())
  }, [])
  const completeForToday = useCallback(() => setState(current => ({ ...current, completed: true, activeDirectionId: null })), [])
  const returnToCompass = useCallback(() => setState(current => ({ ...current, opened: true, completed: false, activeDirectionId: null })), [])
  const visitedAnswers = useMemo(() => Object.values(state.answers).filter((answer): answer is ResonanceAnswer => Boolean(answer?.visited)), [state.answers])

  return { state, visitedAnswers, openCompass, openDirection, closeDirection, markVisited, saveNote, deleteNote, resetResonances, completeForToday, returnToCompass }
}

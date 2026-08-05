import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ResonancePetalId } from '../data/metaphoricalResonances'
import type { MetaphoricalResonanceState, ResonanceAnswer } from '../types/metaphoricalResonances'

export const METAPHORICAL_RESONANCES_STORAGE_KEY = 'nao-souci-metaphorical-resonances-v1'

interface StoredResonances { answers: MetaphoricalResonanceState['answers']; visitedPetalIds: ResonancePetalId[]; lastActivePetalId: ResonancePetalId | null; completedAt: string | null }

export const initialMetaphoricalResonanceState: MetaphoricalResonanceState = { opened: false, activePetalId: null, answers: {}, completed: false }

export function openPetalState(state: MetaphoricalResonanceState, id: ResonancePetalId, now = new Date().toISOString()): MetaphoricalResonanceState {
  return markVisitedState({ ...state, opened: true, activePetalId: id }, id, now)
}

export function closePetalState(state: MetaphoricalResonanceState): MetaphoricalResonanceState {
  return { ...state, activePetalId: null }
}

export function saveAnswerState(state: MetaphoricalResonanceState, id: ResonancePetalId, text: string, now = new Date().toISOString()): MetaphoricalResonanceState {
  return { ...state, answers: { ...state.answers, [id]: { petalId: id, text, visited: true, updatedAt: now } } }
}

export function markVisitedState(state: MetaphoricalResonanceState, id: ResonancePetalId, now = new Date().toISOString()): MetaphoricalResonanceState {
  const current = state.answers[id]
  return { ...state, answers: { ...state.answers, [id]: { petalId: id, text: current?.text ?? '', visited: true, updatedAt: current?.updatedAt ?? now } } }
}

export function resetResonancesState(): MetaphoricalResonanceState {
  return initialMetaphoricalResonanceState
}

export function readStoredResonances(storage: Pick<Storage, 'getItem'> = localStorage): MetaphoricalResonanceState {
  try {
    const parsed = JSON.parse(storage.getItem(METAPHORICAL_RESONANCES_STORAGE_KEY) ?? 'null') as Partial<StoredResonances> | null
    if (!parsed || typeof parsed !== 'object') return initialMetaphoricalResonanceState
    return { opened: Boolean(parsed.completedAt || Object.keys(parsed.answers ?? {}).length), activePetalId: null, answers: parsed.answers ?? {}, completed: Boolean(parsed.completedAt) }
  } catch { return initialMetaphoricalResonanceState }
}

export function toStoredResonances(state: MetaphoricalResonanceState, completedAt: string | null = state.completed ? new Date().toISOString() : null): StoredResonances {
  return { answers: state.answers, visitedPetalIds: Object.values(state.answers).filter(Boolean).filter(answer => answer.visited).map(answer => answer.petalId), lastActivePetalId: state.activePetalId, completedAt }
}

export function useMetaphoricalResonances() {
  const [state, setState] = useState<MetaphoricalResonanceState>(() => typeof localStorage === 'undefined' ? initialMetaphoricalResonanceState : readStoredResonances())
  useEffect(() => { localStorage.setItem(METAPHORICAL_RESONANCES_STORAGE_KEY, JSON.stringify(toStoredResonances(state))) }, [state])

  const openFlower = useCallback(() => setState(current => ({ ...current, opened: true, completed: false })), [])
  const openPetal = useCallback((id: ResonancePetalId) => setState(current => openPetalState(current, id)), [])
  const closePetal = useCallback(() => setState(closePetalState), [])
  const saveAnswer = useCallback((id: ResonancePetalId, text: string) => setState(current => saveAnswerState(current, id, text)), [])
  const markVisited = useCallback((id: ResonancePetalId) => setState(current => markVisitedState(current, id)), [])
  const resetResonances = useCallback(() => { localStorage.removeItem(METAPHORICAL_RESONANCES_STORAGE_KEY); setState(resetResonancesState()) }, [])
  const completeForToday = useCallback(() => setState(current => ({ ...current, completed: true, activePetalId: null })), [])
  const returnToFlower = useCallback(() => setState(current => ({ ...current, opened: true, completed: false, activePetalId: null })), [])
  const visitedAnswers = useMemo(() => Object.values(state.answers).filter((answer): answer is ResonanceAnswer => Boolean(answer?.visited)), [state.answers])

  return { state, visitedAnswers, openFlower, openPetal, closePetal, saveAnswer, markVisited, resetResonances, completeForToday, returnToFlower }
}

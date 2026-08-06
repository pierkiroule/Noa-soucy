import { useCallback, useEffect, useMemo, useState } from 'react'
import type { ResonancePetalId } from '../data/metaphoricalResonances'
import type { MetaphoricalResonanceState, ResonanceAnswer } from '../types/metaphoricalResonances'

export const METAPHORICAL_RESONANCES_STORAGE_KEY = 'nao-souci-metaphorical-resonances-v1'

interface StoredResonances { answers: MetaphoricalResonanceState['answers']; visitedPetalIds: ResonancePetalId[]; lastActivePetalId: ResonancePetalId | null; completedAt: string | null }

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

export function resetResonancesState(): MetaphoricalResonanceState {
  return initialMetaphoricalResonanceState
}

export function readStoredResonances(storage: Pick<Storage, 'getItem'> = localStorage): MetaphoricalResonanceState {
  try {
    const parsed = JSON.parse(storage.getItem(METAPHORICAL_RESONANCES_STORAGE_KEY) ?? 'null') as Partial<StoredResonances> | null
    if (!parsed || typeof parsed !== 'object') return initialMetaphoricalResonanceState
    return { opened: Boolean(parsed.completedAt || Object.keys(parsed.answers ?? {}).length), activeDirectionId: null, answers: parsed.answers ?? {}, completed: Boolean(parsed.completedAt) }
  } catch { return initialMetaphoricalResonanceState }
}

export function toStoredResonances(state: MetaphoricalResonanceState, completedAt: string | null = state.completed ? new Date().toISOString() : null): StoredResonances {
  return { answers: state.answers, visitedPetalIds: Object.values(state.answers).filter(Boolean).filter(answer => answer.visited).map(answer => answer.petalId), lastActivePetalId: state.activeDirectionId, completedAt }
}

export function useMetaphoricalResonances() {
  const [state, setState] = useState<MetaphoricalResonanceState>(() => typeof localStorage === 'undefined' ? initialMetaphoricalResonanceState : readStoredResonances())
  useEffect(() => { localStorage.setItem(METAPHORICAL_RESONANCES_STORAGE_KEY, JSON.stringify(toStoredResonances(state))) }, [state])

  const openCompass = useCallback(() => setState(current => ({ ...current, opened: true, completed: false })), [])
  const openDirection = useCallback((id: ResonancePetalId) => setState(current => openDirectionState(current, id)), [])
  const closeDirection = useCallback(() => setState(closeDirectionState), [])
  const markVisited = useCallback((id: ResonancePetalId) => setState(current => markVisitedState(current, id)), [])
  const resetResonances = useCallback(() => { localStorage.removeItem(METAPHORICAL_RESONANCES_STORAGE_KEY); setState(resetResonancesState()) }, [])
  const completeForToday = useCallback(() => setState(current => ({ ...current, completed: true, activeDirectionId: null })), [])
  const returnToCompass = useCallback(() => setState(current => ({ ...current, opened: true, completed: false, activeDirectionId: null })), [])
  const visitedAnswers = useMemo(() => Object.values(state.answers).filter((answer): answer is ResonanceAnswer => Boolean(answer?.visited)), [state.answers])

  return { state, visitedAnswers, openCompass, openDirection, closeDirection, markVisited, resetResonances, completeForToday, returnToCompass }
}

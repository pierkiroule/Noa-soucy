import { useCallback, useEffect, useState } from 'react'
import type { ResonanceGardenState, ResonanceNode, ResonanceSeedId } from '../types/resonanceSeeds'

export const RESONANCE_GARDEN_STORAGE_KEY = 'nao-souci-resonance-garden-v1'
export const emptyGarden:ResonanceGardenState = { plantations:{} }

export function readResonanceGarden(storage:Pick<Storage,'getItem'>|undefined = typeof localStorage === 'undefined' ? undefined : localStorage):ResonanceGardenState {
  try {
    const value = JSON.parse(storage?.getItem(RESONANCE_GARDEN_STORAGE_KEY) ?? 'null') as ResonanceGardenState|null
    return value?.plantations && typeof value.plantations === 'object' ? value : emptyGarden
  } catch { return emptyGarden }
}
export function writeResonanceGarden(state:ResonanceGardenState, storage:Pick<Storage,'setItem'>|undefined = typeof localStorage === 'undefined' ? undefined : localStorage) {
  storage?.setItem(RESONANCE_GARDEN_STORAGE_KEY, JSON.stringify(state))
}
const nodeId = () => globalThis.crypto?.randomUUID?.() ?? `word-${Date.now()}-${Math.random().toString(36).slice(2)}`

export function useResonanceGarden() {
  const [state, setState] = useState<ResonanceGardenState>(readResonanceGarden)
  useEffect(() => { try { writeResonanceGarden(state) } catch (error) { console.warn('Jardin non enregistré', error) } }, [state])
  const plant = useCallback((seedId:ResonanceSeedId) => setState(current => current.plantations[seedId] ? current : ({ plantations:{ ...current.plantations, [seedId]:{ seedId, plantedAt:new Date().toISOString(), nodes:[] } } })), [])
  const addWords = useCallback((seedId:ResonanceSeedId, labels:string[], parentId:string|null=null) => setState(current => {
    const plantation = current.plantations[seedId]; if (!plantation) return current
    const createdAt = new Date().toISOString()
    const nodes:ResonanceNode[] = labels.map(label => label.trim()).filter(Boolean).map(label => ({ id:nodeId(), seedId, label, parentId, createdAt }))
    return { plantations:{ ...current.plantations, [seedId]:{ ...plantation, nodes:[...plantation.nodes, ...nodes] } } }
  }), [])
  const editWord = useCallback((seedId:ResonanceSeedId, id:string, label:string) => setState(current => {
    const p=current.plantations[seedId]; if (!p || !label.trim()) return current
    return { plantations:{ ...current.plantations, [seedId]:{ ...p, nodes:p.nodes.map(node => node.id===id ? { ...node, label:label.trim() } : node) } } }
  }), [])
  const removeWord = useCallback((seedId:ResonanceSeedId, id:string) => setState(current => {
    const p=current.plantations[seedId]; if (!p || p.nodes.some(node => node.parentId===id)) return current
    return { plantations:{ ...current.plantations, [seedId]:{ ...p, nodes:p.nodes.filter(node => node.id!==id) } } }
  }), [])
  return { state, plant, addWords, editWord, removeWord }
}

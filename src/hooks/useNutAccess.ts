import { useCallback, useEffect, useState } from 'react'
import { getOrCreateDeviceId } from '../services/deviceIdentity.ts'
import { nutAccessService } from '../services/nutAccessService.ts'
import { getNutSession, removeNutSession, saveNutSession } from '../services/nutSessionStorage.ts'
import type { NutAccessState } from '../types/nutAccess.ts'

export function canAccessStory(state: NutAccessState) { return state.status === 'mine' }

export function useNutAccess(nutToken: string | null) {
  const [state, setState] = useState<NutAccessState>({ status: nutToken ? 'loading' : 'error', nutToken, isAssociated: false })
  const refresh = useCallback(async () => {
    if (!nutToken) return setState({ status: 'error', nutToken: null, isAssociated: false })
    setState({ status: 'loading', nutToken, isAssociated: false })
    try {
      getOrCreateDeviceId()
      getNutSession(nutToken)
      const status = await nutAccessService.getStatus(nutToken)
      setState({ status, nutToken, isAssociated: status === 'mine' })
    } catch { setState({ status: 'error', nutToken, isAssociated: false }) }
  }, [nutToken])
  useEffect(() => { void refresh() }, [refresh])
  const associate = async () => {
    if (!nutToken) return
    const session = await nutAccessService.associate(nutToken)
    saveNutSession(session)
    setState({ status: 'mine', nutToken, isAssociated: true })
  }
  const offer = async () => {
    if (!nutToken) return
    await nutAccessService.dissociate(nutToken)
    removeNutSession(nutToken)
    setState({ status: 'free', nutToken, isAssociated: false })
  }
  return { state, associate, offer, refresh }
}

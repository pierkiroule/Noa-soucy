import { useCallback, useEffect, useRef, useState } from 'react'
import { getOrCreateDeviceId } from '../services/deviceIdentity.ts'
import { nutAccessService } from '../services/nutAccessService.ts'
import type { NutAccessState } from '../types/nutAccess.ts'

export function canAccessStory(state: NutAccessState) { return state.status === 'mine' }

export function useNutAccess(nutToken: string | null) {
  const [state, setState] = useState<NutAccessState>({ status: nutToken ? 'loading' : 'error', nutToken, isAssociated: false })
  const [lastSyncedAt, setLastSyncedAt] = useState<Date | null>(null)
  const [lastOperation, setLastOperation] = useState<'status' | 'associate' | 'dissociate' | null>(null)
  const [hasSyncError, setHasSyncError] = useState(false)
  const actionPending = useRef(false)
  const refresh = useCallback(async () => {
    if (!nutToken) return setState({ status: 'error', nutToken: null, isAssociated: false })
    setState({ status: 'loading', nutToken, isAssociated: false })
    try {
      const deviceId = getOrCreateDeviceId()
      const status = await nutAccessService.getStatus(nutToken, deviceId)
      setState({ status, nutToken, isAssociated: status === 'mine' })
      setLastOperation('status'); setLastSyncedAt(new Date()); setHasSyncError(false)
    } catch (error) {
      if (import.meta.env.DEV) console.error('Nut access status failed', error)
      setState({ status: 'error', nutToken, isAssociated: false })
      setHasSyncError(true)
    }
  }, [nutToken])
  useEffect(() => { void refresh() }, [refresh])
  const associateNao = async () => {
    if (!nutToken || actionPending.current) return
    actionPending.current = true
    setState({ status: 'loading', nutToken, isAssociated: false })
    try {
      const status = await nutAccessService.associate(nutToken, getOrCreateDeviceId())
      setState({ status, nutToken, isAssociated: status === 'mine' })
      setLastOperation('associate'); setLastSyncedAt(new Date()); setHasSyncError(false)
    } catch (error) {
      if (import.meta.env.DEV) console.error('Nut association failed', error)
      setState({ status: 'error', nutToken, isAssociated: false })
      setHasSyncError(true)
    } finally { actionPending.current = false }
  }
  const offerNao = async () => {
    if (!nutToken || actionPending.current) return
    actionPending.current = true
    try {
      const status = await nutAccessService.dissociate(nutToken, getOrCreateDeviceId())
      setState({ status, nutToken, isAssociated: false })
      setLastOperation('dissociate'); setLastSyncedAt(new Date()); setHasSyncError(false)
    } catch (error) {
      if (import.meta.env.DEV) console.error('Nut transmission failed', error)
      setState({ status: 'error', nutToken, isAssociated: false })
      setHasSyncError(true)
    } finally { actionPending.current = false }
  }
  return { state, associateNao, offerNao, refresh, sync: { lastSyncedAt, lastOperation, hasError: hasSyncError } }
}

import assert from 'node:assert/strict'
import test from 'node:test'
import { createSupabaseNutAccessService } from './supabaseNutAccessCore.ts'

test('envoie le contrat attendu à la Edge Function', async () => {
  const calls: Array<{ name: string; body: unknown }> = []
  const service = createSupabaseNutAccessService(async (name, options) => {
    calls.push({ name, body: options.body })
    return { data: { status: 'mine' }, error: null }
  })
  assert.equal(await service.getStatus('nao-test-001', 'phone-1'), 'mine')
  assert.deepEqual(calls[0], { name: 'nut-access', body: { action: 'status', nutToken: 'nao-test-001', deviceId: 'phone-1' } })
})

test('propage une erreur réseau sans accepter un statut invalide', async () => {
  const networkError = new Error('network')
  const unavailable = createSupabaseNutAccessService(async () => ({ data: null, error: networkError }))
  await assert.rejects(() => unavailable.associate('nao-test-001', 'phone-1'), networkError)
  const malformed = createSupabaseNutAccessService(async () => ({ data: { status: 'unknown' }, error: null }))
  await assert.rejects(() => malformed.dissociate('nao-test-001', 'phone-1'), /Invalid nut access status/)
})

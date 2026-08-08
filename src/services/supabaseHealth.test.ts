import assert from 'node:assert/strict'
import test from 'node:test'
import { checkSupabaseConnection } from './supabaseHealth.ts'

test('signale une configuration Supabase absente sans lancer de requête', async () => {
  let requested = false
  const status = await checkSupabaseConnection(undefined, undefined, async () => {
    requested = true
    return new Response()
  })
  assert.equal(status, 'unconfigured')
  assert.equal(requested, false)
})

test('vérifie la connexion Supabase indépendamment du service NFC simulé', async () => {
  let requestedUrl = ''
  const status = await checkSupabaseConnection('https://example.supabase.co/', 'anon-key', async (input, init) => {
    requestedUrl = String(input)
    assert.equal(init?.method, 'HEAD')
    assert.equal(new Headers(init?.headers).get('apikey'), 'anon-key')
    return new Response(null, { status: 200 })
  })
  assert.equal(status, 'connected')
  assert.equal(requestedUrl, 'https://example.supabase.co/rest/v1/')
})

test('signale une connexion Supabase indisponible', async () => {
  assert.equal(await checkSupabaseConnection('https://example.supabase.co', 'anon-key', async () => new Response(null, { status: 503 })), 'unreachable')
  assert.equal(await checkSupabaseConnection('https://example.supabase.co', 'anon-key', async () => { throw new Error('offline') }), 'unreachable')
})

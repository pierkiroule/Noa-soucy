export type SupabaseHealthStatus = 'checking' | 'connected' | 'unconfigured' | 'unreachable'

export async function checkSupabaseConnection(
  url = import.meta.env?.VITE_SUPABASE_URL,
  anonKey = import.meta.env?.VITE_SUPABASE_ANON_KEY,
  request: typeof fetch = fetch,
): Promise<Exclude<SupabaseHealthStatus, 'checking'>> {
  if (!url || !anonKey) return 'unconfigured'

  try {
    const response = await request(`${url.replace(/\/$/, '')}/rest/v1/`, {
      method: 'HEAD',
      headers: { apikey: anonKey, Authorization: `Bearer ${anonKey}` },
    })
    return response.ok ? 'connected' : 'unreachable'
  } catch {
    return 'unreachable'
  }
}

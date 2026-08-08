type InvokeResult = { data: unknown; error: Error | null }

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

// Client minimal limité aux Edge Functions. Il évite d'exposer autre chose que la clé anon.
export const supabase = {
  functions: {
    async invoke(name: string, options: { body: unknown }): Promise<InvokeResult> {
      try {
        const response = await fetch(`${supabaseUrl}/functions/v1/${name}`, {
          method: 'POST',
          headers: {
            apikey: supabaseAnonKey,
            Authorization: `Bearer ${supabaseAnonKey}`,
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(options.body),
        })
        if (!response.ok) return { data: null, error: new Error(`Edge Function returned ${response.status}`) }
        return { data: await response.json(), error: null }
      } catch (error) {
        return { data: null, error: error instanceof Error ? error : new Error('Edge Function unavailable') }
      }
    },
  },
}

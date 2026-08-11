type SqlRow = Record<string, unknown>
type Sql = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<SqlRow[]>
type SqlOptions = { signal?: AbortSignal }
type GetSql = (options?: SqlOptions) => Promise<Sql>

const nutIdPattern = /^[A-Za-z0-9_-]{4,40}$/

export function isValidNutId(value: unknown): value is string {
  return typeof value === 'string' && nutIdPattern.test(value)
}

export function isValidDisplayName(value: unknown): value is string {
  return typeof value === 'string' && value.trim().length >= 1 && value.trim().length <= 60
}

function json(body: unknown, status = 200): Response {
  return Response.json(body, { status })
}

function serializePasser(row: SqlRow) {
  return {
    id: row.id,
    displayName: row.display_name,
    locationLabel: row.location_label,
    createdAt: row.created_at instanceof Date ? row.created_at.toISOString() : row.created_at,
    grains: Array.isArray(row.grains) ? row.grains : [],
  }
}

async function defaultSql(options: SqlOptions = {}): Promise<Sql> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error('DATABASE_URL is not configured')
  const { neon } = await import('@neondatabase/serverless')
  return neon(databaseUrl, { fetchOptions: { signal: options.signal } }) as Sql
}

export function createNaoPassagesHandler(getSql: GetSql = defaultSql) {
  return async function handler(request: Request): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405)
    }

    const searchParams = new URL(request.url).searchParams
    if (request.method === 'GET' && searchParams.get('health') === '1') {
      return json({ ok: true, databaseUrlConfigured: Boolean(process.env.DATABASE_URL) })
    }

    if (request.method === 'GET' && searchParams.get('dbhealth') === '1') {
      const controller = new AbortController()
      let timeout: ReturnType<typeof setTimeout> | undefined
      const timedOut = new Promise<never>((_, reject) => {
        timeout = setTimeout(() => {
          controller.abort()
          reject(new Error('Database health check timed out'))
        }, 5_000)
      })
      try {
        await Promise.race([
          (async () => {
            const sql = await getSql({ signal: controller.signal })
            await sql`SELECT 1 AS ok`
          })(),
          timedOut,
        ])
        return json({ ok: true, database: true })
      } catch (error) {
        console.error('Nao passages database health check error', error)
        return json({ ok: false, database: false }, 503)
      } finally {
        if (timeout !== undefined) clearTimeout(timeout)
      }
    }

    try {
      if (request.method === 'GET') {
        const nutId = searchParams.get('nutId')
        if (!isValidNutId(nutId)) return json({ error: 'Invalid nutId' }, 400)

        const sql = await getSql()
        const rows = await sql`SELECT
          p.id,
          p.display_name,
          p.location_label,
          p.created_at,
          COALESCE(array_agg(g.grain_text ORDER BY g.id) FILTER (WHERE g.id IS NOT NULL), ARRAY[]::varchar[]) AS grains
        FROM nao_passages p
        LEFT JOIN nao_grains g ON g.passage_id = p.id
        WHERE p.nut_id = ${nutId}
        GROUP BY p.id
        ORDER BY p.created_at ASC, p.id ASC`
        return json({ nutId, passers: rows.map(serializePasser) })
      }

      let body: unknown
      try {
        body = await request.json()
      } catch {
        return json({ error: 'Invalid JSON body' }, 400)
      }
      if (typeof body !== 'object' || body === null) return json({ error: 'Invalid body' }, 400)

      const input = body as Record<string, unknown>
      if (!isValidNutId(input.nutId)) return json({ error: 'Invalid nutId' }, 400)
      if (!isValidDisplayName(input.displayName)) return json({ error: 'Invalid displayName' }, 400)
      if (input.locationLabel !== undefined && typeof input.locationLabel !== 'string') {
        return json({ error: 'Invalid locationLabel' }, 400)
      }

      const displayName = input.displayName.trim()
      const locationLabel = typeof input.locationLabel === 'string' ? input.locationLabel.trim() || null : null
      if (locationLabel !== null && locationLabel.length > 100) {
        return json({ error: 'Invalid locationLabel' }, 400)
      }
      if (!Array.isArray(input.grains) || input.grains.length < 1 || input.grains.length > 3) {
        return json({ error: 'Invalid grains' }, 400)
      }
      const grains = input.grains.map(grain => typeof grain === 'string' ? grain.trim().replace(/\s+/g, ' ') : '')
      if (grains.some(grain => grain.length < 1 || grain.length > 80)) return json({ error: 'Invalid grains' }, 400)

      const sql = await getSql()
      // One PostgreSQL statement is atomic: the passage cannot remain without its grains.
      const rows = await sql`WITH passage AS (
          INSERT INTO nao_passages (nut_id, display_name, location_label)
          VALUES (${input.nutId}, ${displayName}, ${locationLabel})
          RETURNING id, display_name, location_label, created_at
        ), inserted_grains AS (
          INSERT INTO nao_grains (passage_id, grain_text)
          SELECT passage.id, grain.text
          FROM passage
          CROSS JOIN unnest(${grains}::text[]) WITH ORDINALITY AS grain(text, position)
          ORDER BY grain.position
          RETURNING passage_id, id, grain_text
        )
        SELECT passage.id, passage.display_name, passage.location_label, passage.created_at,
          array_agg(inserted_grains.grain_text ORDER BY inserted_grains.id) AS grains
        FROM passage
        JOIN inserted_grains ON inserted_grains.passage_id = passage.id
        GROUP BY passage.id, passage.display_name, passage.location_label, passage.created_at`
      return json({ passer: serializePasser(rows[0]!) }, 201)
    } catch (error) {
      console.error('Nao passages API error', error)
      return json({ error: 'Service temporarily unavailable' }, 500)
    }
  }
}

const naoPassagesHandler = createNaoPassagesHandler()

export default {
  fetch(request: Request) {
    return naoPassagesHandler(request)
  },
}

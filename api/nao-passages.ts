type SqlRow = Record<string, unknown>
type Sql = (strings: TemplateStringsArray, ...values: unknown[]) => Promise<SqlRow[]>

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
  }
}

async function defaultSql(): Promise<Sql> {
  const databaseUrl = process.env.DATABASE_URL
  if (!databaseUrl) throw new Error('DATABASE_URL is not configured')
  const { neon } = await import('@neondatabase/serverless')
  return neon(databaseUrl) as Sql
}

export function createNaoPassagesHandler(getSql: () => Promise<Sql> = defaultSql) {
  return async function handler(request: Request): Promise<Response> {
    if (request.method !== 'GET' && request.method !== 'POST') {
      return json({ error: 'Method not allowed' }, 405)
    }

    try {
      if (request.method === 'GET') {
        const nutId = new URL(request.url).searchParams.get('nutId')
        if (!isValidNutId(nutId)) return json({ error: 'Invalid nutId' }, 400)

        const sql = await getSql()
        const rows = await sql`SELECT
          id,
          display_name,
          location_label,
          created_at
        FROM nao_passages
        WHERE nut_id = ${nutId}
        ORDER BY created_at ASC, id ASC`
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
      const locationLabel = typeof input.locationLabel === 'string' ? input.locationLabel.trim() : null
      if (locationLabel !== null && locationLabel.length > 100) {
        return json({ error: 'Invalid locationLabel' }, 400)
      }

      const sql = await getSql()
      const rows = await sql`INSERT INTO nao_passages (nut_id, display_name, location_label)
        VALUES (${input.nutId}, ${displayName}, ${locationLabel})
        RETURNING id, display_name, location_label, created_at`
      return json({ passer: serializePasser(rows[0]!) }, 201)
    } catch (error) {
      console.error('Nao passages API error', error)
      return json({ error: 'Service temporarily unavailable' }, 500)
    }
  }
}

export default createNaoPassagesHandler()

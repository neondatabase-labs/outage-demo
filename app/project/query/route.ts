export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { neon, neonConfig } from '@neondatabase/serverless'
import { type NextRequest, NextResponse } from 'next/server'

neonConfig.poolQueryViaFetch = true

export async function POST(request: NextRequest) {
  const { query } = await request.json()
  const sql = neon(`${process.env.DB_CONNECTION_STRING}`)
  if (!query.startsWith('DROP')) return NextResponse.json({ code: 0 })
  try {
    const start_time = performance.now()
    await sql.transaction(query.split(';').map((it: string) => sql(it)))
    const end_time = performance.now()
    return NextResponse.json({
      time: end_time - start_time,
      code: 1,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      code: 0,
    })
  }
}

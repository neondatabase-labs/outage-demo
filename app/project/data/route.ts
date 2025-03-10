export const runtime = 'edge'

export const preferredRegion = ['cle1']

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { neon, neonConfig } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

neonConfig.poolQueryViaFetch = true

export async function GET(request: Request) {
  const searchParams = new URL(request.url).searchParams
  const branchName = searchParams.get('branchName')
  const sql = neon(`${process.env.DB_CONNECTION_STRING}`)
  try {
    const parent_rows = await sql`SELECT * FROM branches WHERE branch_name = ${branchName} LIMIT 1`
    const connectionString = parent_rows[0]['connection_string']
    const sql_1 = neon(connectionString)
    const rows =
      await sql_1`SELECT t.id, t.content, t.image_url, t.likes_count, t.retweets_count, t.replies_count, t.created_at, u.id as user_id, u.username, u.display_name, u.avatar_url, u.bio FROM tweets t JOIN users u ON t.user_id = u.id ORDER BY t.created_at DESC;`
    return NextResponse.json({ code: 1, rows })
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      code: 0,
      // @ts-ignore
      rows: [e.message || e.toString()],
    })
  }
}

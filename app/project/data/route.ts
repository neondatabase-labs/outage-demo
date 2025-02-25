export const runtime = 'edge'

export const preferredRegion = ['cle1']

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { neon, neonConfig } from '@neondatabase/serverless'
import { type NextRequest, NextResponse } from 'next/server'

neonConfig.poolQueryViaFetch = true

const maskConnectionString = (connectionString: string) => {
  const urlPattern = /^(.*:\/\/)(.*:.*@)?(.*)$/
  const matches = connectionString.match(urlPattern)
  if (!matches) return 'Invalid connection string'
  const protocol = matches[1]
  const authPart = matches[2] ? '***:***@' : ''
  const restOfString = matches[3]
  return `${protocol}${authPart}${restOfString}`
}

export async function GET(request: NextRequest) {
  const sql = neon(`${process.env.DB_CONNECTION_STRING}`)
  try {
    const rows = await sql`SELECT id, city, rpu FROM users ORDER BY id DESC LIMIT 5`
    return NextResponse.json({
      sanitizedConnectionString: maskConnectionString(`${process.env.DB_CONNECTION_STRING}`),
      rows,
      code: 1,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      code: 0,
    })
  }
}

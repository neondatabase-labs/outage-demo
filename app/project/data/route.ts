export const runtime = 'edge'

export const preferredRegion = ['cle1']

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { neon, neonConfig } from '@neondatabase/serverless'
import { NextResponse } from 'next/server'

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

export async function GET() {
  const sql = neon(`${process.env.DB_CONNECTION_STRING}`)
  try {
    const rows = await sql`SELECT * FROM tweets limit 5;`
    return NextResponse.json({
      sanitizedConnectionString: maskConnectionString(`${process.env.DB_CONNECTION_STRING}`),
      rows,
      code: 1,
    })
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      code: 0,
      // @ts-ignore
      rows: [e.message || e.toString()]
    })
  }
}

export const runtime = 'edge'

export const preferredRegion = ['cle1']

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { Client } from '@upstash/qstash'
import { NextResponse } from 'next/server'

let client: Client | null = null

if (process.env.QSTASH_TOKEN) client = new Client({ token: process.env.QSTASH_TOKEN })

export async function GET() {
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', `Bearer ${process.env.NEON_API_KEY}`)
  const preserve_under_name = 'main_restored_' + new Date().getTime()
  const body = JSON.stringify({
    preserve_under_name,
    source_branch_id: process.env.NEON_PARENT_ID,
    source_timestamp: '2025-02-25T15:26:00.000Z',
  })
  const start_time = performance.now()
  await Promise.all([
    fetch(`https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches/${process.env.NEON_PARENT_ID}/restore`, {
      method: 'POST',
      headers,
      body,
    }),
    client?.publishJSON({
      url: 'https://neon-demos-outage.vercel.app/project/clean',
      body: { new_branch_id: preserve_under_name },
      delay: 30 * 60,
    }),
  ])
  const end_time = performance.now()
  return NextResponse.json({
    time: end_time - start_time,
    code: 1,
  })
}

export const runtime = 'edge'

export const preferredRegion = ['cle1']

export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const headers = new Headers()
  headers.append('Accept', 'application/json')
  headers.append('Content-Type', 'application/json')
  headers.append('Authorization', `Bearer ${process.env.NEON_API_KEY}`)
  const body = JSON.stringify({
    source_branch_id: process.env.NEON_PARENT_ID,
    source_timestamp: '2025-02-25T15:26:00.000Z',
    preserve_under_name: 'main_restored_' + new Date().getTime(),
  })
  const start_time = performance.now()
  await fetch(`https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches/${process.env.NEON_PARENT_ID}/restore`, {
    method: 'POST',
    headers,
    body,
  })
  const end_time = performance.now()
  return NextResponse.json({
    time: end_time - start_time,
    code: 1,
  })
}

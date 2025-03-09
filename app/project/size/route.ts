export const dynamic = 'force-dynamic'

export const fetchCache = 'force-no-store'

import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const headers = new Headers()
    headers.append('Accept', 'application/json')
    headers.append('Content-Type', 'application/json')
    headers.append('Authorization', `Bearer ${process.env.NEON_API_KEY}`)
    const respCall = await fetch(`https://console.neon.tech/api/v2/projects/${process.env.NEON_PROJECT_ID}/branches/${process.env.NEON_PARENT_ID}`, {
      headers,
    })
    const tmp = await respCall.json()
    const { logical_size } = tmp.branch
    return NextResponse.json({ logical_size: (logical_size / (1024 * 1024 * 1024)).toFixed(2) })
  } catch (e) {
    console.log(e)
    return NextResponse.json({
      code: 0,
    })
  }
}

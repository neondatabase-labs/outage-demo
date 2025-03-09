import { Suspense } from 'react'
import Feed from './list'

export default function Page() {
  return (
    <Suspense fallback={<></>}>
      <Feed />
    </Suspense>
  )
}

'use client'

import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { TimerReset } from 'lucide-react'
import { Fragment, ReactElement, useEffect, useState } from 'react'
import Confetti from 'react-confetti'

const reloadIframe = (expecting?: boolean) => {
  const iframe = document.querySelector('iframe')
  if (iframe) {
    iframe.src = iframe.src
    fetch(iframe.src).then((res) => {
      if (res.status !== 200 && expecting) {
        setTimeout(() => {
          reloadIframe()
        }, 200)
      }
    })
  }
}

const IframeView = () => {
  const [isLoading, setIsLoading] = useState(false)
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [queryResults, setQueryResults] = useState<any[]>([])
  return (
    <div className={'flex flex-col'}>
      <div className="mb-4 flex flex-row flex-wrap gap-2">
        <Button
          onClick={() => {
            reloadIframe()
          }}
          className="group border bg-transparent text-gray-400 hover:border-white hover:bg-transparent hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" className="mr-2" viewBox="0 0 24 24">
            <title>Reload</title>
            <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
              <g id="Reload">
                <rect id="Rectangle" fillRule="nonzero" x="0" y="0" width="24" height="24"></rect>
                <path
                  d="M4,13 C4,17.4183 7.58172,21 12,21 C16.4183,21 20,17.4183 20,13 C20,8.58172 16.4183,5 12,5 C10.4407,5 8.98566,5.44609 7.75543,6.21762"
                  id="Path"
                  className="stroke-gray-400 group-hover:stroke-gray-100"
                  strokeWidth="2"
                  strokeLinecap="round"
                ></path>
                <path
                  d="M9.2384,1.89795 L7.49856,5.83917 C7.27552,6.34441 7.50429,6.9348 8.00954,7.15784 L11.9508,8.89768"
                  id="Path"
                  className="stroke-gray-400 group-hover:stroke-gray-100"
                  strokeWidth="2"
                  strokeLinecap="round"
                ></path>
              </g>
            </g>
          </svg>
          <span>Reload App</span>
        </Button>
        <Button
          onClick={() => {
            setIsModalOpen(true)
            setIsLoading(true)
            fetch('/project/data')
              .then((res) => res.json())
              .then((res) => setQueryResults(res.rows))
              .finally(() => {
                setIsLoading(false)
              })
          }}
          className="group border bg-transparent text-gray-400 hover:border-white hover:bg-transparent hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 15 15" fill="none">
            <path
              fillRule="evenodd"
              clipRule="evenodd"
              className="fill-gray-400 group-hover:fill-gray-100"
              d="M5.07505 4.10001C5.07505 2.91103 6.25727 1.92502 7.50005 1.92502C8.74283 1.92502 9.92505 2.91103 9.92505 4.10001C9.92505 5.19861 9.36782 5.71436 8.61854 6.37884L8.58757 6.4063C7.84481 7.06467 6.92505 7.87995 6.92505 9.5C6.92505 9.81757 7.18248 10.075 7.50005 10.075C7.81761 10.075 8.07505 9.81757 8.07505 9.5C8.07505 8.41517 8.62945 7.90623 9.38156 7.23925L9.40238 7.22079C10.1496 6.55829 11.075 5.73775 11.075 4.10001C11.075 2.12757 9.21869 0.775024 7.50005 0.775024C5.7814 0.775024 3.92505 2.12757 3.92505 4.10001C3.92505 4.41758 4.18249 4.67501 4.50005 4.67501C4.81761 4.67501 5.07505 4.41758 5.07505 4.10001ZM7.50005 13.3575C7.9833 13.3575 8.37505 12.9657 8.37505 12.4825C8.37505 11.9992 7.9833 11.6075 7.50005 11.6075C7.0168 11.6075 6.62505 11.9992 6.62505 12.4825C6.62505 12.9657 7.0168 13.3575 7.50005 13.3575Z"
            />
          </svg>
          <span className="ml-1">Query Tweets</span>
        </Button>
        <Button
          onClick={() => {
            window.open('https://twitter-clone-outage-demo.vercel.app', '_blank')
          }}
          className="group border bg-transparent text-gray-400 hover:border-white hover:bg-transparent hover:text-white"
        >
          <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none">
            <path
              className="stroke-gray-400 group-hover:stroke-gray-100"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
            />
          </svg>
          <span className="ml-2">Open</span>
        </Button>
      </div>
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="max-h-[80vh] w-[600px] overflow-auto rounded-lg bg-black p-6">
            <div className="mb-4 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white">Database Query Results</h3>
              <Button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-white" variant="ghost">
                Close
              </Button>
            </div>
            {isLoading ? (
              <div className="text-center text-gray-400">Loading...</div>
            ) : (
              <div className="space-y-2">
                {queryResults.map((tweet, i) => (
                  <div key={i} className="rounded bg-black p-3">
                    <pre className="whitespace-pre-wrap text-sm text-gray-200">{JSON.stringify(tweet, null, 2)}</pre>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
      <iframe src="https://twitter-clone-outage-demo.vercel.app" className="min-h-[400px] w-[400px] !max-w-full rounded bg-white" />
    </div>
  )
}

interface Stage {
  icon: string
  next?: boolean
  prev?: boolean
  label?: string
  branched: boolean
  lineColor?: string
  leftView?: ReactElement
  rightView?: ReactElement
}

export default function Onboarding() {
  const [stage, setStage] = useState(0)
  const [nextOn, setNextOn] = useState(true)
  const [prevOn, setPrevOn] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  //
  const { toast } = useToast()
  const [newBranchTime, setNewBranchTime] = useState(0)
  const [newBranchSize, setNewBranchSize] = useState(0)
  const [newBranchName, setNewBranchName] = useState('main')
  const [mainBranchSize, setMainBranchSize] = useState(0)
  const [resetBranchTime, setResetBranchTime] = useState(0)
  const [insertBranchTime, setInsertBranchTime] = useState(0)
  //
  const stages: Stage[] = [
    {
      label: 'Welcome',
      icon: 'https://www.svgrepo.com/show/521608/document.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <h1 className="text-3xl font-semibold text-white">
            Experiencing <span className="text-red-500">downtime</span> due to a corrupted Postgres production database? <span className="text-green-500">Restore</span> your
            Postgres to back in time - in milliseconds & at any scale
          </h1>
          <span className="mt-3 font-light text-gray-400">
            In this demo, you will simluate a corruption in a Postgres database causing application downtime and then restore it to back in time in milliseconds. Behind the scenes,
            you are leveraging&nbsp;
            <a className="text-white/75 hover:underline hover:underline-offset-4" href="https://console.neon.tech/signup">
              Neon
            </a>
            {"'"}s Point-in-Time Restore.
          </span>
          <Button
            onClick={() => {
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max bg-[#00e599]"
          >
            {"Let's"} begin &rarr;
          </Button>
        </div>
      ),
    },
    {
      label: 'Original database',
      icon: 'https://www.svgrepo.com/show/471315/database-02.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">Create your own Postgres database</span>
          <span className="mt-3 text-balance text-gray-400">
            A Neon database is created in{' '}
            <a className="border-b text-white" target="_blank" href="https://neon.tech/demos/instant-postgres">
              under a second
            </a>
            . For now, we have prepared a database for you to create a corruption (of dropping all the tables) in. Currently, the size of this database is about{' '}
            <span className="text-green-400">{mainBranchSize > 0 ? mainBranchSize : '............'}</span> GiB.
          </span>
          <Button
            onClick={() => {
              toast({
                duration: 4000,
                description: `Dropping the users table in the main database...`,
              })
              fetch('/project/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  query: `DROP TABLE mentions; DROP TABLE tweets; DROP TABLE users;`,
                }),
              })
                .then((res) => res.json())
                .then((res) => {
                  // toast({
                  //   duration: 4000,
                  //   description: `Fetching size of the updated database...`,
                  // })
                  // setNewBranchName(res.new_branch_id)
                  if (res.time) {
                    // setNewBranchTime(res.time)
                    setInsertBranchTime(res.time)
                    reloadIframe()
                  }
                  // setRows([])
                  // setColumns([])
                  // fetchData(res.new_branch_id)
                  // fetchData('main')
                  // fetchBranchSize('main')
                })
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max bg-red-600 text-white hover:bg-red-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" className="mr-2 fill-white" viewBox="0 0 56 56">
              <path d="M 9.5899 50.2070 L 46.4102 50.2070 C 49.9257 50.2070 52.1289 47.6758 52.1289 44.4883 C 52.1289 43.5273 51.8947 42.5664 51.3791 41.6758 L 32.9336 8.6758 C 31.8789 6.7773 29.9570 5.7930 28.0117 5.7930 C 26.0899 5.7930 24.1211 6.7773 23.0664 8.6758 L 4.6446 41.6992 C 4.1289 42.5898 3.8711 43.5273 3.8711 44.4883 C 3.8711 47.6758 6.0977 50.2070 9.5899 50.2070 Z M 28.0117 42.0273 C 24.4258 42.0273 21.4961 39.2148 21.4961 35.6523 C 21.4961 33.5899 22.4805 31.6445 23.4648 29.8399 L 27.4024 22.5742 C 27.5664 22.3164 27.7305 22.1523 28.0117 22.1523 C 28.2930 22.1523 28.5039 22.3164 28.6211 22.5742 L 32.5586 29.8399 C 33.5195 31.6445 34.5273 33.5899 34.5273 35.6523 C 34.5273 39.2148 31.5977 42.0273 28.0117 42.0273 Z" />
            </svg>
            Drop all the tables &rarr;
          </Button>
        </div>
      ),
      rightView: <IframeView />,
    },
    {
      lineColor: 'bg-red-800',
      label: 'Broken database',
      icon: 'https://www.svgrepo.com/show/532994/plus.svg',
      branched: true,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">But... I messed it up!</span>
          <span className="mt-3 text-balance text-gray-400">
            In about <span className={cn(insertBranchTime > 0 && 'text-green-400')}>{insertBranchTime > 0 ? Math.round(insertBranchTime * 100) / 100 : '............'}</span> ms,
            you dropped the mentions, tweets and the users table and caused downtime in a dynamic application. How do I recover now?
          </span>
          <Button
            onClick={() => {
              toast({
                duration: 4000,
                description: 'Requesting database restore...',
              })
              fetch('/project/reset')
                .then((res) => res.json())
                .then((res) => {
                  if (res.time) setResetBranchTime(res.time)
                  // toast({
                  //   duration: 10000,
                  //   description: 'Fetching size of the restored table...',
                  // })
                  // setRows([])
                  // setColumns([])
                  // fetchBranchSize(newBranchName)
                  fetchData(newBranchName)
                })
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max bg-blue-400"
          >
            <TimerReset size="18" />
            <span className="ml-3">Restore the database</span>
          </Button>
        </div>
      ),
      rightView: <IframeView />,
    },
    {
      lineColor: 'bg-green-800',
      label: 'Recovered database',
      icon: 'https://www.svgrepo.com/show/521807/restore.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">Yay, it{"'"}s back!</span>
          <span className="mt-3 text-balance text-gray-400">
            In about <span className={cn(resetBranchTime > 0 && 'text-green-400')}>{resetBranchTime > 0 ? Math.round(resetBranchTime * 100) / 100 : '............'}</span> ms, you
            restored your copied database of <span className="text-green-400">{mainBranchSize > 0 ? mainBranchSize : '............'}</span> GiB to its original state. To try this
            on your own data,{' '}
            <a className="text-green-400 underline" href="https://console.neon.tech/signup" target="_blank">
              sign up for Neon
            </a>
            .
          </span>
          <Button
            variant="outline"
            onClick={() => {
              setStage(0)
              // setRows([])
              // setColumns([])
              setNewBranchTime(0)
              setNewBranchSize(0)
              setNewBranchName('main')
            }}
            className="mt-8 max-w-max bg-transparent text-gray-400"
          >
            <span className="ml-3">Restart the demo &rarr;</span>
          </Button>
        </div>
      ),
      rightView: <IframeView />,
    },
  ]
  const [stageLength, setStageLength] = useState(stages.length)
  const [loadingData, setLoadingData] = useState(false)
  const fetchBranchSize = (branchName: string) =>
    fetch(`/project/size?branchName=${branchName}`)
      .then((res) => res.json())
      .then((res) => {
        const { logical_size } = res
        setMainBranchSize(logical_size)
      })
  const fetchData = (branchName: string) => {
    setLoadingData(true)
    return fetch(`/project/data?branchName=${branchName}`)
      .then((res) => {
        fetchBranchSize(branchName)
        return res.json()
      })
      .then((res) => {
        setLoadingData(false)
        if (res.rows.length > 0) {
          reloadIframe(true)
          setTimeout(() => {
            setIsVisible(true)
            setTimeout(() => {
              setIsVisible(false)
            }, 5000)
          }, 1000)
        }
      })
  }
  useEffect(() => {
    if (stage === 1) {
      let toast1 = toast({
        duration: 4000,
        description: 'Fetching size of the database...',
      })
      fetchBranchSize('main').then(() => {
        toast1.dismiss()
      })
    } else if (stage === 2) {
      //
    } else if (stage === 3) {
      //
    } else if (stage === 4) {
      //
    } else if (stage === 5) {
      //
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage])
  return (
    <div className="flex flex-col items-center">
      <div className={cn('fixed left-0 top-0 h-screen w-screen', isVisible && stage === 5 ? 'z-[10000]' : 'z-[-1]')}>{isVisible && <Confetti />}</div>
      <div className="flex flex-row items-center gap-x-3">
        {new Array(stageLength).fill(0).map((i, _) => (
          <div key={_} className={cn('rounded-full', stage !== _ ? 'size-[6px] bg-white/50' : 'size-[8px] bg-white')} />
        ))}
      </div>
      <div className="mt-12 flex flex-row items-center">
        {new Array(stageLength).fill(0).map((i, _) => (
          <Fragment key={_}>
            <div className={cn('relative flex flex-row', _ !== stage && 'hidden lg:block')}>
              {!(stages[_].branched && _ - 1 > 0 && stages[_ - 1].branched) && stages[_].branched && (
                <div className={cn('branching-line', _ === stage ? stages[_].lineColor || 'bg-white' : 'bg-white/10')} />
              )}
              {!(stages[_].branched && _ - 1 > 0 && stages[_ - 1].branched) && _ - 1 >= 0 && stages[_ - 1].branched && (
                <div className={cn('branching-line-begin', _ === stage ? stages[_].lineColor || 'bg-white' : 'bg-white/10')} />
              )}
              {stages[_].branched && _ - 1 > 0 && stages[_ - 1].branched && <div className={cn('horizontal-line mt-6 w-[60px]', _ === stage ? 'bg-white' : 'bg-white/10')} />}
              {!(stages[_].branched && _ - 1 > 0 && stages[_ - 1].branched) && (
                <div
                  className={cn(
                    'horizontal-line',
                    _ === stage ? stages[_].lineColor || 'bg-white' : 'bg-white/10',
                    stages[_].branched || (_ - 1 >= 0 && stages[_ - 1].branched) ? '!w-[30px]' : '!w-[60px]',
                    _ - 1 >= 0 && stages[_ - 1].branched && 'ml-[30px]',
                  )}
                ></div>
              )}
            </div>
            <div
              className={cn(
                'relative mx-8 flex size-[80px] flex-col items-center justify-center rounded-full border',
                _ !== stage ? 'bg-white/10 opacity-50' : 'bg-white',
                stages[_].branched && 'mt-12',
                _ !== stage && 'hidden lg:flex',
              )}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img className="w-[30px] translate-x-0.5" src={stages[_].icon} alt="ChartJS" />
              <motion.span
                key={stage}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1 }}
                className={cn('absolute -bottom-8 z-20 min-w-max max-w-max', _ === stage ? 'text-white' : 'text-white/10 opacity-10')}
              >
                {stages[_].label}
              </motion.span>
            </div>
          </Fragment>
        ))}
      </div>
      <div className={cn('my-24 grid w-full max-w-4xl grid-cols-1 gap-8', stages[stage]?.rightView && 'md:grid-cols-2')}>
        {stages[stage]?.leftView && <div className={cn('flex w-full flex-col p-4')}>{stages[stage].leftView}</div>}
        {stages[stage]?.rightView && <div className={cn('flex w-full flex-col p-4')}>{stages[stage].rightView}</div>}
      </div>
      <div className="mt-12 flex flex-row items-center gap-x-3">
        <Button
          variant="outline"
          disabled={!prevOn || Boolean(stages[stage].prev) === false}
          className={cn((!prevOn || Boolean(stages[stage].prev) === false) && 'hidden', 'bg-transparent')}
          onClick={() => {
            setStage((stage) => {
              const tmp = stage - 1
              if (tmp < 0) return stageLength - 1
              return tmp % stageLength
            })
          }}
        >
          &larr; Prev
        </Button>
        <Button
          variant="outline"
          disabled={!nextOn || Boolean(stages[stage].next) === false}
          className={cn((!nextOn || Boolean(stages[stage].next) === false) && 'hidden', 'bg-transparent')}
          onClick={() => {
            setStage((stage) => {
              const tmp = (stage + 1) % stageLength
              return tmp
            })
          }}
        >
          Next &rarr;
        </Button>
      </div>
    </div>
  )
}

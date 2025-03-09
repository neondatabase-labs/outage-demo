'use client'

import Header from '@/components/header'
import { Button } from '@/components/ui/button'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { TimerReset } from 'lucide-react'
import { ReactElement, useEffect, useState } from 'react'
import Confetti from 'react-confetti'

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

const reloadIframe = (expecting?: boolean) => {
  const iframe = document.querySelector('iframe')
  if (iframe) {
    fetch(iframe.src)
      .then((res) => {
        if (res.status === 200 && expecting) {
          const showPopElement = document.createElement('div')
          showPopElement.id = 'show-pop'
          document.body.appendChild(showPopElement)
          iframe.src = iframe.src
        }
        if (res.status !== 200 && expecting) {
          reloadIframe(expecting)
        }
      })
      .catch(() => {
        iframe.src = iframe.src
      })
  }
}

export default function Onboarding() {
  const [stage, setStage] = useState(0)
  const [nextOn, setNextOn] = useState(true)
  const [prevOn, setPrevOn] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [enableBegin, setEnableBegin] = useState(true)
  //
  const { toast } = useToast()
  const [newBranchTime, setNewBranchTime] = useState(0)
  const [newBranchSize, setNewBranchSize] = useState(0)
  const [newBranchName, setNewBranchName] = useState('main')
  const [mainBranchSize, setMainBranchSize] = useState(0)
  const [resetBranchTime, setResetBranchTime] = useState(0)
  const [insertBranchTime, setInsertBranchTime] = useState(0)
  //
  const IframeView = ({ src }: { src?: string }) => {
    const [isLoading, setIsLoading] = useState(false)
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [queryResults, setQueryResults] = useState<any[]>([])
    return (
      <>
        {stage === 2 && (
          <div
            className="absolute left-0 top-0 h-screen w-screen opacity-15 transition duration-300"
            style={{
              backgroundImage: 'url(/alert_1.jpg)',
              backgroundSize: 'cover',
            }}
          />
        )}
        <div className="z-10 flex flex-col">
          <div className="mb-4 flex flex-row gap-2">
            <Button
              onClick={() => {
                reloadIframe()
              }}
              className="group border bg-transparent text-sm text-gray-200 hover:border-white hover:bg-transparent hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" height="12" width="12" className="mr-1" viewBox="0 0 24 24">
                <title>Reload</title>
                <g id="Page-1" stroke="none" strokeWidth="1" fill="none" fillRule="evenodd">
                  <g id="Reload">
                    <rect id="Rectangle" fillRule="nonzero" x="0" y="0" width="24" height="24"></rect>
                    <path
                      d="M4,13 C4,17.4183 7.58172,21 12,21 C16.4183,21 20,17.4183 20,13 C20,8.58172 16.4183,5 12,5 C10.4407,5 8.98566,5.44609 7.75543,6.21762"
                      id="Path"
                      className="stroke-gray-200 group-hover:stroke-gray-100"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                    ></path>
                    <path
                      d="M9.2384,1.89795 L7.49856,5.83917 C7.27552,6.34441 7.50429,6.9348 8.00954,7.15784 L11.9508,8.89768"
                      id="Path"
                      className="stroke-gray-200 group-hover:stroke-gray-100"
                      strokeWidth="1.5"
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
                fetch('/project/data?branchName=' + newBranchName)
                  .then((res) => res.json())
                  .then((res) => setQueryResults(res.rows))
                  .finally(() => {
                    setIsLoading(false)
                  })
              }}
              className="group border bg-transparent text-sm text-gray-200 hover:border-white hover:bg-transparent hover:text-white"
            >
              <svg width="12" height="12" className="fill-gray-200 group-hover:fill-gray-100" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M4 18V6" stroke="#1C274C" strokeWidth="1" strokeLinecap="round" />
                <path d="M20 6V18" stroke="#1C274C" strokeWidth="1" strokeLinecap="round" />
                <path d="M12 10C16.4183 10 20 8.20914 20 6C20 3.79086 16.4183 2 12 2C7.58172 2 4 3.79086 4 6C4 8.20914 7.58172 10 12 10Z" stroke="#1C274C" strokeWidth="1" />
                <path d="M20 12C20 14.2091 16.4183 16 12 16C7.58172 16 4 14.2091 4 12" stroke="#1C274C" strokeWidth="1" />
                <path d="M20 18C20 20.2091 16.4183 22 12 22C7.58172 22 4 20.2091 4 18" stroke="#1C274C" strokeWidth="1" />
              </svg>
              <span className="ml-1">Query DB</span>
            </Button>
            <Button
              onClick={() => {
                window.open('/feed?brancName=' + newBranchName, '_blank')
              }}
              className="group border bg-transparent text-sm text-gray-200 hover:border-white hover:bg-transparent hover:text-white"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="12" height="12" viewBox="0 0 24 24" fill="none">
                <path
                  className="stroke-gray-200 group-hover:stroke-gray-100"
                  strokeWidth="1"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6M15 3h6v6M10 14L21 3"
                />
              </svg>
              <span className="ml-1">Open</span>
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
          <iframe src={src} height="400px" width="360px" className="-ml-2 rounded bg-white" />
        </div>
      </>
    )
  }
  //
  const stages: Stage[] = [
    {
      label: 'Welcome',
      icon: 'https://www.svgrepo.com/show/521608/document.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <h1 className="text-3xl font-semibold text-white">
            <span>Nobody wants their production database to go down - but mistakes happen.</span>
            <span></span>
          </h1>
          <h2 className="mt-4 text-xl text-white">
            <span>
              In this interactive demo, <span className="font-semibold text-[#00e599]">we are going to take down a real web application</span> and bring it back quickly using{' '}
              {"Neon's"} Point-in-Time Restore.
            </span>
          </h2>
          <h2 className="mt-4 text-xl text-white">
            <span>
              Ready to see in action? Welcome to the <span className="font-semibold text-red-500">Outage Simulator</span>.
            </span>
          </h2>
          <Button
            onClick={() => {
              setEnableBegin(false)
              fetch('/project/create', { method: 'POST' })
                .then((res) => res.json())
                .then((res) => {
                  setNewBranchName(res.new_branch_id)
                  setStage((stage) => stage + 1)
                })
            }}
            className="mt-8 max-w-max bg-[#00e599]"
            disabled={!enableBegin}
          >
            {enableBegin ? <>Let{"'s"} begin &rarr;</> : 'Preparing...'}
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
          <div className="flex w-full flex-col gap-y-4">
            <span className="text-balance text-gray-200">
              Here{"'s"} our demo app - a simple social media feed.{' '}
              <a target="_blank" className="underline" href={'/feed?branchName=' + newBranchName}>
                Click here to check it out
              </a>
              .
            </span>
            <span className="text-balance text-gray-200">Looks alive, right? Well... not for long. In just a moment, we{"'re"} gonna pull the plug and take it down.</span>
            <div className="font-semibold text-white">Imagine you are a clumsy new dev, and you press this button:</div>
          </div>
          <Button
            onClick={() => {
              const dropToast = toast({
                duration: 4000,
                description: `Dropping the users table in the main database...`,
              })
              fetch('/project/query', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  branchName: newBranchName,
                  query: `DROP TABLE mentions; DROP TABLE tweets; DROP TABLE users;`,
                }),
              })
                .then((res) => res.json())
                .then((res) => {
                  if (res.time) {
                    setInsertBranchTime(res.time)
                    reloadIframe()
                  }
                })
                .finally(() => {
                  dropToast.dismiss()
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
      rightView: <IframeView src={'/feed?branchName=' + newBranchName} />,
    },
    {
      lineColor: 'bg-red-800',
      label: 'Broken database',
      icon: 'https://www.svgrepo.com/show/532994/plus.svg',
      branched: true,
      leftView: (
        <div className="contents">
          <div className="flex w-full flex-col gap-y-4">
            <span className="text-4xl">🚨</span>
            <span className="text-balance text-gray-200">
              Uh-oh... <span className="font-semibold text-red-500 underline">Things look broken now</span>. Our app is down, support tickets are piling up, and the prod database
              is the issue.
            </span>
            <span className="text-balance text-gray-200">
              To bring it back, we need to run a Point-in-time restore. Here{"'s"} the catch: the Postgres database powering this app holds{' '}
              <span className="text-green-400">{mainBranchSize > 0 ? mainBranchSize : '............'}</span> GiB of data.
            </span>
            <span>How long do you think a full restore will take?</span>
          </div>
          <Button
            onClick={() => {
              const restoreToast = toast({
                duration: 25000,
                description: 'Restoring database...',
              })
              fetch('/project/reset?branchName=' + newBranchName)
                .then((res) => res.json())
                .then((res) => {
                  if (res.time) setResetBranchTime(res.time)
                  restoreToast.dismiss()
                  reloadIframe(true)
                  let tmpS = setInterval(() => {
                    const showPopElement = document.querySelector('#show-pop')
                    if (showPopElement) {
                      setIsVisible(true)
                      setTimeout(() => {
                        setIsVisible(false)
                        showPopElement.remove()
                      }, 5000)
                      clearInterval(tmpS)
                    }
                  }, 100)
                })
              setStage((stage) => stage + 1)
            }}
            className="z-10 mt-8 max-w-max bg-blue-400"
          >
            <TimerReset size="18" />
            <span className="ml-3">Restore the database</span>
          </Button>
        </div>
      ),
      rightView: <IframeView src={'/feed?branchName=' + newBranchName} />,
    },
    {
      lineColor: 'bg-green-800',
      label: 'Recovered database',
      icon: 'https://www.svgrepo.com/show/521807/restore.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">That{"'s"} it?</span>
          <span className="mt-3 text-balance text-gray-200">
            In just <span className={cn(resetBranchTime > 0 && 'text-green-400')}>{resetBranchTime > 0 ? Math.round(resetBranchTime * 100) / 100 : '............'}</span> ms, the
            database was restored to its pre-incident state - and our web app is back online!
          </span>
          <span className="mt-3 text-balance text-gray-200">
            How? <span className={cn('text-green-400')}>Because this Postgres database runs on Neon</span>.
          </span>
          <span className="mt-3 text-balance text-gray-200">
            Neon{"'s"} restores are powered by copy-on-write branching, which makes them near-instant — <span className="font-semibold">even for multi-terabyte databases</span>.
          </span>
          <Button variant="outline" onClick={() => setStage((stage) => stage + 1)} className="mt-8 max-w-max bg-transparent text-gray-400">
            <span className="ml-3">Finish &rarr;</span>
          </Button>
        </div>
      ),
      rightView: <IframeView src={'/feed?branchName=' + newBranchName} />,
    },
    {
      label: 'Finishing thoughts',
      icon: 'https://www.svgrepo.com/show/521807/restore.svg',
      branched: false,
      leftView: (
        <div className="contents">
          <div
            className="absolute left-0 top-0 h-screen w-screen opacity-10 transition duration-300"
            style={{
              backgroundImage: 'url(/celebrate.jpeg)',
              backgroundSize: 'cover',
            }}
          />
          <h2 className="mt-4 text-xl text-white">That{"'s"} a wrap!</h2>
          <h2 className="z-10 mt-4 text-xl text-white">
            This demo gave you a taste of what{"'s"} possible with Neon{"'s"} Instant Restore. Want to learn more?{' '}
            <a target="_blank" className="text-green-400 underline" href="https://neon.tech/blog/recover-large-postgres-databases">
              Click here to keep reading
            </a>
            .
          </h2>
          <h2 className="z-10 mt-4 text-xl text-white">
            You can also try it yourself.{' '}
            <a target="_blank" className="text-green-400 underline" href="https://console.neon.tech/signup">
              Create a Neon account
            </a>
            , drop some tables, and recover in milliseconds.
          </h2>
          <h2 className="mt-4 text-xl text-white">Restores have never been this fun.</h2>
          <Button variant="outline" onClick={() => location.reload()} className="z-10 mt-8 max-w-max bg-transparent text-gray-400">
            <span className="ml-3">Restart the demo &rarr;</span>
          </Button>
        </div>
      ),
    },
  ]
  const [stageLength, setStageLength] = useState(stages.length)
  const [loadingData, setLoadingData] = useState(false)
  // const fetchBranchSize = () =>
  //   fetch(`/project/size`)
  //     .then((res) => res.json())
  //     .then((res) => {
  //       const { logical_size } = res
  //       setMainBranchSize(logical_size)
  //     })
  // const fetchData = (branchName: string) => {
  //   setLoadingData(true)
  //   return fetch(`/project/data?branchName=${branchName}`)
  //     .then((res) => {
  //       fetchBranchSize(branchName)
  //       return res.json()
  //     })
  //     .then((res) => {
  //       setLoadingData(false)
  //       if (res.rows.length > 0) {
  //         reloadIframe(true)
  //       }
  //     })
  // }
  useEffect(() => {
    if (stage === 0) {
      fetch(`/project/size`)
        .then((res) => res.json())
        .then((res) => {
          const { logical_size } = res
          setMainBranchSize(logical_size)
        })
    }
    if (stage === 1) {
      //
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
    <div className="mt-8 flex flex-col items-center">
      <div className="w-full max-w-3xl px-4">
        <Header />
        <div className="mt-6 flex flex-row items-center gap-x-3">
          {new Array(stageLength).fill(0).map((i, _) => (
            <div key={_} className={cn('rounded-full', stage !== _ ? 'size-[6px] bg-white/50' : 'size-[8px] bg-white')} />
          ))}
        </div>
      </div>
      <div className={cn('fixed left-0 top-0 h-screen w-screen', isVisible && stage === 5 ? 'z-[10000]' : 'z-[-1]')}>{isVisible && <Confetti />}</div>
      {/* <div className="mt-12 flex flex-row items-center">
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
      </div> */}
      <div className={cn('my-12 grid w-full max-w-3xl grid-cols-1 gap-8', stages[stage]?.rightView && 'md:grid-cols-2')}>
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

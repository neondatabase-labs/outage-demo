'use client'

import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { useToast } from '@/components/ui/use-toast'
import { cn } from '@/lib/utils'
import { motion } from 'framer-motion'
import { TimerReset } from 'lucide-react'
import { Fragment, ReactElement, useEffect, useState } from 'react'
import Confetti from 'react-confetti'

interface Stage {
  icon: string
  next?: boolean
  prev?: boolean
  label?: string
  branched: boolean
  leftView?: ReactElement
  rightView?: ReactElement
}

export default function Onboarding() {
  const [stage, setStage] = useState(0)
  const [nextOn, setNextOn] = useState(true)
  const [prevOn, setPrevOn] = useState(true)
  const [isVisible, setIsVisible] = useState(false)
  const [toBeRemoved, setToBeRemoved] = useState<number[]>([])
  //
  const { toast } = useToast()
  const [newBranchTime, setNewBranchTime] = useState(0)
  const [newBranchSize, setNewBranchSize] = useState(0)
  const [newBranchName, setNewBranchName] = useState('main')
  const [mainBranchSize, setMainBranchSize] = useState(0)
  const [resetBranchTime, setResetBranchTime] = useState(0)
  const [insertBranchTime, setInsertBranchTime] = useState(0)
  const [sourceConnectionString, setSourceConnectionString] = useState('')
  const [rows, setRows] = useState([])
  const [columns, setColumns] = useState<string[]>([])
  //
  function DataTable({
    rows = [],
    columns = [],
    highlight = 0,
    databaseName = 'main',
    editable = false,
  }: {
    rows: any[]
    columns: any[]
    highlight?: number
    databaseName?: string
    editable?: boolean
  }) {
    return (
      <>
        <span className="text-md text-white/30">
          Database: <span className="text-white/70">{databaseName}</span>, Table: <span className="text-white/70">users</span>
        </span>
        <Table className={cn('mt-3 border-t', rows.length < 1 && 'border-separate border-spacing-y-1')}>
          {'id, city, rpu'.split(',').length > 0 && (
            <TableHeader>
              <TableRow>
                {editable && <TableHead>&nbsp;</TableHead>}
                {'id, city, rpu'.split(',').map((i) => (
                  <TableHead key={i}>{i}</TableHead>
                ))}
              </TableRow>
            </TableHeader>
          )}
          <TableBody>
            {rows.map((i, idx) => (
              <TableRow className={highlight - 1 === idx ? 'bg-green-800 text-white' : ''} key={idx}>
                {editable && (
                  <TableCell>
                    <Input
                      type="checkbox"
                      checked={toBeRemoved.includes(i.id)}
                      onChange={(event) => {
                        if (event.target.checked) setToBeRemoved((copyRemoved) => [...copyRemoved, i.id])
                        else setToBeRemoved((copyRemoved) => [...copyRemoved].filter((oops) => oops != i.id))
                      }}
                    />
                  </TableCell>
                )}
                {Object.values(i).map((j: any, idx2) => (
                  <TableCell key={idx2}>{j}</TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>
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
          <h1 className="text-3xl font-semibold text-white">Recover from Postgres outages in milliseconds - regardless of size</h1>
          <span className="mt-3 font-light text-gray-400">
            In this demo, you will create an outage in your database and restore it to the original state in milliseconds. Behind the scenes, you are leveraging&nbsp;
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
            . For now, we have prepared a database for you to create an outage on. Currently, the size of this database is about{' '}
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
                  query: `DROP TABLE users`,
                }),
              })
                .then((res) => res.json())
                .then((res) => {
                  toast({
                    duration: 4000,
                    description: `Fetching data in the updated database...`,
                  })
                  // setNewBranchName(res.new_branch_id)
                  if (res.time) {
                    // setNewBranchTime(res.time)
                    setInsertBranchTime(res.time)
                  }
                  setRows([])
                  setColumns([])
                  // fetchData(res.new_branch_id)
                  fetchData('main')
                })
              setStage((stage) => stage + 1)
            }}
            className="mt-8 max-w-max bg-red-600 text-white hover:bg-red-800"
          >
            <svg xmlns="http://www.w3.org/2000/svg" height="16" width="16" className="mr-2 fill-white" viewBox="0 0 56 56">
              <path d="M 9.5899 50.2070 L 46.4102 50.2070 C 49.9257 50.2070 52.1289 47.6758 52.1289 44.4883 C 52.1289 43.5273 51.8947 42.5664 51.3791 41.6758 L 32.9336 8.6758 C 31.8789 6.7773 29.9570 5.7930 28.0117 5.7930 C 26.0899 5.7930 24.1211 6.7773 23.0664 8.6758 L 4.6446 41.6992 C 4.1289 42.5898 3.8711 43.5273 3.8711 44.4883 C 3.8711 47.6758 6.0977 50.2070 9.5899 50.2070 Z M 28.0117 42.0273 C 24.4258 42.0273 21.4961 39.2148 21.4961 35.6523 C 21.4961 33.5899 22.4805 31.6445 23.4648 29.8399 L 27.4024 22.5742 C 27.5664 22.3164 27.7305 22.1523 28.0117 22.1523 C 28.2930 22.1523 28.5039 22.3164 28.6211 22.5742 L 32.5586 29.8399 C 33.5195 31.6445 34.5273 33.5899 34.5273 35.6523 C 34.5273 39.2148 31.5977 42.0273 28.0117 42.0273 Z" />
            </svg>
            Drop the users table &rarr;
          </Button>
        </div>
      ),
      rightView: <DataTable rows={rows} columns={columns} />,
    },
    {
      label: 'Edited database',
      icon: 'https://www.svgrepo.com/show/532994/plus.svg',
      branched: true,
      leftView: (
        <div className="contents">
          <span className="text-xl font-medium">But... I messed it up!</span>
          <span className="mt-3 text-balance text-gray-400">
            In about <span className={cn(insertBranchTime > 0 && 'text-green-400')}>{insertBranchTime > 0 ? Math.round(insertBranchTime * 100) / 100 : '............'}</span> ms,
            you dropped the users table and caused an outage in application. How do I recover now?
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
                  toast({
                    duration: 10000,
                    description: 'Fetching data of the restored table...',
                  })
                  setRows([])
                  setColumns([])
                  fetchData(newBranchName).then(() => {
                    setIsVisible(true)
                    setTimeout(() => {
                      setIsVisible(false)
                    }, 5000)
                  })
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
      rightView: <DataTable rows={rows} columns={columns} databaseName={newBranchName} />,
    },
    {
      label: 'Restored database',
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
              setRows([])
              setColumns([])
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
      rightView: <DataTable rows={rows} columns={columns} databaseName={newBranchName} />,
    },
  ]
  const [stageLength, setStageLength] = useState(stages.length)
  const fetchBranchSize = (branchName: string) =>
    fetch(`/project/size?branchName=${branchName}`)
      .then((res) => res.json())
      .then((res) => {
        const { logical_size } = res
        setMainBranchSize(logical_size)
      })
  const fetchData = (branchName: string) =>
    fetch(`/project/data?branchName=${branchName}`)
      .then((res) => {
        fetchBranchSize(branchName)
        return res.json()
      })
      .then((res) => {
        if (res.rows.length > 0) {
          setSourceConnectionString(res.sanitizedConnectionString)
          setRows(res.rows)
          setColumns(Object.keys(res.rows[0]))
          toast({
            duration: 4000,
            description: `Data from ${branchName} database loaded.`,
          })
        }
      })
  useEffect(() => {
    if (stage === 1) {
      toast({
        duration: 4000,
        description: 'Fetching data and size of the main database...',
      })
      fetchData('main')
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
                <div className={cn('branching-line', _ === stage ? 'bg-white' : 'bg-white/10')} />
              )}
              {!(stages[_].branched && _ - 1 > 0 && stages[_ - 1].branched) && _ - 1 >= 0 && stages[_ - 1].branched && (
                <div className={cn('branching-line-begin', _ === stage ? 'bg-white' : 'bg-white/10')} />
              )}
              {stages[_].branched && _ - 1 > 0 && stages[_ - 1].branched && <div className={cn('horizontal-line mt-6 w-[60px]', _ === stage ? 'bg-white' : 'bg-white/10')} />}
              {!(stages[_].branched && _ - 1 > 0 && stages[_ - 1].branched) && (
                <div
                  className={cn(
                    'horizontal-line',
                    _ === stage ? 'bg-white' : 'bg-white/10',
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

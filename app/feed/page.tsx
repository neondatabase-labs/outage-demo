'use client'

import { Button } from '@/components/ui/button'
import { Heart, MessageCircle, Repeat } from 'lucide-react'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'

interface Tweet {
  id: string
  bio: string
  content: string
  user_id: number
  username: string
  avatar_url: string
  image_url?: string
  likes_count: number
  display_name: string
  replies_count: number
  retweets_count: number
}

const Feed = () => {
  const searchParams = useSearchParams()
  const branchName = searchParams.get('branchName')
  const [tweets, setTweets] = useState<Tweet[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  const fetchTweets = async () => {
    if (branchName) {
      setLoading(true)
      const response = await fetch(`/project/data?branchName=${branchName}`)
      if (response.ok) {
        const data = await response.json()
        if (data.code === 0) {
          setError('Application error: a server-side exception has occurred (see the server logs for more information). Digest: 3586024117') // Set error for server-side exception
        } else {
          setTweets(data.rows)
          setError(null) // Clear error if tweets are fetched
        }
      } else {
        setError('Application error: a server-side exception has occurred (see the server logs for more information). Digest: 3586024117') // Set error for server-side exception
      }
      setLoading(false) // Set loading to false after fetching
    }
  }

  useEffect(() => {
    fetchTweets()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const renderContentWithMentions = (content: string) => {
    const mentionRegex = /@(\w+)/g // Regex to find mentions
    const parts = content.split(mentionRegex)
    return parts.map((part, index) => {
      if (index % 2 === 1) {
        return (
          <span key={index} className="font-semibold text-blue-500">
            @{part}
          </span>
        )
      }
      return part
    })
  }

  return (
    <div className="min-w-screen min-h-screen bg-white">
      <div className="z-10 mx-auto flex max-w-lg flex-col space-y-4">
        {error && (
          <div className="mt-24 text-center text-black">
            <h2 style={{ fontSize: 14, fontWeight: 400, margin: '0px 8px' }}>
              Application error: a server-side exception has occurred (see the server logs for more information).
            </h2>
            <p style={{ fontSize: 14, fontWeight: 400, margin: '0px 8px' }}>Digest: 3586024117</p>
          </div>
        )}
        {loading ? ( // Show shimmer while loading
          <div className="animate-pulse space-y-4">
            {[...Array(3)].map((_, index) => (
              <div key={index} className="border-b border-gray-300 bg-white p-4">
                <div className="flex items-center space-x-2">
                  <div className="h-12 w-12 rounded-full bg-gray-200"></div>
                  <div className="flex-1">
                    <div className="h-4 w-3/4 rounded bg-gray-200"></div>
                    <div className="mt-1 h-4 w-1/2 rounded bg-gray-200"></div>
                  </div>
                </div>
                <div className="mt-2">
                  <div className="h-4 w-full rounded bg-gray-200"></div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          tweets.map((tweet, idx) => (
            <div key={tweet.id} className="border-b border-gray-300 bg-white p-4">
              <div className="flex items-center space-x-2">
                {tweet.avatar_url && <img src={`https://picsum.photos/id/${idx}/40/40`} alt="User avatar" className="h-12 w-12 rounded-full" />}
                <div>
                  <span className="font-semibold text-gray-600">
                    {tweet.display_name} (@{tweet.username})
                  </span>
                  <p className="text-sm text-gray-500">{tweet.bio}</p>
                </div>
              </div>
              <p className="mt-2 text-gray-800">{renderContentWithMentions(tweet.content)}</p>
              {tweet.image_url && <img src={`https://picsum.photos/id/${idx}/300/500`} alt="Tweet image" className="mt-2 max-h-80 w-full rounded object-cover" />}
              <div className="mt-2 flex justify-between">
                <div className="flex space-x-1">
                  <Button variant="default" className="flex items-center text-sm">
                    <Heart className="mr-1" /> {tweet.likes_count}
                  </Button>
                  <Button variant="default" className="flex items-center text-sm">
                    <MessageCircle className="mr-1" /> {tweet.replies_count}
                  </Button>
                  <Button variant="default" className="flex items-center text-sm">
                    <Repeat className="mr-1" /> {tweet.retweets_count}
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  )
}

export default Feed

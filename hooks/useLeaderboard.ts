"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { getLeaderboard } from '@/lib/queries'
import type { Profile } from '@/types/user'

export interface LeaderboardEntry {
  rank: number
  id: string
  username: string
  avatar_url: string | null
  xp: number
}

const REFRESH_INTERVAL = 15_000 // 15 seconds

export function useLeaderboard() {
  const { user } = useAuth()
  const [entries, setEntries] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [myRank, setMyRank] = useState<number | null>(null)
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null)

  const refresh = useCallback(async () => {
    console.log('[Leaderboard] fetching...')
    const profiles = await getLeaderboard()
    const ranked = profiles.map((p: Profile, i: number) => ({
      rank: i + 1,
      id: p.id,
      username: p.username,
      avatar_url: p.avatar_url,
      xp: p.xp ?? 0,
    }))
    setEntries(ranked)

    if (user) {
      const myIdx = ranked.findIndex((e) => e.id === user.id)
      setMyRank(myIdx >= 0 ? myIdx + 1 : null)
    }

    setLoading(false)
  }, [user])

  useEffect(() => {
    refresh()

    // Auto-refresh every 15s
    intervalRef.current = setInterval(refresh, REFRESH_INTERVAL)
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [refresh])

  return { entries, loading, myRank, refresh }
}

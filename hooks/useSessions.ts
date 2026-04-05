"use client"

import { useEffect, useState, useCallback, useRef } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { getUserSessions } from '@/lib/queries'
import {
  calcTotalXP,
  calcWeeklyHours,
  calcStreak,
  calcSkillDistribution,
  calcWeeklyChartData,
  calcHeatmapData,
  calcTodayMinutes,
} from '@/lib/calculations'
import type { Session } from '@/types/session'

export interface SessionStats {
  totalXP: number
  weeklyHours: number
  streak: number
  todayMinutes: number
  skillDistribution: { skill: string; hours: number; percentage: number }[]
  weeklyChartData: { day: string; hours: number }[]
  heatmapData: Record<string, number>
}

const EMPTY_STATS: SessionStats = {
  totalXP: 0,
  weeklyHours: 0,
  streak: 0,
  todayMinutes: 0,
  skillDistribution: [],
  weeklyChartData: [],
  heatmapData: {},
}

export function useSessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [stats, setStats] = useState<SessionStats>(EMPTY_STATS)
  const [loading, setLoading] = useState(true)
  const fetchedForId = useRef<string | null>(null)

  const userId = user?.id ?? null

  const refresh = useCallback(async () => {
    if (!userId) {
      setSessions([])
      setStats(EMPTY_STATS)
      setLoading(false)
      return
    }
    setLoading(true)
    console.log('[useSessions] fetching for:', userId)
    const data = await getUserSessions(userId)
    setSessions(data)
    setStats({
      totalXP: calcTotalXP(data),
      weeklyHours: calcWeeklyHours(data),
      streak: calcStreak(data),
      todayMinutes: calcTodayMinutes(data),
      skillDistribution: calcSkillDistribution(data),
      weeklyChartData: calcWeeklyChartData(data),
      heatmapData: calcHeatmapData(data),
    })
    setLoading(false)
  }, [userId])

  useEffect(() => {
    // Only refetch when user ID actually changes
    if (fetchedForId.current === userId && !loading) return
    fetchedForId.current = userId
    refresh()
  }, [userId, refresh, loading])

  return { sessions, stats, loading, refresh }
}

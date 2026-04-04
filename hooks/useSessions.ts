"use client"

import { useEffect, useState, useCallback } from 'react'
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

export function useSessions() {
  const { user } = useAuth()
  const [sessions, setSessions] = useState<Session[]>([])
  const [stats, setStats] = useState<SessionStats>({
    totalXP: 0,
    weeklyHours: 0,
    streak: 0,
    todayMinutes: 0,
    skillDistribution: [],
    weeklyChartData: [],
    heatmapData: {},
  })
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const data = await getUserSessions(user.id)
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
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  return { sessions, stats, loading, refresh }
}

"use client"

import { useEffect, useState, useCallback } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { getUserGoals, addGoal as addGoalQuery, deleteGoal as deleteGoalQuery } from '@/lib/queries'
import type { Goal } from '@/types/goal'

export function useGoals() {
  const { user } = useAuth()
  const [goals, setGoals] = useState<Goal[]>([])
  const [loading, setLoading] = useState(true)

  const refresh = useCallback(async () => {
    if (!user) return
    setLoading(true)
    const data = await getUserGoals(user.id)
    setGoals(data)
    setLoading(false)
  }, [user])

  useEffect(() => {
    refresh()
  }, [refresh])

  const addGoal = useCallback(
    async (title: string, target_minutes: number) => {
      if (!user) return
      await addGoalQuery({ user_id: user.id, title, target_minutes })
      await refresh()
    },
    [user, refresh]
  )

  const removeGoal = useCallback(
    async (goalId: string) => {
      await deleteGoalQuery(goalId)
      setGoals((prev) => prev.filter((g) => g.id !== goalId))
    },
    []
  )

  return { goals, loading, addGoal, removeGoal, refresh }
}

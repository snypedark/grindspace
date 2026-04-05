"use client"

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useAuth } from '@/lib/AuthContext'
import { getUserGoals, addGoal as addGoalQuery, deleteGoal as deleteGoalQuery } from '@/lib/queries'
import type { Goal } from '@/types/goal'

export function useGoals() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['goals', user?.id],
    queryFn: () => getUserGoals(user!.id),
    enabled: !!user?.id,
  })

  const addMutation = useMutation({
    mutationFn: ({ title, target_minutes }: { title: string; target_minutes: number }) =>
      addGoalQuery({ user_id: user!.id, title, target_minutes }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteGoalQuery,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['goals', user?.id] })
    },
  })

  return {
    goals: query.data ?? [],
    loading: query.isLoading,
    addGoal: (title: string, target_minutes: number) => addMutation.mutateAsync({ title, target_minutes }),
    removeGoal: deleteMutation.mutateAsync,
    refresh: query.refetch,
  }
}


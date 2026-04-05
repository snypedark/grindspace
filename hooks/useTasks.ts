import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getUserTasks, createTask, updateTask, deleteTask } from '@/lib/queries'
import { useAuth } from '@/lib/AuthContext'
import type { Task } from '@/types/task'

export function useTasks() {
  const { user } = useAuth()
  const queryClient = useQueryClient()

  const query = useQuery({
    queryKey: ['tasks', user?.id],
    queryFn: () => getUserTasks(user!.id),
    enabled: !!user?.id,
  })

  const createMutation = useMutation({
    mutationFn: createTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    },
  })

  const updateMutation = useMutation({
    mutationFn: ({ id, updates }: { id: string; updates: Partial<Task> }) => updateTask(id, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    },
  })

  const deleteMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['tasks', user?.id] })
    },
  })

  return {
    tasks: query.data ?? [],
    loading: query.isLoading,
    error: query.error,
    createTask: createMutation.mutateAsync,
    updateTask: updateMutation.mutateAsync,
    deleteTask: deleteMutation.mutateAsync,
  }
}

"use client"

import { useTasks } from '@/hooks/useTasks'
import { useTimer } from '@/hooks/useTimer'
import { useAuth } from '@/lib/AuthContext'
import { Plus, Play, CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { useState } from 'react'

export function TasksList() {
  const { tasks, loading, createTask, updateTask } = useTasks()
  const { startTimer } = useTimer()
  const [newTaskTitle, setNewTaskTitle] = useState('')
  const [creating, setCreating] = useState(false)

  const backlogTasks = tasks.filter(t => t.status === 'backlog' || t.status === 'todo')
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress')

  const { user } = useAuth()
  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!newTaskTitle.trim() || !user) return
    setCreating(true)
    await createTask({
      user_id: user.id, 
      title: newTaskTitle.trim(),
      status: 'todo'
    })
    setNewTaskTitle('')
    setCreating(false)
  }

  const toggleStatus = async (id: string, current: string) => {
    const next = current === 'completed' ? 'todo' : 'completed'
    await updateTask({ id, updates: { status: next as any } })
  }

  if (loading) return <div className="animate-pulse h-32 bg-[#E8EAF0] shadow-neu-inset rounded-2xl" />

  return (
    <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-5 flex flex-col h-full hover:-translate-y-0.5 hover:shadow-neu-hover transition-all duration-220">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#3B3F5C]">Today&apos;s Tasks</h3>
          <p className="text-xs font-medium text-[#7B80A0]">{tasks.length} pending</p>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto space-y-2 min-h-[150px]">
        {tasks.filter(t => t.status !== 'completed').length === 0 && (
          <div className="h-full flex flex-col items-center justify-center text-[#A8ABBE] opacity-60 px-4 text-center">
            <CheckCircle2 size={32} className="mb-2" />
            <p className="text-sm font-bold">All caught up!</p>
          </div>
        )}

        {tasks.filter(t => t.status !== 'completed').map(task => (
          <div 
            key={task.id} 
            className="group flex flex-col gap-2 p-3 rounded-xl bg-[#E8EAF0] shadow-neu-sm hover:shadow-neu-inset transition-all border border-transparent hover:border-white/40"
          >
            <div className="flex items-center gap-3">
              <button onClick={() => toggleStatus(task.id, task.status)} className="text-[#A8ABBE] hover:text-[#5EC8A0] transition-colors shrink-0">
                <Circle size={18} />
              </button>
              <span className="flex-1 text-sm font-bold text-[#3B3F5C] truncate">{task.title}</span>
              <button 
                onClick={() => startTimer('Focused Work', task.id)}
                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg bg-[#E8EAF0] shadow-neu-sm text-[#5B51E0] hover:text-[#9D93F9] transition-all"
                title="Start session for this task"
              >
                <Play size={14} fill="currentColor" />
              </button>
            </div>
            
            {task.status === 'in_progress' && (
              <div className="w-full bg-[#C5C8D6] h-1 rounded-full overflow-hidden ml-7 max-w-[calc(100%-2rem)]">
                <div className="bg-gradient-to-r from-[#9D93F9] to-[#5B51E0] h-full w-[45%] animate-pulse" />
              </div>
            )}
          </div>
        ))}
      </div>

      <form onSubmit={handleCreate} className="mt-4 pt-4 border-t border-[#C5C8D6]/30">
        <div className="relative">
          <input 
            type="text" 
            value={newTaskTitle}
            onChange={e => setNewTaskTitle(e.target.value)}
            placeholder="What needs to be done?"
            className="neu-input w-full px-3 py-2.5 pr-10 text-sm font-semibold text-[#3B3F5C] placeholder:text-[#A8ABBE]"
          />
          <button 
            type="submit" 
            disabled={creating || !newTaskTitle.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 p-1 text-[#5B51E0] hover:text-[#9D93F9] disabled:opacity-50 transition-colors"
          >
            {creating ? <Loader2 size={16} className="animate-spin" /> : <Plus size={16} />}
          </button>
        </div>
      </form>
    </div>
  )
}

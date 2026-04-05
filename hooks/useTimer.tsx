"use client"

import { createContext, useContext, useState, ReactNode, useEffect } from 'react'
import { logSession } from '@/lib/queries'
import { useAuth } from '@/lib/AuthContext'

interface TimerState {
  isActive: boolean
  isPaused: boolean
  startTime: number | null
  elapsedSeconds: number
  skillName: string
  taskId: string | null
  startTimer: (skillName: string, taskId?: string) => void
  pauseTimer: () => void
  resumeTimer: () => void
  stopTimer: (notes: string) => Promise<{ success: boolean; error?: string }>
}

const TimerContext = createContext<TimerState | null>(null)

export function TimerProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [isActive, setIsActive] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [startTime, setStartTime] = useState<number | null>(null)
  const [elapsedSeconds, setElapsedSeconds] = useState(0)
  const [skillName, setSkillName] = useState('Coding')
  const [taskId, setTaskId] = useState<string | null>(null)

  // Recover state from localStorage on mount to persist timer across reloads
  useEffect(() => {
    const saved = localStorage.getItem('grindspace_timer')
    if (saved) {
      try {
        const state = JSON.parse(saved)
        if (state.isActive) {
          setIsActive(state.isActive)
          setIsPaused(state.isPaused)
          setStartTime(state.startTime)
          setElapsedSeconds(state.elapsedSeconds || 0)
          setSkillName(state.skillName || 'Coding')
          setTaskId(state.taskId || null)
        }
      } catch (e) {
        // ignore
      }
    }
  }, [])

  // TICKER: Only ticks when active and not paused
  useEffect(() => {
    let interval: ReturnType<typeof setInterval>
    if (isActive && !isPaused) {
      interval = setInterval(() => {
        setElapsedSeconds((prev) => {
          const next = prev + 1
          localStorage.setItem('grindspace_timer', JSON.stringify({
            isActive, isPaused, startTime, elapsedSeconds: next, skillName, taskId
          }))
          return next
        })
      }, 1000)
    }
    return () => clearInterval(interval)
  }, [isActive, isPaused, startTime, skillName, taskId])

  // Sync to localstorage when state changes manually
  useEffect(() => {
    localStorage.setItem('grindspace_timer', JSON.stringify({
      isActive, isPaused, startTime, elapsedSeconds, skillName, taskId
    }))
  }, [isActive, isPaused, startTime, elapsedSeconds, skillName, taskId])

  const startTimer = (skill: string, tId?: string) => {
    setIsActive(true)
    setIsPaused(false)
    setStartTime(Date.now())
    setElapsedSeconds(0)
    setSkillName(skill)
    setTaskId(tId || null)
  }

  const pauseTimer = () => setIsPaused(true)
  const resumeTimer = () => setIsPaused(false)

  const stopTimer = async (notes: string) => {
    if (!user) return { success: false, error: 'Not authenticated' }
    
    // Save to database
    const mins = Math.max(1, Math.round(elapsedSeconds / 60)) // At least 1 minute
    
    const { error } = await logSession({
      user_id: user.id,
      skill_name: skillName,
      duration_mins: mins,
      notes,
      task_id: taskId || undefined
    })

    if (error) {
      return { success: false, error: error.message }
    }

    // Reset local state
    setIsActive(false)
    setIsPaused(false)
    setStartTime(null)
    setElapsedSeconds(0)
    setTaskId(null)
    localStorage.removeItem('grindspace_timer')

    return { success: true }
  }

  return (
    <TimerContext.Provider value={{
      isActive, isPaused, startTime, elapsedSeconds, skillName, taskId,
      startTimer, pauseTimer, resumeTimer, stopTimer
    }}>
      {children}
    </TimerContext.Provider>
  )
}

export function useTimer() {
  const ctx = useContext(TimerContext)
  if (!ctx) throw new Error('useTimer must be used within TimerProvider')
  return ctx
}

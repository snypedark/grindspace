"use client"

import { ProgressBar } from '@/components/ui/ProgressBar'
import { Target } from 'lucide-react'

interface TodayFocusCardProps {
  todayMinutes: number
  dailyGoalMinutes?: number // default 120 (2h)
}

export function TodayFocusCard({
  todayMinutes,
  dailyGoalMinutes = 120,
}: TodayFocusCardProps) {
  const percentage = Math.min(100, Math.round((todayMinutes / dailyGoalMinutes) * 100))
  const remainingMinutes = Math.max(0, dailyGoalMinutes - todayMinutes)
  const remainingHours = Math.round((remainingMinutes / 60) * 10) / 10
  const todayHours = Math.round((todayMinutes / 60) * 10) / 10
  const isComplete = todayMinutes >= dailyGoalMinutes

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-5 hover:-translate-y-1 hover:shadow-card-hover transition-all duration-200">
      <div className="flex items-start justify-between mb-3">
        <div>
          <h3 className="text-sm font-semibold text-text-primary">Today&apos;s Focus</h3>
          <p className="text-xs text-text-secondary mt-0.5">
            {isComplete
              ? '🎉 Daily goal crushed!'
              : `${remainingHours}h remaining`}
          </p>
        </div>
        <div className="flex items-center justify-center w-9 h-9 bg-accent-light rounded-xl">
          <Target size={16} className="text-accent" />
        </div>
      </div>

      <div className="flex items-end justify-between mb-2">
        <span className="text-2xl font-bold text-text-primary">{todayHours}h</span>
        <span className="text-xs text-text-secondary">
          goal: {Math.round((dailyGoalMinutes / 60) * 10) / 10}h
        </span>
      </div>

      <ProgressBar value={percentage} showValue={false} />

      {!isComplete && todayMinutes > 0 && (
        <p className="text-xs text-text-secondary mt-2">
          {percentage}% there — keep pushing!
        </p>
      )}
      {todayMinutes === 0 && (
        <p className="text-xs text-text-secondary mt-2">
          Start your first session for today 🚀
        </p>
      )}
    </div>
  )
}

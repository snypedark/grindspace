"use client"

import { ProgressBar } from '@/components/ui/ProgressBar'
import { Target } from 'lucide-react'

interface TodayFocusCardProps {
  todayMinutes: number
  dailyGoalMinutes?: number
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
    <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-[22px] hover:-translate-y-0.5 hover:shadow-neu-hover transition-all duration-220">
      <div className="flex items-start justify-between mb-4">
        <div>
          <h3 className="text-sm font-bold text-[#3B3F5C]">Today&apos;s Focus</h3>
          <p className="text-xs font-medium text-[#7B80A0] mt-0.5">
            {isComplete
              ? '🎉 Daily goal crushed!'
              : `${remainingHours}h remaining`}
          </p>
        </div>
        <div
          className="flex items-center justify-center w-9 h-9 rounded-[10px] text-white"
          style={{
            background: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)",
            boxShadow: "4px 4px 10px rgba(92,81,224,0.25), -2px -2px 6px rgba(255,255,255,0.6)",
          }}
        >
          <Target size={16} />
        </div>
      </div>

      <div className="flex items-end justify-between mb-3">
        <span className="text-[30px] font-[900] tracking-[-0.04em] text-[#3B3F5C] leading-none">{todayHours}h</span>
        <span className="text-xs font-semibold text-[#A8ABBE]">
          goal: {Math.round((dailyGoalMinutes / 60) * 10) / 10}h
        </span>
      </div>

      <ProgressBar value={percentage} showValue={false} color="purple" />

      {!isComplete && todayMinutes > 0 && (
        <p className="text-xs font-semibold text-[#7B80A0] mt-3">
          {percentage}% there — keep pushing!
        </p>
      )}
      {todayMinutes === 0 && (
        <p className="text-xs font-semibold text-[#7B80A0] mt-3">
          Start your first session for today 🚀
        </p>
      )}
    </div>
  )
}

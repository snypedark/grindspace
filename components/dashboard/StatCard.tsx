"use client"

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  numericValue?: number   // for count-up animation
  icon: ReactNode
  trend?: { value: string; positive: boolean }
  accent?: boolean
  className?: string
}

function useCountUp(target: number, duration = 1200) {
  const [count, setCount] = useState(0)

  useEffect(() => {
    if (target === 0) { setCount(0); return }
    const steps = 40
    const increment = target / steps
    const interval = duration / steps
    let current = 0
    const timer = setInterval(() => {
      current += increment
      if (current >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(Math.floor(current))
      }
    }, interval)
    return () => clearInterval(timer)
  }, [target, duration])

  return count
}

export function StatCard({
  label,
  value,
  numericValue,
  icon,
  trend,
  accent = false,
  className,
}: StatCardProps) {
  const animated = useCountUp(numericValue ?? 0)
  const displayValue = numericValue !== undefined ? animated.toLocaleString() : value

  return (
    <div
      className={clsx(
        'group relative rounded-2xl border border-border bg-white p-5 shadow-card',
        'transition-all duration-200 ease-smooth hover:-translate-y-1 hover:shadow-card-hover',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-xs font-medium text-text-secondary uppercase tracking-wide mb-1">
            {label}
          </p>
          <p
            className={clsx(
              'text-2xl font-bold leading-tight',
              accent ? 'text-accent' : 'text-text-primary'
            )}
          >
            {numericValue !== undefined ? displayValue : value}
          </p>
          {trend && (
            <p
              className={clsx(
                'text-xs mt-1 font-medium',
                trend.positive ? 'text-emerald-500' : 'text-rose-500'
              )}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div
          className={clsx(
            'flex items-center justify-center w-10 h-10 rounded-xl shrink-0',
            accent ? 'bg-accent text-white' : 'bg-accent-light text-accent'
          )}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

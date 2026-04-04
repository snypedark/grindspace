"use client"

import { useEffect, useState } from 'react'
import { clsx } from 'clsx'
import { ReactNode } from 'react'

interface StatCardProps {
  label: string
  value: string | number
  numericValue?: number
  icon: ReactNode
  trend?: { value: string; positive: boolean }
  accent?: boolean
  iconGradient?: string
  iconShadow?: string
  className?: string
}

const ICON_STYLES = {
  purple: {
    gradient: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)",
    shadow: "4px 4px 10px rgba(92,81,224,0.25), -2px -2px 6px rgba(255,255,255,0.6)",
  },
  green: {
    gradient: "linear-gradient(135deg, #7EDCB5, #5EC8A0, #3DB889)",
    shadow: "4px 4px 10px rgba(94,200,160,0.25), -2px -2px 6px rgba(255,255,255,0.6)",
  },
  orange: {
    gradient: "linear-gradient(135deg, #FFB88C, #F7A97C, #E8926A)",
    shadow: "4px 4px 10px rgba(247,169,124,0.25), -2px -2px 6px rgba(255,255,255,0.6)",
  },
  pink: {
    gradient: "linear-gradient(135deg, #F5A0C0, #F07AAB, #E65A96)",
    shadow: "4px 4px 10px rgba(240,122,171,0.25), -2px -2px 6px rgba(255,255,255,0.6)",
  },
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
  iconGradient,
  iconShadow,
  className,
}: StatCardProps) {
  const animated = useCountUp(numericValue ?? 0)
  const displayValue = numericValue !== undefined ? animated.toLocaleString() : value

  // Default to purple if no custom gradient
  const gradientStyle = iconGradient || ICON_STYLES.purple.gradient
  const shadowStyle = iconShadow || ICON_STYLES.purple.shadow

  return (
    <div
      className={clsx(
        'group relative rounded-[18px] bg-[#E8EAF0] p-[22px] shadow-neu',
        'transition-all duration-220 ease-smooth hover:-translate-y-0.5 hover:shadow-neu-hover',
        className
      )}
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex-1 min-w-0">
          <p className="text-[10px] font-bold text-[#A8ABBE] uppercase tracking-[0.1em] mb-1.5">
            {label}
          </p>
          <p className="text-[30px] font-[900] leading-none tracking-[-0.04em] text-[#3B3F5C]">
            {numericValue !== undefined ? displayValue : value}
          </p>
          {trend && (
            <p
              className={clsx(
                'text-xs mt-2 font-semibold',
                trend.positive ? 'text-[#5EC8A0]' : 'text-[#F07A7A]'
              )}
            >
              {trend.positive ? '↑' : '↓'} {trend.value}
            </p>
          )}
        </div>
        <div
          className="flex items-center justify-center w-11 h-11 rounded-[10px] shrink-0 text-white"
          style={{
            background: gradientStyle,
            boxShadow: shadowStyle,
          }}
        >
          {icon}
        </div>
      </div>
    </div>
  )
}

// Export icon styles for external use
export { ICON_STYLES }

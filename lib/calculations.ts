import type { Session } from '@/types/session'
import type { Goal } from '@/types/goal'

// 1 XP per minute
export function calcTotalXP(sessions: Session[]): number {
  return sessions.reduce((sum, s) => sum + s.duration_minutes, 0)
}

// Total hours in the current ISO week (Mon–Sun)
export function calcWeeklyHours(sessions: Session[]): number {
  const now = new Date()
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1 // Mon=0
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - dayOfWeek)
  weekStart.setHours(0, 0, 0, 0)

  const minutes = sessions
    .filter((s) => new Date(s.created_at) >= weekStart)
    .reduce((sum, s) => sum + s.duration_minutes, 0)

  return Math.round((minutes / 60) * 10) / 10
}

// Consecutive-day streak ending today
export function calcStreak(sessions: Session[]): number {
  if (sessions.length === 0) return 0

  const activityDates = new Set(
    sessions.map((s) => new Date(s.created_at).toISOString().slice(0, 10))
  )

  let streak = 0
  const today = new Date()

  for (let i = 0; i < 365; i++) {
    const d = new Date(today)
    d.setDate(today.getDate() - i)
    const key = d.toISOString().slice(0, 10)
    if (activityDates.has(key)) {
      streak++
    } else {
      break
    }
  }

  return streak
}

// Hours logged today
export function calcTodayMinutes(sessions: Session[]): number {
  const today = new Date().toISOString().slice(0, 10)
  return sessions
    .filter((s) => s.created_at.slice(0, 10) === today)
    .reduce((sum, s) => sum + s.duration_minutes, 0)
}

// Skill distribution — sorted by hours desc
export function calcSkillDistribution(
  sessions: Session[]
): { skill: string; hours: number; percentage: number }[] {
  const map: Record<string, number> = {}
  let total = 0

  for (const s of sessions) {
    map[s.skill] = (map[s.skill] ?? 0) + s.duration_minutes
    total += s.duration_minutes
  }

  if (total === 0) return []

  return Object.entries(map)
    .map(([skill, minutes]) => ({
      skill,
      hours: Math.round((minutes / 60) * 10) / 10,
      percentage: Math.round((minutes / total) * 100),
    }))
    .sort((a, b) => b.hours - a.hours)
    .slice(0, 6)
}

// Weekly bar chart data (Mon → Sun)
export function calcWeeklyChartData(
  sessions: Session[]
): { day: string; hours: number }[] {
  const DAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
  const map: Record<string, number> = {}

  const now = new Date()
  const dayOfWeek = now.getDay() === 0 ? 6 : now.getDay() - 1
  const weekStart = new Date(now)
  weekStart.setDate(now.getDate() - dayOfWeek)
  weekStart.setHours(0, 0, 0, 0)

  for (const s of sessions) {
    const d = new Date(s.created_at)
    if (d >= weekStart) {
      const key = d.toISOString().slice(0, 10)
      map[key] = (map[key] ?? 0) + s.duration_minutes
    }
  }

  return DAYS.map((day, i) => {
    const d = new Date(weekStart)
    d.setDate(weekStart.getDate() + i)
    const key = d.toISOString().slice(0, 10)
    return { day, hours: Math.round(((map[key] ?? 0) / 60) * 10) / 10 }
  })
}

// Heatmap — date string → intensity 0–4
export function calcHeatmapData(sessions: Session[]): Record<string, number> {
  const map: Record<string, number> = {}

  for (const s of sessions) {
    const key = s.created_at.slice(0, 10)
    map[key] = (map[key] ?? 0) + s.duration_minutes
  }

  const result: Record<string, number> = {}
  for (const [date, minutes] of Object.entries(map)) {
    if (minutes < 30) result[date] = 1
    else if (minutes < 90) result[date] = 2
    else if (minutes < 180) result[date] = 3
    else result[date] = 4
  }

  return result
}

// Goal progress — minutes logged today toward a goal's target
export function calcGoalProgress(
  goal: Goal,
  sessions: Session[]
): { current: number; percentage: number } {
  const today = new Date().toISOString().slice(0, 10)
  const current = sessions
    .filter((s) => s.created_at.slice(0, 10) === today)
    .reduce((sum, s) => sum + s.duration_minutes, 0)
  const percentage = Math.min(100, Math.round((current / goal.target_minutes) * 100))
  return { current, percentage }
}

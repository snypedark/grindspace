export type Goal = {
  id: string
  user_id: string
  title: string
  description: string | null
  target_minutes: number
  target_earnings: number
  period: 'daily' | 'weekly' | 'monthly' | 'yearly'
  start_date: string
  end_date: string
  hours_logged: number
  earnings_logged: number
  is_active: boolean
  is_completed: boolean
  skill_id: string | null
  created_at: string
}

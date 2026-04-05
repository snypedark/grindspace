// Table 3: sessions
export type Session = {
  id: string
  user_id: string
  skill_id: string | null
  skill_name: string | null
  title: string | null
  notes: string | null
  duration_mins: number
  xp_earned: number
  earnings: number
  client_name: string | null
  mood: string
  session_type: string
  is_pomodoro: boolean
  task_id: string | null
  logged_at: string
  created_at: string
}

export type Profile = {
  id: string
  username: string
  display_name: string | null
  bio: string | null
  location: string | null
  avatar_url: string | null
  avatar_preset: string
  theme: string
  accent_color: string
  current_focus: string | null
  level: number
  xp: number
  total_hours: number
  sessions_logged: number
  streak_shields: number
  is_public: boolean
  show_earnings: boolean
  show_hours: boolean
  show_skills: boolean
  last_seen_at: string
  joined_at: string
}

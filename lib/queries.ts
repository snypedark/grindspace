import { createClient } from './supabase'
import type { Session } from '@/types/session'
import type { Goal } from '@/types/goal'
import type { Profile } from '@/types/user'

// ─── Profile ────────────────────────────────────────────────────────────────

export async function getUserProfile(userId: string): Promise<Profile | null> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()
  if (error) return null
  return data as Profile
}

export async function updateProfile(userId: string, updates: Partial<Profile>) {
  const supabase = createClient()
  return supabase.from('profiles').update(updates).eq('id', userId)
}

// ─── Sessions ────────────────────────────────────────────────────────────────

export async function getUserSessions(userId: string): Promise<Session[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('sessions')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
  if (error) return []
  return data as Session[]
}

export async function logSession(payload: {
  user_id: string
  skill: string
  duration_minutes: number
  note?: string
}) {
  const supabase = createClient()
  return supabase.from('sessions').insert(payload).select().single()
}

export async function deleteSession(sessionId: string) {
  const supabase = createClient()
  return supabase.from('sessions').delete().eq('id', sessionId)
}

// ─── Goals ───────────────────────────────────────────────────────────────────

export async function getUserGoals(userId: string): Promise<Goal[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('goals')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: true })
  if (error) return []
  return data as Goal[]
}

export async function addGoal(payload: {
  user_id: string
  title: string
  target_minutes: number
}) {
  const supabase = createClient()
  return supabase.from('goals').insert(payload).select().single()
}

export async function deleteGoal(goalId: string) {
  const supabase = createClient()
  return supabase.from('goals').delete().eq('id', goalId)
}

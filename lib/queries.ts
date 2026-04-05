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

export async function checkUsernameAvailable(username: string): Promise<boolean> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id')
    .eq('username', username)
    .single()
  
  if (error && error.code === 'PGRST116') {
    return true
  }
  return false
}

export async function createProfile(id: string, username: string, avatar_url?: string | null) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .insert([{ id, username, avatar_url, xp: 0 }])
    .select()
    .single()
  return { data, error }
}

export async function uploadAvatar(userId: string, file: File): Promise<{ url: string | null; error: Error | null }> {
  try {
    const supabase = createClient()
    const ext = file.name.split('.').pop()
    const fileName = `${userId}_${Date.now()}.${ext}`
    
    const { error: uploadError } = await supabase.storage
      .from('avatars')
      .upload(fileName, file, { cacheControl: '3600', upsert: true })

    if (uploadError) throw uploadError

    const { data: { publicUrl } } = supabase.storage
      .from('avatars')
      .getPublicUrl(fileName)

    return { url: publicUrl, error: null }
  } catch (err: any) {
    return { url: null, error: err }
  }
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
  // Insert session — the DB trigger (increment_xp_on_session) auto-increments profiles.xp
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

// ─── Leaderboard ─────────────────────────────────────────────────────────────

export async function getLeaderboard(): Promise<Profile[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, xp, created_at')
    .order('xp', { ascending: false })
    .limit(50)
  if (error) {
    console.error('[Leaderboard] fetch error:', error.message)
    return []
  }
  return (data ?? []) as Profile[]
}

export async function getPublicProfile(userId: string): Promise<{
  profile: Profile | null
  totalSessions: number
  totalHours: number
}> {
  const supabase = createClient()
  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', userId)
    .single()

  const { count } = await supabase
    .from('sessions')
    .select('*', { count: 'exact', head: true })
    .eq('user_id', userId)

  const { data: sessionData } = await supabase
    .from('sessions')
    .select('duration_minutes')
    .eq('user_id', userId)

  const totalMinutes = (sessionData ?? []).reduce((sum: number, s: any) => sum + s.duration_minutes, 0)

  return {
    profile: profile as Profile | null,
    totalSessions: count ?? 0,
    totalHours: Math.round((totalMinutes / 60) * 10) / 10,
  }
}

// ─── Friends ─────────────────────────────────────────────────────────────────

export async function searchUsers(query: string, currentUserId: string): Promise<Profile[]> {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, avatar_url, xp, created_at')
    .ilike('username', `%${query}%`)
    .neq('id', currentUserId)
    .limit(10)
  if (error) return []
  return (data ?? []) as Profile[]
}

export async function sendFriendRequest(requesterId: string, receiverId: string) {
  const supabase = createClient()
  return supabase
    .from('friendships')
    .insert({ requester_id: requesterId, receiver_id: receiverId, status: 'pending' })
    .select()
    .single()
}

export async function respondToFriendRequest(friendshipId: string, accept: boolean) {
  const supabase = createClient()
  if (accept) {
    return supabase
      .from('friendships')
      .update({ status: 'accepted' })
      .eq('id', friendshipId)
  } else {
    return supabase
      .from('friendships')
      .delete()
      .eq('id', friendshipId)
  }
}

export async function getFriendRequests(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('friendships')
    .select(`
      id,
      requester_id,
      receiver_id,
      status,
      created_at,
      requester:profiles!friendships_requester_id_fkey(id, username, avatar_url, xp)
    `)
    .eq('receiver_id', userId)
    .eq('status', 'pending')
    .order('created_at', { ascending: false })
  if (error) {
    console.error('[Friends] requests error:', error.message)
    return []
  }
  return data ?? []
}

export async function getFriendsList(userId: string) {
  const supabase = createClient()

  // Friends where user is requester
  const { data: asRequester } = await supabase
    .from('friendships')
    .select(`
      id,
      receiver_id,
      created_at,
      friend:profiles!friendships_receiver_id_fkey(id, username, avatar_url, xp)
    `)
    .eq('requester_id', userId)
    .eq('status', 'accepted')

  // Friends where user is receiver
  const { data: asReceiver } = await supabase
    .from('friendships')
    .select(`
      id,
      requester_id,
      created_at,
      friend:profiles!friendships_requester_id_fkey(id, username, avatar_url, xp)
    `)
    .eq('receiver_id', userId)
    .eq('status', 'accepted')

  const friends: { id: string; friendshipId: string; username: string; avatar_url: string | null; xp: number }[] = []

  for (const row of asRequester ?? []) {
    const f = row.friend as any
    if (f) friends.push({ id: f.id, friendshipId: row.id, username: f.username, avatar_url: f.avatar_url, xp: f.xp ?? 0 })
  }
  for (const row of asReceiver ?? []) {
    const f = row.friend as any
    if (f) friends.push({ id: f.id, friendshipId: row.id, username: f.username, avatar_url: f.avatar_url, xp: f.xp ?? 0 })
  }

  return friends
}

// Check if a friendship exists between two users
export async function getFriendshipStatus(userId1: string, userId2: string): Promise<'none' | 'pending' | 'accepted'> {
  const supabase = createClient()
  const { data } = await supabase
    .from('friendships')
    .select('status')
    .or(`and(requester_id.eq.${userId1},receiver_id.eq.${userId2}),and(requester_id.eq.${userId2},receiver_id.eq.${userId1})`)
    .single()

  if (!data) return 'none'
  return data.status as 'pending' | 'accepted'
}

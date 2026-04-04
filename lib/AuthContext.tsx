"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from './supabase'
import { getUserProfile } from './queries'
import type { Profile } from '@/types/user'
import { useMemo } from 'react'

interface AuthContextType {
  user: User | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  profile: null,
  loading: true,
  signOut: async () => {},
  refreshProfile: async () => {},
})

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)
  const supabase = useMemo(() => createClient(), [])

  // Requested debug logs
  useEffect(() => {
    console.log("user:", user)
    console.log("profile:", profile)
    console.log("loading:", loading)
  }, [user, profile, loading])

  const loadProfile = useCallback(async (userId: string) => {
    const p = await getUserProfile(userId)
    setProfile(p)
  }, [])

  useEffect(() => {
    // Initial session check
    supabase.auth.getUser().then(({ data: { user } }) => {
      setUser(user)
      if (user) loadProfile(user.id)
      setLoading(false)
    })

    // Subscribe to auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null
        setUser(currentUser)
        if (currentUser) {
          await loadProfile(currentUser.id)
        } else {
          setProfile(null)
        }
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [loadProfile, supabase.auth])

  const signOut = useCallback(async () => {
    console.log('[AuthContext] signOut called')
    const { error } = await supabase.auth.signOut()
    if (error) {
      console.error('[AuthContext] signOut error:', error.message)
    }
    setUser(null)
    setProfile(null)
    console.log('[AuthContext] state cleared, redirecting...')
    // Hard redirect to fully clear all client-side cache
    window.location.href = '/login'
  }, [supabase.auth])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }, [user, loadProfile])

  return (
    <AuthContext.Provider value={{ user, profile, loading, signOut, refreshProfile }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

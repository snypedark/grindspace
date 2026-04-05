"use client"

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useRef,
  useMemo,
  ReactNode,
} from 'react'
import type { User } from '@supabase/supabase-js'
import { createClient } from './supabase'
import { getUserProfile } from './queries'
import type { Profile } from '@/types/user'

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
  const hasInitialized = useRef(false)

  const loadProfile = useCallback(async (userId: string) => {
    console.log('[Auth] loadProfile:', userId)
    const p = await getUserProfile(userId)
    console.log('[Auth] profile loaded:', p?.username ?? 'null')
    setProfile(p)
  }, [])

  useEffect(() => {
    // Initial session check — runs once
    supabase.auth.getUser().then(async ({ data: { user: initialUser } }) => {
      console.log('[Auth] getUser result:', initialUser?.email ?? 'null')
      setUser(initialUser)
      if (initialUser) {
        await loadProfile(initialUser.id)
      }
      setLoading(false)
      hasInitialized.current = true
    })

    // Subscribe to auth changes — skip the first event (duplicates getUser)
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        if (!hasInitialized.current) return // Skip initial duplicate

        const currentUser = session?.user ?? null
        console.log('[Auth] onAuthStateChange:', _event, currentUser?.email ?? 'null')
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  const signOut = useCallback(async () => {
    console.log('[LOGOUT] clicked')
    try {
      const { error } = await supabase.auth.signOut()
      if (error) {
        console.error('[LOGOUT] error:', error.message)
      }
      setUser(null)
      setProfile(null)
      console.log('[LOGOUT] success — redirecting')
      window.location.href = '/login'
    } catch (err) {
      console.error('[LOGOUT] unexpected error:', err)
      // Force redirect even on error
      window.location.href = '/login'
    }
  }, [supabase.auth])

  const refreshProfile = useCallback(async () => {
    if (user) {
      await loadProfile(user.id)
    }
  }, [user, loadProfile])

  const value = useMemo(
    () => ({ user, profile, loading, signOut, refreshProfile }),
    [user, profile, loading, signOut, refreshProfile]
  )

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}

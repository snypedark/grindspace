"use client"

import { useAuth } from '@/lib/AuthContext'
import { updateProfile } from '@/lib/queries'
import { Moon, Sun } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { user, profile, refreshProfile } = useAuth()
  const [theme, setTheme] = useState(profile?.theme || 'default')

  useEffect(() => {
    if (profile?.theme) {
      setTheme(profile.theme)
      if (profile.theme === 'dark') {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    }
  }, [profile?.theme])

  const toggleTheme = async () => {
    if (!user) return
    const newTheme = theme === 'default' ? 'dark' : 'default'
    setTheme(newTheme) // Optimistic update
    
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }

    await updateProfile(user.id, { theme: newTheme })
    await refreshProfile()
  }

  return (
    <button
      onClick={toggleTheme}
      className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#E8EAF0] shadow-neu-sm hover:shadow-neu-inset transition-all duration-200 text-[#7B80A0] hover:text-[#3B3F5C] shrink-0"
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? <Moon size={16} /> : <Sun size={16} />}
    </button>
  )
}

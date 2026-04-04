"use client"

import { Search, Bell, Plus, LogOut, ChevronDown } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/lib/AuthContext'
import { logSession } from '@/lib/queries'
import { SKILLS } from '@/constants/skills'
import { useState, useRef, useEffect } from 'react'
import { useRouter } from 'next/navigation'

function getGreeting() {
  const hour = new Date().getHours()
  if (hour < 12) return 'Good morning'
  if (hour < 17) return 'Good afternoon'
  return 'Good evening'
}

function formatDate() {
  return new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
  }).format(new Date())
}

interface TopbarProps {
  onSessionLogged?: () => void
}

export function Topbar({ onSessionLogged }: TopbarProps) {
  const { user, profile, signOut } = useAuth()
  const router = useRouter()
  const [logOpen, setLogOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [skill, setSkill] = useState('Coding')
  const [minutes, setMinutes] = useState(60)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  const displayName = profile?.username ?? user?.email?.split('@')[0] ?? 'User'

  // Close avatar dropdown on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (avatarRef.current && !avatarRef.current.contains(e.target as Node)) {
        setAvatarOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  async function handleLogSession(e: React.FormEvent) {
    e.preventDefault()
    if (!user) return
    setError(null)
    setSaving(true)
    const { error } = await logSession({
      user_id: user.id,
      skill,
      duration_minutes: minutes,
      note: note.trim() || undefined,
    })
    setSaving(false)
    if (error) { setError(error.message); return }
    setLogOpen(false)
    setNote('')
    onSessionLogged?.()
  }

  async function handleSignOut() {
    await signOut()
    router.push('/login')
  }

  return (
    <>
      <header className="fixed top-0 right-0 left-0 z-20 h-16 bg-white/95 backdrop-blur-sm border-b border-border flex items-center px-6 gap-4">
        {/* Greeting */}
        <div className="flex-1 min-w-0">
          <h1 className="text-sm font-semibold text-text-primary truncate">
            {getGreeting()}, {displayName} 👋
          </h1>
          <p className="text-xs text-text-secondary">{formatDate()}</p>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-2">
          {/* Search */}
          <button
            className="flex items-center gap-2 px-3 py-2 rounded-xl text-text-secondary hover:bg-surface hover:text-text-primary transition-all duration-150 text-sm"
            aria-label="Search"
          >
            <Search size={16} />
            <span className="hidden sm:inline text-xs text-text-secondary">Search…</span>
            <kbd className="hidden sm:inline-flex items-center px-1.5 py-0.5 rounded text-[10px] font-mono bg-gray-100 text-text-secondary border border-border">⌘K</kbd>
          </button>

          {/* Notifications */}
          <button
            className="relative flex items-center justify-center w-9 h-9 rounded-xl text-text-secondary hover:bg-surface hover:text-text-primary transition-all duration-150"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>

          <div className="w-px h-6 bg-border mx-1" />

          {/* Log Session */}
          <Button onClick={() => setLogOpen(true)} size="sm" className="gap-1.5">
            <Plus size={14} />
            Log Session
          </Button>

          {/* Avatar + dropdown */}
          <div className="relative" ref={avatarRef}>
            <button
              onClick={() => setAvatarOpen((v) => !v)}
              className="flex items-center gap-1.5 hover:opacity-80 transition-opacity"
            >
              <Avatar name={displayName} size="sm" />
              <ChevronDown size={12} className="text-text-secondary" />
            </button>
            {avatarOpen && (
              <div className="absolute right-0 top-11 bg-white border border-border rounded-xl shadow-card-hover min-w-[160px] py-1 z-50 animate-fade-slide-up">
                <div className="px-3 py-2 border-b border-border">
                  <p className="text-xs font-semibold text-text-primary truncate">{displayName}</p>
                  <p className="text-[10px] text-text-secondary truncate">{user?.email}</p>
                </div>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs text-rose-500 hover:bg-red-50 transition-colors"
                >
                  <LogOut size={13} />
                  Sign out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Log Session Modal */}
      <Modal isOpen={logOpen} onClose={() => setLogOpen(false)} title="Log a Session">
        <form onSubmit={handleLogSession} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">Skill</label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-150"
            >
              {SKILLS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={5}
              max={480}
              step={5}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="w-full border border-border rounded-xl px-3 py-2 text-sm text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-150"
            />
          </div>
          <div>
            <label className="block text-xs font-medium text-text-primary mb-1.5">
              Note (optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you work on?"
              className="w-full border border-border rounded-xl px-3 py-2 text-sm text-text-primary bg-white focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-150 resize-none"
            />
          </div>
          {error && (
            <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-3 py-2">
              {error}
            </div>
          )}
          <Button type="submit" className="w-full justify-center" disabled={saving}>
            {saving ? 'Saving…' : 'Save Session'}
          </Button>
        </form>
      </Modal>
    </>
  )
}

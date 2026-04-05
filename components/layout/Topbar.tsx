"use client"

import { Search, Bell, Plus, LogOut, ChevronDown, User as UserIcon } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Avatar } from '@/components/ui/Avatar'
import { Modal } from '@/components/ui/Modal'
import { useAuth } from '@/lib/AuthContext'
import { logSession } from '@/lib/queries'
import { SKILLS } from '@/constants/skills'
import { useState, useRef, useEffect } from 'react'
import { ThemeToggle } from './ThemeToggle'
import Link from 'next/link'

function getGreeting(name: string) {
  const hour = new Date().getHours()
  const day = new Date().getDay()

  if (day === 0 || day === 3 || day === 6) {
    if (hour < 12) return `Good morning, ${name} ☀️`
    if (hour < 17) return `Good afternoon, ${name} 🔥`
    return `Good evening, ${name} 🌙`
  }

  const motivational = [
    `Stay sharp, ${name} 💪`,
    `Let's build today, ${name} 🚀`,
    `Focus mode: ON, ${name} ⚡`,
    `Crush your goals, ${name} 🎯`
  ]
  return motivational[day % motivational.length]
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
  const [logOpen, setLogOpen] = useState(false)
  const [avatarOpen, setAvatarOpen] = useState(false)
  const [saving, setSaving] = useState(false)
  const [skill, setSkill] = useState('Coding')
  const [minutes, setMinutes] = useState(60)
  const [note, setNote] = useState('')
  const [error, setError] = useState<string | null>(null)
  const avatarRef = useRef<HTMLDivElement>(null)

  const displayName = profile?.username ?? user?.email?.split('@')[0] ?? 'User'

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
      skill_name: skill,
      duration_mins: minutes,
      notes: note.trim() || undefined,
    })
    setSaving(false)
    if (error) { setError(error.message); return }
    setLogOpen(false)
    setNote('')
    onSessionLogged?.()
  }

  async function handleSignOut() {
    console.log('[Topbar] logout clicked')
    setAvatarOpen(false)
    await signOut()
  }

  const greeting = getGreeting(displayName)

  return (
    <>
      <header
        className="sticky top-0 z-20 w-full h-[68px] bg-[#E8EAF0] flex items-center px-6 gap-4"
        style={{
          boxShadow: "0 4px 12px #C5C8D6",
        }}
      >
        {/* Greeting */}
        <div className="flex-1 min-w-0 flex flex-col justify-center">
          <h1 className="text-sm font-bold text-[#3B3F5C] whitespace-nowrap overflow-hidden text-ellipsis leading-tight">
            {greeting}
          </h1>
          <p className="text-xs font-medium text-[#7B80A0] whitespace-nowrap overflow-hidden text-ellipsis">{formatDate()}</p>
        </div>

        {/* Right actions */}
        <div className="flex items-center gap-3">
          {/* Search */}
          <button
            onClick={() => console.log("search clicked")}
            className="flex items-center gap-2 px-3 py-2 rounded-[10px] bg-[#E8EAF0] shadow-neu-sm hover:shadow-neu-inset transition-all duration-200 text-[#7B80A0] hover:text-[#3B3F5C] shrink-0"
            aria-label="Search"
          >
            <Search size={16} />
            <span className="hidden sm:inline text-xs font-semibold">Search…</span>
          </button>

          <ThemeToggle />

          {/* Notifications */}
          <button
            onClick={() => console.log("notifications clicked")}
            className="flex items-center justify-center w-9 h-9 rounded-[10px] bg-[#E8EAF0] shadow-neu-sm hover:shadow-neu-inset transition-all duration-200 text-[#7B80A0] hover:text-[#3B3F5C] shrink-0"
            aria-label="Notifications"
          >
            <Bell size={16} />
          </button>

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
              <Avatar src={profile?.avatar_url} name={displayName} size="sm" />
              <ChevronDown size={12} className="text-[#7B80A0]" />
            </button>
            {avatarOpen && (
              <div
                className="absolute right-0 top-12 bg-[#E8EAF0] rounded-[18px] shadow-neu-lg min-w-[180px] py-1.5 z-50"
              >
                <div className="px-3 py-2.5">
                  <p className="text-xs font-bold text-[#3B3F5C] truncate">{displayName}</p>
                  <p className="text-[10px] text-[#A8ABBE] truncate pt-0.5">{user?.email}</p>
                </div>
                <div className="mx-2 my-1 h-px bg-[#E8EAF0]" style={{ boxShadow: "inset 1px 1px 3px #C5C8D6, inset -1px -1px 3px #FFFFFF" }} />
                <Link
                  href="/profile"
                  onClick={() => setAvatarOpen(false)}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#3B3F5C] hover:bg-[#E8EAF0] rounded-xl mx-0 transition-all"
                  style={{ margin: "0 4px", width: "calc(100% - 8px)" }}
                >
                  <UserIcon size={13} />
                  Edit Profile
                </Link>
                <button
                  onClick={handleSignOut}
                  className="w-full flex items-center gap-2 px-3 py-2 text-xs font-semibold text-[#F07A7A] hover:text-[#E05A5A] rounded-xl transition-all"
                  style={{ margin: "0 4px", width: "calc(100% - 8px)" }}
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
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-1.5">Skill</label>
            <select
              value={skill}
              onChange={(e) => setSkill(e.target.value)}
              className="neu-input w-full px-3 py-2.5 text-sm text-[#3B3F5C] font-semibold appearance-none cursor-pointer"
            >
              {SKILLS.map((s) => <option key={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-1.5">
              Duration (minutes)
            </label>
            <input
              type="number"
              min={5}
              max={480}
              step={5}
              value={minutes}
              onChange={(e) => setMinutes(Number(e.target.value))}
              className="neu-input w-full px-3 py-2.5 text-sm text-[#3B3F5C] font-semibold"
            />
          </div>
          <div>
            <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-1.5">
              Note (optional)
            </label>
            <textarea
              rows={2}
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="What did you work on?"
              className="neu-input w-full px-3 py-2.5 text-sm text-[#3B3F5C] placeholder:text-[#A8ABBE] resize-none"
            />
          </div>
          {error && (
            <div
              className="bg-[#E8EAF0] shadow-neu-sm text-[#F07A7A] text-xs font-semibold rounded-xl px-3 py-2.5"
            >
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

"use client"

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { updateProfile, checkUsernameAvailable, uploadAvatar, createProfile } from '@/lib/queries'
import { Avatar } from '@/components/ui/Avatar'
import { Button } from '@/components/ui/Button'
import { CheckCircle2, XCircle, Loader2, Upload, Save } from 'lucide-react'
import { clsx } from 'clsx'

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f8fafc',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=f8fafc',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Jude&backgroundColor=f8fafc',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Leo&backgroundColor=f8fafc',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Mia&backgroundColor=f8fafc',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Zara&backgroundColor=f8fafc',
]

export default function ProfilePage() {
  const { user, profile, loading: authLoading, refreshProfile } = useAuth()

  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [customFile, setCustomFile] = useState<File | null>(null)
  const [customPreview, setCustomPreview] = useState<string | null>(null)

  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null)

  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '')
      setAvatarUrl(profile.avatar_url ?? null)
    }
  }, [profile])

  useEffect(() => {
    if (!username || username === profile?.username) {
      setIsUsernameAvailable(null)
      setIsCheckingUsername(false)
      return
    }

    const clean = username.toLowerCase().replace(/[^a-z0-9_]/g, '')
    if (clean !== username) {
      setUsername(clean)
      return
    }

    if (clean.length < 3) {
      setIsUsernameAvailable(null)
      return
    }

    setIsCheckingUsername(true)
    const timeout = setTimeout(async () => {
      const available = await checkUsernameAvailable(clean)
      setIsUsernameAvailable(available)
      setIsCheckingUsername(false)
    }, 400)

    return () => clearTimeout(timeout)
  }, [username, profile?.username])

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (!file) return
    if (file.size > 2 * 1024 * 1024) {
      setError('Image must be less than 2MB.')
      return
    }
    setCustomFile(file)
    setCustomPreview(URL.createObjectURL(file))
    setAvatarUrl(null)
    setError(null)
  }

  function selectPreset(url: string) {
    setAvatarUrl(url)
    setCustomFile(null)
    setCustomPreview(null)
  }

  async function handleSave() {
    if (!user) return
    setError(null)
    setSaved(false)

    if (username.length < 3) {
      setError('Username must be at least 3 characters.')
      return
    }
    if (username !== profile?.username && isUsernameAvailable === false) {
      setError('That username is taken.')
      return
    }

    setSaving(true)

    let finalAvatarUrl = avatarUrl

    if (customFile) {
      const { url, error: uploadErr } = await uploadAvatar(user.id, customFile)
      if (uploadErr) {
        setError('Failed to upload avatar: ' + uploadErr.message)
        setSaving(false)
        return
      }
      finalAvatarUrl = url
    }

    const updates: Record<string, string | null> = {}
    if (username !== profile?.username) updates.username = username
    if (finalAvatarUrl !== profile?.avatar_url) updates.avatar_url = finalAvatarUrl

    if (Object.keys(updates).length === 0 && profile) {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return
    }

    let updateErr = null;
    
    if (!profile) {
      const { error } = await createProfile(user.id, username, finalAvatarUrl)
      updateErr = error
    } else {
      const { error } = await updateProfile(user.id, updates)
      updateErr = error
    }
    
    setSaving(false)

    if (updateErr) {
      setError('Failed to save: ' + updateErr.message)
      return
    }

    await refreshProfile()
    setCustomFile(null)
    setCustomPreview(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (authLoading) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <Loader2 size={24} className="animate-spin text-[#7B80A0] mx-auto" />
        <p className="text-sm font-semibold text-[#7B80A0] mt-3">Loading profile…</p>
      </div>
    )
  }

  if (!profile) {
    // Form still renders below with a creation notice
  }

  const currentAvatarDisplay = customPreview ?? avatarUrl

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-[22px] font-[900] text-[#3B3F5C] tracking-[-0.03em]">Edit Profile</h2>
        <p className="text-[13px] font-medium text-[#7B80A0] mt-0.5">Manage your GrindSpace identity</p>
      </div>

      {!profile && !authLoading && (
        <div className="bg-[#E8EAF0] shadow-neu-sm text-[#F7A97C] px-4 py-3 rounded-[18px] text-sm font-bold">
          Profile not found — create one by entering your username and saving below.
        </div>
      )}

      <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-6 space-y-6">

        {/* Avatar Section */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-3">Avatar</label>
          <div className="flex items-center gap-5">
            <Avatar src={currentAvatarDisplay} name={username} size="xl" />

            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className="w-9 h-9 rounded-full overflow-hidden shrink-0 select-none transition-all"
                    style={{
                      boxShadow: avatarUrl === preset && !customPreview
                        ? "4px 4px 10px rgba(92,81,224,0.3), -2px -2px 6px rgba(255,255,255,0.6)"
                        : "3px 3px 8px #C5C8D6, -3px -3px 8px #FFFFFF",
                      transform: avatarUrl === preset && !customPreview ? "scale(1.12)" : undefined,
                      opacity: avatarUrl === preset && !customPreview ? 1 : 0.6,
                    }}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}

                <div className="w-px h-5 bg-[#E8EAF0] mx-0.5 shrink-0" style={{ boxShadow: "inset 1px 1px 2px #C5C8D6, inset -1px -1px 2px #FFFFFF" }} />

                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  className="flex items-center justify-center w-9 h-9 rounded-full shrink-0 transition-all text-[#7B80A0]"
                  style={{
                    boxShadow: customPreview
                      ? "4px 4px 10px rgba(92,81,224,0.3), -2px -2px 6px rgba(255,255,255,0.6)"
                      : "inset 3px 3px 8px #C5C8D6, inset -3px -3px 8px #FFFFFF",
                    background: "#E8EAF0",
                    overflow: customPreview ? "hidden" : undefined,
                    transform: customPreview ? "scale(1.12)" : undefined,
                  }}
                >
                  {customPreview ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={customPreview} alt="custom" className="w-full h-full object-cover" />
                  ) : (
                    <Upload size={13} />
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-1.5">Username</label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={20}
              className="neu-input w-full px-3 py-2.5 pr-10 text-sm font-semibold text-[#3B3F5C]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCheckingUsername ? (
                <Loader2 size={15} className="animate-spin text-[#A8ABBE]" />
              ) : isUsernameAvailable === true ? (
                <CheckCircle2 size={15} className="text-[#5EC8A0]" />
              ) : isUsernameAvailable === false ? (
                <XCircle size={15} className="text-[#F07A7A]" />
              ) : null}
            </div>
          </div>
          {isUsernameAvailable === false && (
            <p className="text-[10px] text-[#F07A7A] mt-1 font-bold">Username already taken</p>
          )}
          {isUsernameAvailable === true && (
            <p className="text-[10px] text-[#5EC8A0] mt-1 font-bold">Username available</p>
          )}
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-1.5">Email</label>
          <input
            type="email"
            value={user?.email ?? ''}
            readOnly
            className="neu-input w-full px-3 py-2.5 text-sm text-[#A8ABBE] font-semibold cursor-not-allowed"
          />
        </div>

        {error && (
          <div className="bg-[#E8EAF0] shadow-neu-sm text-[#F07A7A] text-xs font-semibold rounded-xl px-3 py-2.5">
            {error}
          </div>
        )}

        <Button
          onClick={handleSave}
          className="w-full justify-center gap-2"
          disabled={saving || isCheckingUsername || isUsernameAvailable === false}
        >
          {saving ? (
            <>
              <Loader2 size={14} className="animate-spin" />
              Saving…
            </>
          ) : saved ? (
            <>
              <CheckCircle2 size={14} />
              Saved!
            </>
          ) : (
            <>
              <Save size={14} />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}

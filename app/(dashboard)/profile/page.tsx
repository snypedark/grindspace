"use client"

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '@/lib/AuthContext'
import { updateProfile, checkUsernameAvailable, uploadAvatar } from '@/lib/queries'
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
  const { user, profile, refreshProfile } = useAuth()

  // Form state
  const [username, setUsername] = useState('')
  const [avatarUrl, setAvatarUrl] = useState<string | null>(null)
  const [customFile, setCustomFile] = useState<File | null>(null)
  const [customPreview, setCustomPreview] = useState<string | null>(null)

  // Validation state
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null)

  // UI state
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // Initialize form from profile
  useEffect(() => {
    if (profile) {
      setUsername(profile.username ?? '')
      setAvatarUrl(profile.avatar_url ?? null)
    }
  }, [profile])

  // Debounced username check
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

    // Validate username
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

    // Upload custom file if selected
    if (customFile) {
      const { url, error: uploadErr } = await uploadAvatar(user.id, customFile)
      if (uploadErr) {
        setError('Failed to upload avatar: ' + uploadErr.message)
        setSaving(false)
        return
      }
      finalAvatarUrl = url
    }

    // Build update payload — only include changed fields
    const updates: Record<string, string | null> = {}
    if (username !== profile?.username) updates.username = username
    if (finalAvatarUrl !== profile?.avatar_url) updates.avatar_url = finalAvatarUrl

    if (Object.keys(updates).length === 0) {
      setSaving(false)
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
      return
    }

    const { error: updateErr } = await updateProfile(user.id, updates)
    setSaving(false)

    if (updateErr) {
      setError('Failed to save: ' + updateErr.message)
      return
    }

    // Sync profile to AuthContext so Topbar updates instantly
    await refreshProfile()
    setCustomFile(null)
    setCustomPreview(null)
    setSaved(true)
    setTimeout(() => setSaved(false), 2000)
  }

  if (!profile) {
    return (
      <div className="max-w-xl mx-auto py-12 text-center">
        <Loader2 size={24} className="animate-spin text-text-secondary mx-auto" />
        <p className="text-sm text-text-secondary mt-3">Loading profile…</p>
      </div>
    )
  }

  const currentAvatarDisplay = customPreview ?? avatarUrl

  return (
    <div className="max-w-xl mx-auto space-y-6">
      <div>
        <h2 className="text-xl font-bold text-text-primary">Edit Profile</h2>
        <p className="text-sm text-text-secondary mt-0.5">Manage your GrindSpace identity</p>
      </div>

      <div className="bg-white rounded-2xl border border-border shadow-card p-6 space-y-6">

        {/* Avatar Section */}
        <div>
          <label className="block text-xs font-medium text-text-primary mb-3">Avatar</label>
          <div className="flex items-center gap-5">
            {/* Current Preview */}
            <Avatar src={currentAvatarDisplay} name={username} size="xl" />

            {/* Presets + Upload */}
            <div className="flex-1 min-w-0">
              <div className="flex flex-wrap items-center gap-2.5">
                {AVATAR_PRESETS.map((preset) => (
                  <button
                    key={preset}
                    type="button"
                    onClick={() => selectPreset(preset)}
                    className={clsx(
                      "w-9 h-9 rounded-full overflow-hidden border-2 shrink-0 select-none transition-all",
                      avatarUrl === preset && !customPreview
                        ? "border-accent scale-110"
                        : "border-transparent opacity-60 hover:opacity-100 hover:scale-105"
                    )}
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src={preset} alt="preset" className="w-full h-full object-cover" />
                  </button>
                ))}

                <div className="w-px h-5 bg-border mx-0.5 shrink-0" />

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
                  className={clsx(
                    "flex items-center justify-center w-9 h-9 rounded-full border-2 border-dashed shrink-0 transition-all",
                    customPreview
                      ? "border-accent scale-110 overflow-hidden"
                      : "border-border hover:border-text-secondary text-text-secondary bg-surface"
                  )}
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
          <label className="block text-xs font-medium text-text-primary mb-1.5">Username</label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              minLength={3}
              maxLength={20}
              className={clsx(
                "w-full border rounded-xl px-3 py-2.5 pr-10 text-sm bg-white placeholder:text-text-secondary focus:outline-none focus:ring-2 transition-all duration-150",
                isUsernameAvailable === false
                  ? "border-red-300 focus:ring-red-500"
                  : isUsernameAvailable === true
                    ? "border-emerald-300 focus:ring-emerald-500"
                    : "border-border focus:ring-accent"
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2">
              {isCheckingUsername ? (
                <Loader2 size={15} className="animate-spin text-text-secondary" />
              ) : isUsernameAvailable === true ? (
                <CheckCircle2 size={15} className="text-emerald-500" />
              ) : isUsernameAvailable === false ? (
                <XCircle size={15} className="text-red-500" />
              ) : null}
            </div>
          </div>
          {isUsernameAvailable === false && (
            <p className="text-[10px] text-red-500 mt-1 font-medium">Username already taken</p>
          )}
          {isUsernameAvailable === true && (
            <p className="text-[10px] text-emerald-500 mt-1 font-medium">Username available</p>
          )}
        </div>

        {/* Email (read-only) */}
        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">Email</label>
          <input
            type="email"
            value={user?.email ?? ''}
            readOnly
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text-secondary bg-gray-50 cursor-not-allowed"
          />
        </div>

        {/* Error */}
        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-3 py-2.5">
            {error}
          </div>
        )}

        {/* Save */}
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

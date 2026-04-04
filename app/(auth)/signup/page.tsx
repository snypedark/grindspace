"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth'
import { checkUsernameAvailable, createProfile, uploadAvatar } from '@/lib/queries'
import { Button } from '@/components/ui/Button'
import { Eye, EyeOff, CheckCircle2, XCircle, Upload, Loader2, User as UserIcon } from 'lucide-react'
import { clsx } from 'clsx'

const AVATAR_PRESETS = [
  'https://api.dicebear.com/7.x/notionists/svg?seed=Felix&backgroundColor=f8fafc',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Aneka&backgroundColor=f8fafc',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Jude&backgroundColor=f8fafc',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Leo&backgroundColor=f8fafc',
  'https://api.dicebear.com/7.x/notionists/svg?seed=Mia&backgroundColor=f8fafc',
]

export default function SignupPage() {
  const router = useRouter()
  
  // Form State
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  
  // UI State
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  // Username Validation State
  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  
  // Avatar State
  const [selectedPreset, setSelectedPreset] = useState<string | null>(AVATAR_PRESETS[0])
  const [customAvatarFile, setCustomAvatarFile] = useState<File | null>(null)
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  // ─── Username Debounce Validation ───
  useEffect(() => {
    if (!username) {
      setIsUsernameAvailable(null)
      setIsCheckingUsername(false)
      return
    }
    
    // Clean string: lowercase, alphanumeric and underscores only
    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '')
    if (cleanUsername !== username) {
      setUsername(cleanUsername)
      return
    }

    setIsCheckingUsername(true)
    const timeoutId = setTimeout(async () => {
      const available = await checkUsernameAvailable(cleanUsername)
      setIsUsernameAvailable(available)
      setIsCheckingUsername(false)
    }, 400) // 400ms debounce

    return () => clearTimeout(timeoutId)
  }, [username])

  // ─── Handlers ───
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0]
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        setError('Image must be less than 2MB.')
        return
      }
      setCustomAvatarFile(file)
      setSelectedPreset(null)
      setCustomAvatarPreview(URL.createObjectURL(file))
      setError(null)
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (!username || isUsernameAvailable === false) {
      setError('Please choose a valid and available username.')
      return
    }

    setLoading(true)

    // 1. Sign up user via Supabase Auth
    const { data: authData, error: authError } = await signUp(email, password)
    
    if (authError || !authData?.user) {
      setError(authError?.message ?? 'Failed to create account. Please try again.')
      setLoading(false)
      return
    }

    const userId = authData.user.id
    let finalAvatarUrl: string | null = selectedPreset

    // 2. Upload custom avatar if exists
    if (customAvatarFile) {
      const { url, error: uploadErr } = await uploadAvatar(userId, customAvatarFile)
      if (uploadErr) {
        console.error('Avatar upload failed:', uploadErr)
      } else if (url) {
        finalAvatarUrl = url
      }
    }

    // 3. Insert into profiles table
    const { error: profileError } = await createProfile(userId, username, finalAvatarUrl)

    setLoading(false)

    if (profileError) {
      // In a robust system, we might delete the auth user here if profile fails
      // For now, we show the error.
      setError('Account created, but failed to setup profile: ' + profileError.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 text-center">
        <div className="text-3xl mb-3">📬</div>
        <h2 className="text-base font-bold text-text-primary mb-1">Welcome aboard, {username}!</h2>
        <p className="text-sm text-text-secondary">
          We sent a confirmation link to <span className="font-medium text-text-primary">{email}</span>.
          Click it to verify your account and ignite your streak.
        </p>
        <Link
          href="/login"
          className="block mt-6 px-4 py-2 bg-accent text-white font-medium rounded-xl hover:bg-accent-light hover:text-accent transition-colors text-sm"
        >
          Go to login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-6">
      <h1 className="text-lg font-bold text-text-primary mb-1">Create account</h1>
      <p className="text-sm text-text-secondary mb-6">Start tracking your grind today</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Username */}
        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Username
          </label>
          <div className="relative">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="e.g. kunal_dev"
              required
              minLength={3}
              maxLength={20}
              className={clsx(
                "w-full border rounded-xl px-3 py-2.5 pr-10 text-sm bg-white placeholder:text-text-secondary focus:outline-none focus:ring-2 transition-all duration-150",
                isUsernameAvailable === false 
                  ? "border-red-300 focus:ring-red-500 text-red-900" 
                  : isUsernameAvailable === true
                    ? "border-emerald-300 focus:ring-emerald-500 text-text-primary"
                    : "border-border focus:ring-accent text-text-primary"
              )}
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {isCheckingUsername ? (
                <Loader2 size={16} className="animate-spin text-text-secondary" />
              ) : isUsernameAvailable === true ? (
                <CheckCircle2 size={16} className="text-emerald-500" />
              ) : isUsernameAvailable === false ? (
                <XCircle size={16} className="text-red-500" />
              ) : null}
            </div>
          </div>
          {isUsernameAvailable === false && (
            <p className="text-[10px] text-red-500 mt-1 font-medium">Username already taken</p>
          )}
          {isUsernameAvailable === true && (
            <p className="text-[10px] text-emerald-500 mt-1 font-medium">Username available!</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary bg-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-150"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              className="w-full border border-border rounded-xl px-3 py-2.5 pr-10 text-sm text-text-primary bg-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-150"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-secondary hover:text-text-primary transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Avatar Selection */}
        <div>
          <label className="block text-xs font-medium text-text-primary mb-2">
            Choose Avatar
          </label>
          <div className="flex flex-wrap items-center gap-3">
            {AVATAR_PRESETS.map((preset) => (
              <button
                key={preset}
                type="button"
                onClick={() => {
                  setSelectedPreset(preset)
                  setCustomAvatarFile(null)
                  setCustomAvatarPreview(null)
                }}
                className={clsx(
                  "w-10 h-10 rounded-full overflow-hidden border-2 transition-all duration-200 shrink-0 select-none",
                  selectedPreset === preset 
                    ? "border-accent scale-110 shadow-sm" 
                    : "border-transparent hover:scale-105 opacity-70 hover:opacity-100"
                )}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preset} alt="preset" className="w-full h-full object-cover" />
              </button>
            ))}
            
            <div className="w-px h-6 bg-border mx-1 shrink-0" />
            
            {/* Custom Upload */}
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
                "relative flex items-center justify-center w-10 h-10 rounded-full border-2 border-dashed transition-all duration-200 shrink-0",
                customAvatarPreview 
                  ? "border-accent scale-110 shadow-sm overflow-hidden" 
                  : "border-border hover:border-text-secondary text-text-secondary bg-surface"
              )}
            >
              {customAvatarPreview ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={customAvatarPreview} alt="uploaded" className="w-full h-full object-cover" />
              ) : (
                <Upload size={14} />
              )}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-3 py-2.5">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full justify-center mt-2"
          disabled={loading || isCheckingUsername || isUsernameAvailable === false}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-xs text-text-secondary mt-5">
        Already have an account?{' '}
        <Link href="/login" className="text-accent font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

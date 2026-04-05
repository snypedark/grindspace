"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth'
import { checkUsernameAvailable, uploadAvatar, updateProfile } from '@/lib/queries'
import { Button } from '@/components/ui/Button'
import { Eye, EyeOff, CheckCircle2, XCircle, Upload, Loader2 } from 'lucide-react'
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
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  const [isUsernameAvailable, setIsUsernameAvailable] = useState<boolean | null>(null)
  const [isCheckingUsername, setIsCheckingUsername] = useState(false)
  
  const [selectedPreset, setSelectedPreset] = useState<string | null>(AVATAR_PRESETS[0])
  const [customAvatarFile, setCustomAvatarFile] = useState<File | null>(null)
  const [customAvatarPreview, setCustomAvatarPreview] = useState<string | null>(null)

  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (!username) {
      setIsUsernameAvailable(null)
      setIsCheckingUsername(false)
      return
    }
    
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
    }, 400)

    return () => clearTimeout(timeoutId)
  }, [username])

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

    const { data: authData, error: authError } = await signUp(email, password, username, username)
    
    if (authError || !authData?.user) {
      setError(authError?.message ?? 'Failed to create account. Please try again.')
      setLoading(false)
      return
    }

    const userId = authData.user.id

    // DB trigger creates profile automatically.
    // If they picked a custom avatar or an explicit preset, update it now.
    if (customAvatarFile || selectedPreset) {
      let finalAvatarUrl: string | null = selectedPreset
      
      if (customAvatarFile) {
        const { url, error: uploadErr } = await uploadAvatar(userId, customAvatarFile)
        if (uploadErr) {
          console.error('Avatar upload failed:', uploadErr)
        } else if (url) {
          finalAvatarUrl = url
        }
      }

      await updateProfile(userId, { avatar_url: finalAvatarUrl })
    }

    setLoading(false)

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-6 text-center">
        <div className="text-3xl mb-3">📬</div>
        <h2 className="text-base font-[900] text-[#3B3F5C] mb-1">Welcome aboard, {username}!</h2>
        <p className="text-sm font-medium text-[#7B80A0]">
          We sent a confirmation link to <span className="font-bold text-[#3B3F5C]">{email}</span>.
          Click it to verify your account and ignite your streak.
        </p>
        <Link
          href="/login"
          className="block mt-6 px-4 py-2.5 rounded-xl text-sm font-bold text-white"
          style={{
            background: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)",
            boxShadow: "5px 5px 14px rgba(92,81,224,0.35), -2px -2px 6px rgba(255,255,255,0.6)",
          }}
        >
          Go to login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-6">
      <h1 className="text-lg font-[900] text-[#3B3F5C] mb-1 tracking-[-0.03em]">Create account</h1>
      <p className="text-sm font-medium text-[#7B80A0] mb-6">Start tracking your grind today</p>

      <form onSubmit={handleSubmit} className="space-y-4">
        
        {/* Username */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-1.5">
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
              className="neu-input w-full px-3 py-2.5 pr-10 text-sm font-semibold text-[#3B3F5C] placeholder:text-[#A8ABBE]"
            />
            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center">
              {isCheckingUsername ? (
                <Loader2 size={16} className="animate-spin text-[#A8ABBE]" />
              ) : isUsernameAvailable === true ? (
                <CheckCircle2 size={16} className="text-[#5EC8A0]" />
              ) : isUsernameAvailable === false ? (
                <XCircle size={16} className="text-[#F07A7A]" />
              ) : null}
            </div>
          </div>
          {isUsernameAvailable === false && (
            <p className="text-[10px] text-[#F07A7A] mt-1 font-bold">Username already taken</p>
          )}
          {isUsernameAvailable === true && (
            <p className="text-[10px] text-[#5EC8A0] mt-1 font-bold">Username available!</p>
          )}
        </div>

        {/* Email */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-1.5">
            Email
          </label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            required
            className="neu-input w-full px-3 py-2.5 text-sm font-semibold text-[#3B3F5C] placeholder:text-[#A8ABBE]"
          />
        </div>

        {/* Password */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Min. 6 characters"
              required
              className="neu-input w-full px-3 py-2.5 pr-10 text-sm font-semibold text-[#3B3F5C] placeholder:text-[#A8ABBE]"
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#A8ABBE] hover:text-[#3B3F5C] transition-colors"
            >
              {showPassword ? <EyeOff size={15} /> : <Eye size={15} />}
            </button>
          </div>
        </div>

        {/* Avatar Selection */}
        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-2.5">
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
                className="w-10 h-10 rounded-full overflow-hidden shrink-0 select-none transition-all duration-200"
                style={{
                  boxShadow: selectedPreset === preset
                    ? "4px 4px 10px rgba(92,81,224,0.3), -2px -2px 6px rgba(255,255,255,0.6)"
                    : "3px 3px 8px #C5C8D6, -3px -3px 8px #FFFFFF",
                  transform: selectedPreset === preset ? "scale(1.12)" : undefined,
                  opacity: selectedPreset === preset ? 1 : 0.7,
                }}
              >
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={preset} alt="preset" className="w-full h-full object-cover" />
              </button>
            ))}
            
            <div className="w-px h-6 bg-[#E8EAF0] mx-0.5 shrink-0" style={{ boxShadow: "inset 1px 1px 2px #C5C8D6, inset -1px -1px 2px #FFFFFF" }} />
            
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
              className="relative flex items-center justify-center w-10 h-10 rounded-full shrink-0 transition-all duration-200 text-[#7B80A0]"
              style={{
                boxShadow: customAvatarPreview
                  ? "4px 4px 10px rgba(92,81,224,0.3), -2px -2px 6px rgba(255,255,255,0.6)"
                  : "inset 3px 3px 8px #C5C8D6, inset -3px -3px 8px #FFFFFF",
                background: "#E8EAF0",
                overflow: customAvatarPreview ? "hidden" : undefined,
                transform: customAvatarPreview ? "scale(1.12)" : undefined,
              }}
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
          <div className="bg-[#E8EAF0] shadow-neu-sm text-[#F07A7A] text-xs font-semibold rounded-xl px-3 py-2.5">
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

      <p className="text-center text-xs font-semibold text-[#7B80A0] mt-5">
        Already have an account?{' '}
        <Link href="/login" className="bg-gradient-to-br from-[#9D93F9] to-[#5B51E0] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          Sign in
        </Link>
      </p>
    </div>
  )
}

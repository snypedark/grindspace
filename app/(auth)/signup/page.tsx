"use client"

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth'

import { Button } from '@/components/ui/Button'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [username, setUsername] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    if (!username) {
      setError('Please choose a username.')
      return
    }

    setLoading(true)

    const { data: authData, error: authError } = await signUp(email, password, username, username)
    
    if (authError || !authData?.user) {
      setError(authError?.message ?? 'Failed to create account. Please try again.')
      setLoading(false)
      return
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
          </div>
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

        {error && (
          <div className="bg-[#E8EAF0] shadow-neu-sm text-[#F07A7A] text-xs font-semibold rounded-xl px-3 py-2.5">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full justify-center mt-2"
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </Button>

        <div className="relative flex items-center py-2">
          <div className="flex-grow border-t border-[#C5C8D6] opacity-30"></div>
          <span className="flex-shrink-0 mx-4 text-xs font-bold text-[#A8ABBE] uppercase tracking-wider">or</span>
          <div className="flex-grow border-t border-[#C5C8D6] opacity-30"></div>
        </div>

        <button
          type="button"
          onClick={async () => {
             setLoading(true)
             const { signInWithGoogle } = await import('@/lib/auth')
             await signInWithGoogle()
             setLoading(false)
          }}
          disabled={loading}
          className="neu-button-ghost w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-bold text-[#3B3F5C] rounded-xl transition-all"
        >
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
          </svg>
          Continue with Google
        </button>
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

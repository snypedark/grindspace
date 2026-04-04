"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signIn } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setLoading(true)

    const { error } = await signIn(email, password)
    if (error) {
      setError(error.message)
      setLoading(false)
      return
    }

    router.push('/')
    router.refresh()
  }

  return (
    <div className="bg-[#E8EAF0] rounded-[18px] shadow-neu p-6">
      <h1 className="text-lg font-[900] text-[#3B3F5C] mb-1 tracking-[-0.03em]">Welcome back</h1>
      <p className="text-sm font-medium text-[#7B80A0] mb-6">Sign in to continue your grind</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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
            className="neu-input w-full px-3 py-2.5 text-sm text-[#3B3F5C] font-semibold placeholder:text-[#A8ABBE]"
          />
        </div>

        <div>
          <label className="block text-[10px] font-bold uppercase tracking-[0.1em] text-[#A8ABBE] mb-1.5">
            Password
          </label>
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              className="neu-input w-full px-3 py-2.5 pr-10 text-sm text-[#3B3F5C] font-semibold placeholder:text-[#A8ABBE]"
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
          className="w-full justify-center"
          disabled={loading}
        >
          {loading ? 'Signing in…' : 'Sign in'}
        </Button>
      </form>

      <p className="text-center text-xs font-semibold text-[#7B80A0] mt-5">
        Don&apos;t have an account?{' '}
        <Link href="/signup" className="bg-gradient-to-br from-[#9D93F9] to-[#5B51E0] bg-clip-text text-transparent hover:opacity-80 transition-opacity">
          Sign up
        </Link>
      </p>
    </div>
  )
}

"use client"

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { signUp } from '@/lib/auth'
import { Button } from '@/components/ui/Button'
import { Eye, EyeOff } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (password !== confirm) {
      setError('Passwords do not match.')
      return
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters.')
      return
    }

    setLoading(true)
    const { error } = await signUp(email, password)
    setLoading(false)

    if (error) {
      setError(error.message)
      return
    }

    setSuccess(true)
  }

  if (success) {
    return (
      <div className="bg-white rounded-2xl border border-border shadow-card p-6 text-center">
        <div className="text-3xl mb-3">📬</div>
        <h2 className="text-base font-bold text-text-primary mb-1">Check your email</h2>
        <p className="text-sm text-text-secondary">
          We sent a confirmation link to <span className="font-medium text-text-primary">{email}</span>.
          Click it to activate your account.
        </p>
        <Link
          href="/login"
          className="block mt-4 text-xs text-accent font-medium hover:underline"
        >
          Back to login
        </Link>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-2xl border border-border shadow-card p-6">
      <h1 className="text-lg font-bold text-text-primary mb-1">Create account</h1>
      <p className="text-sm text-text-secondary mb-6">Start tracking your grind today</p>

      <form onSubmit={handleSubmit} className="space-y-4">
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

        <div>
          <label className="block text-xs font-medium text-text-primary mb-1.5">
            Confirm password
          </label>
          <input
            type="password"
            value={confirm}
            onChange={(e) => setConfirm(e.target.value)}
            placeholder="Repeat password"
            required
            className="w-full border border-border rounded-xl px-3 py-2.5 text-sm text-text-primary bg-white placeholder:text-text-secondary focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-150"
          />
        </div>

        {error && (
          <div className="bg-red-50 border border-red-100 text-red-600 text-xs rounded-xl px-3 py-2.5">
            {error}
          </div>
        )}

        <Button
          type="submit"
          className="w-full justify-center"
          disabled={loading}
        >
          {loading ? 'Creating account…' : 'Create account'}
        </Button>
      </form>

      <p className="text-center text-xs text-text-secondary mt-4">
        Already have an account?{' '}
        <Link href="/login" className="text-accent font-medium hover:underline">
          Sign in
        </Link>
      </p>
    </div>
  )
}

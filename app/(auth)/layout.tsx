import { Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-surface flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2 mb-8">
          <div className="flex items-center justify-center w-9 h-9 bg-accent rounded-xl">
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-bold text-text-primary text-lg tracking-tight">
            GrindSpace
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

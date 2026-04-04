import { Zap } from 'lucide-react'
import { ReactNode } from 'react'

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-[#E8EAF0] flex items-center justify-center p-4">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex items-center justify-center gap-2.5 mb-8">
          <div
            className="flex items-center justify-center w-10 h-10 rounded-xl"
            style={{
              background: "linear-gradient(135deg, #9D93F9, #7C6FF7, #5B51E0)",
              boxShadow: "5px 5px 14px rgba(92,81,224,0.35), -2px -2px 6px rgba(255,255,255,0.6)",
            }}
          >
            <Zap className="w-5 h-5 text-white" />
          </div>
          <span className="font-[900] text-[#3B3F5C] text-lg tracking-tight">
            GrindSpace
          </span>
        </div>
        {children}
      </div>
    </div>
  )
}

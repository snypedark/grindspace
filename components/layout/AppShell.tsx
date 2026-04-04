"use client"

import { Sidebar } from './Sidebar'
import { Topbar } from './Topbar'
import { useSidebar } from '@/lib/SidebarContext'
import { clsx } from 'clsx'
import { ReactNode, useCallback, useState } from 'react'

export function AppShell({ children }: { children: ReactNode }) {
  const { collapsed, toggle } = useSidebar()
  const [refreshKey, setRefreshKey] = useState(0)

  const handleSessionLogged = useCallback(() => {
    setRefreshKey((k) => k + 1)
  }, [])

  return (
    <div className="flex min-h-screen bg-background">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div className="flex-1 flex flex-col min-w-0 relative">
        <Topbar onSessionLogged={handleSessionLogged} />
        <main className="flex-1 overflow-y-auto">
          <div key={refreshKey} className="p-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

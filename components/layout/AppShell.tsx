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
    <div className="min-h-screen flex">
      <Sidebar collapsed={collapsed} onToggle={toggle} />
      <div
        className={clsx(
          'flex-1 flex flex-col min-h-screen',
          'transition-all duration-300 ease-smooth',
          collapsed ? 'ml-[72px]' : 'ml-[220px]'
        )}
      >
        <Topbar onSessionLogged={handleSessionLogged} />
        <main className="flex-1 pt-16 overflow-y-auto">
          <div key={refreshKey} className="px-6 py-6">
            {children}
          </div>
        </main>
      </div>
    </div>
  )
}

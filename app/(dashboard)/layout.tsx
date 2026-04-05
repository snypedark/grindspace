import { SidebarProvider } from '@/lib/SidebarContext'
import { TimerProvider } from '@/hooks/useTimer'
import { AppShell } from '@/components/layout/AppShell'
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <TimerProvider>
        <AppShell>{children}</AppShell>
      </TimerProvider>
    </SidebarProvider>
  )
}

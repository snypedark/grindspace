import { SidebarProvider } from '@/lib/SidebarContext'
import { AppShell } from '@/components/layout/AppShell'
import { ReactNode } from 'react'

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <SidebarProvider>
      <AppShell>{children}</AppShell>
    </SidebarProvider>
  )
}

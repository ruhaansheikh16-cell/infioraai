import { Outlet, createFileRoute } from '@tanstack/react-router'

import { AppShell } from '@/components/AppShell'
import { ConversationsProvider } from '@/lib/conversations'

export const Route = createFileRoute('/_app')({
  component: AppLayout,
})

function AppLayout() {
  return (
    <ConversationsProvider>
      <AppShell>
        <Outlet />
      </AppShell>
    </ConversationsProvider>
  )
}

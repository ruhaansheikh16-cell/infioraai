import { BookOpen, Globe, MessageSquare, PenLine, Settings } from 'lucide-react'

import type { Mode } from './assistant-modes'

export const NAV_ITEMS = [
  { to: '/chat', label: 'Chat', short: 'Chat', icon: MessageSquare },
  { to: '/study', label: 'Study Assistant', short: 'Study', icon: BookOpen },
  { to: '/write', label: 'Writing Assistant', short: 'Write', icon: PenLine },
  { to: '/search', label: 'Smart Search', short: 'Search', icon: Globe },
  { to: '/settings', label: 'Settings', short: 'Settings', icon: Settings },
] as const

export const ROUTE_FOR_MODE: Record<Mode, '/chat' | '/study' | '/write'> = {
  chat: '/chat',
  study: '/study',
  writing: '/write',
}

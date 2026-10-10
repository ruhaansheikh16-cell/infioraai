import { useSyncExternalStore } from 'react'

export type Theme = 'dark' | 'light'
const KEY = 'infiora-theme'
const listeners = new Set<() => void>()

function read(): Theme {
  return document.documentElement.classList.contains('light') ? 'light' : 'dark'
}

export function setTheme(t: Theme) {
  document.documentElement.classList.toggle('light', t === 'light')
  try {
    localStorage.setItem(KEY, t)
  } catch {
    // storage unavailable (private mode) – theme still applies for this visit
  }
  listeners.forEach((l) => l())
}

function subscribe(l: () => void) {
  listeners.add(l)
  return () => listeners.delete(l)
}

/** Theme preference, applied before paint by the inline script in __root.tsx. */
export function useTheme() {
  const theme = useSyncExternalStore<Theme>(subscribe, read, () => 'dark')
  return { theme, setTheme, toggle: () => setTheme(theme === 'dark' ? 'light' : 'dark') }
}

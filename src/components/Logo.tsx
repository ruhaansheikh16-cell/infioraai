import { useId } from 'react'

/**
 * Infiora mark: an open orbit (ideas in motion) around an "i" whose dot is a
 * four-point spark (intelligence).
 */
export function LogoMark({ className = 'h-9 w-9' }: { className?: string }) {
  const id = useId()
  return (
    <svg viewBox="0 0 64 64" className={className} aria-hidden="true">
      <defs>
        <linearGradient id={id} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0" stopColor="#a855f7" />
          <stop offset=".5" stopColor="#6366f1" />
          <stop offset="1" stopColor="#38bdf8" />
        </linearGradient>
      </defs>
      <rect width="64" height="64" rx="16" fill="#0b1030" />
      <g
        className="animate-orbit"
        style={{ transformOrigin: '32px 32px', transformBox: 'view-box' }}
      >
        <path
          d="M32 10a22 22 0 1 1-19.05 11"
          fill="none"
          stroke={`url(#${id})`}
          strokeWidth="4"
          strokeLinecap="round"
        />
        <circle cx="12.95" cy="21" r="3.6" fill="#38bdf8" />
      </g>
      <rect x="28" y="28" width="8" height="20" rx="4" fill={`url(#${id})`} />
      <path
        d="M32 13.5l2.2 4.8 4.8 2.2-4.8 2.2L32 27.5l-2.2-4.8-4.8-2.2 4.8-2.2z"
        fill="#fff"
      />
    </svg>
  )
}

export function Logo({ compact = false }: { compact?: boolean }) {
  return (
    <span className="inline-flex items-center gap-2.5">
      <LogoMark />
      {!compact && (
        <span className="font-display text-[1.05rem] font-semibold tracking-tight">
          Infiora <span className="text-gradient">AI</span>
        </span>
      )}
    </span>
  )
}

import { Hash, Home, PenLine, Swords, UserRound, Users, Zap } from 'lucide-react'
import type { TabId } from '../types'

const items: { id: TabId; label: string; icon: typeof Home; accent?: string }[] = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'failbooth', label: '失敗ブース', icon: Zap, accent: 'pink' },
  { id: 'challenge', label: 'チャレンジ', icon: Swords, accent: 'lime' },
  { id: 'topics', label: 'トピック', icon: Hash },
  { id: 'people', label: '人 / ツール', icon: Users },
  { id: 'profile', label: '自分', icon: UserRound },
]

interface SideNavProps {
  active: TabId
  onNavigate: (tab: TabId) => void
  onCompose: () => void
  userInitials: string
  userColor: string
  userName: string
}

export function SideNav({ active, onNavigate, onCompose, userInitials, userColor, userName }: SideNavProps) {
  return (
    <aside className="flex h-full flex-col border-r border-line/80 bg-white/70 px-3 py-5 backdrop-blur-xl">
      <div className="mb-8 flex items-center gap-2.5 px-2">
        <div className="relative flex h-10 w-10 items-center justify-center rounded-2xl bg-lime/20 ring-1 ring-lime/40">
          <span className="absolute inset-0 rounded-2xl bg-lime/30 pulse-ring" />
          <span className="relative h-3.5 w-3.5 rounded-full bg-lime glow-lime" />
        </div>
        <div>
          <div className="font-display text-xl font-extrabold tracking-tight text-ink">Pulse</div>
          <div className="text-[10px] font-semibold tracking-[0.12em] text-lime">
            社内 · AI共有
          </div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-1">
        {items.map(({ id, label, icon: Icon, accent }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? 'bg-lime text-void shadow-[0_8px_28px_-8px_rgba(143,212,0,0.65)]'
                  : 'text-muted hover:bg-line-soft hover:text-ink'
              }`}
            >
              <Icon
                className={`h-4 w-4 ${
                  isActive
                    ? 'text-void'
                    : accent === 'pink'
                      ? 'text-pink'
                      : accent === 'lime'
                        ? 'text-lime'
                        : ''
                }`}
                strokeWidth={isActive ? 2.5 : 2}
              />
              {label}
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={onCompose}
        className="mt-4 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-r from-pink to-cyan px-4 py-3 text-sm font-extrabold text-void shadow-[0_8px_32px_-8px_rgba(255,45,149,0.45)] transition hover:brightness-110"
      >
        <PenLine className="h-4 w-4" />
        投稿する
      </button>

      <div className="mt-4 flex items-center gap-3 rounded-2xl glass px-3 py-3">
        <div
          className="flex h-9 w-9 items-center justify-center rounded-full text-sm font-bold text-void"
          style={{ background: userColor }}
        >
          {userInitials}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-semibold text-ink">{userName}</div>
          <div className="text-xs text-lime">🔥 12日連続</div>
        </div>
      </div>
    </aside>
  )
}

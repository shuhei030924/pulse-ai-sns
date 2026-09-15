import { Hash, Home, PenLine, Swords, UserRound, Users, Ghost } from 'lucide-react'
import type { TabId } from '../types'

const items: { id: TabId; label: string; icon: typeof Home }[] = [
  { id: 'home', label: 'ホーム', icon: Home },
  { id: 'failbooth', label: '失敗ブース', icon: Ghost },
  { id: 'challenge', label: 'チャレンジ', icon: Swords },
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
    <aside className="flex h-full flex-col px-3 py-4">
      <div className="mb-6 flex items-center gap-2.5 px-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-ink text-[11px] font-bold text-white">
          P
        </div>
        <div>
          <div className="text-[17px] font-semibold tracking-tight text-ink">Pulse</div>
          <div className="text-[11px] text-muted">社内 · AI共有</div>
        </div>
      </div>

      <nav className="flex flex-1 flex-col gap-0.5">
        {items.map(({ id, label, icon: Icon }) => {
          const isActive = active === id
          return (
            <button
              key={id}
              type="button"
              onClick={() => onNavigate(id)}
              className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-[15px] transition ${
                isActive
                  ? 'font-semibold text-ink'
                  : 'font-normal text-ink-soft hover:bg-line-soft'
              }`}
            >
              <Icon className="h-[22px] w-[22px]" strokeWidth={isActive ? 2.4 : 1.8} />
              {label}
            </button>
          )
        })}
      </nav>

      <button
        type="button"
        onClick={onCompose}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-full bg-ink px-4 py-2.5 text-sm font-semibold text-white transition hover:bg-ink-soft"
      >
        <PenLine className="h-4 w-4" />
        投稿する
      </button>

      <div className="mt-4 flex items-center gap-2.5 px-2 py-2">
        <div
          className="flex h-8 w-8 items-center justify-center rounded-full text-xs font-semibold text-white"
          style={{ background: userColor }}
        >
          {userInitials}
        </div>
        <div className="min-w-0">
          <div className="truncate text-sm font-medium text-ink">{userName}</div>
          <div className="text-[11px] text-muted">12日連続</div>
        </div>
      </div>
    </aside>
  )
}

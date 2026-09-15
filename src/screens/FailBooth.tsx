import { useEffect, useState } from 'react'
import { Ghost, Heart, Timer } from 'lucide-react'
import type { FailBoothPost } from '../types'

interface FailBoothProps {
  posts: FailBoothPost[]
  onVibe: (id: string) => void
  onCompose: () => void
  onTick: (id: string, remaining: number) => void
}

function formatRemain(sec: number) {
  if (sec <= 0) return '消滅…'
  const h = Math.floor(sec / 3600)
  const m = Math.floor((sec % 3600) / 60)
  const s = sec % 60
  if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`
  return `${m}:${String(s).padStart(2, '0')}`
}

function BoothCard({
  post,
  onVibe,
  onTick,
}: {
  post: FailBoothPost
  onVibe: (id: string) => void
  onTick: (id: string, remaining: number) => void
}) {
  const [remain, setRemain] = useState(post.expiresInSec)

  useEffect(() => {
    setRemain(post.expiresInSec)
  }, [post.expiresInSec])

  useEffect(() => {
    const id = window.setInterval(() => {
      setRemain((r) => {
        const next = Math.max(0, r - 1)
        if (next % 5 === 0) onTick(post.id, next)
        return next
      })
    }, 1000)
    return () => window.clearInterval(id)
  }, [post.id, onTick])

  const urgent = remain < 600

  return (
    <article className="slide-up relative overflow-hidden rounded-3xl border border-pink/25 bg-gradient-to-br from-pink/10 via-white to-pink/5 p-5 shadow-[0_8px_28px_-12px_rgba(255,45,149,0.2)]">
      <div className="pointer-events-none absolute -right-6 top-0 text-7xl opacity-10">👻</div>
      <div className="flex flex-wrap items-center gap-2">
        <span className="inline-flex items-center gap-1 rounded-full bg-pink/20 px-2.5 py-0.5 text-xs font-bold text-pink">
          <Ghost className="h-3 w-3" />
          {post.alias}
        </span>
        <span className="rounded-md bg-line-soft px-2 py-0.5 text-[10px] font-bold text-muted">
          {post.tool}
        </span>
        <span className="text-xs text-faint">{post.createdAt}</span>
        {post.revealed && (
          <span className="rounded-full bg-cyan/20 px-2 py-0.5 text-[10px] font-bold text-cyan">
            REVEALED
          </span>
        )}
      </div>
      <p className="mt-3 text-[15px] leading-relaxed text-ink">{post.body}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <div
          className={`inline-flex items-center gap-1.5 rounded-full bg-line-soft px-3 py-1.5 text-xs font-bold tabular-nums ${
            urgent ? 'countdown-urgent' : 'text-lime'
          }`}
        >
          <Timer className="h-3.5 w-3.5" />
          {formatRemain(remain)}
        </div>
        <button
          type="button"
          onClick={() => onVibe(post.id)}
          className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
            post.myVibe
              ? 'bg-pink text-void react-pop glow-pink'
              : 'bg-line-soft text-muted hover:bg-pink/20 hover:text-pink'
          }`}
        >
          <Heart className={`h-3.5 w-3.5 ${post.myVibe ? 'fill-current' : ''}`} />
          あるある {post.vibes}
        </button>
      </div>
    </article>
  )
}

export function FailBooth({ posts, onVibe, onCompose, onTick }: FailBoothProps) {
  const live = posts.filter((p) => p.expiresInSec > 0)

  return (
    <div className="fade-in space-y-5">
      <header className="relative overflow-hidden rounded-3xl border border-pink/30 bg-gradient-to-br from-pink/20 via-white to-cyan/10 p-6 shadow-[0_8px_32px_-12px_rgba(255,45,149,0.25)]">
        <div className="pointer-events-none absolute -right-4 -top-4 text-8xl opacity-20">🔥</div>
        <div className="inline-flex items-center gap-1.5 text-pink">
          <Ghost className="h-4 w-4" />
          <span className="text-[10px] font-extrabold tracking-[0.2em]">FAIL BOOTH</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-ink sm:text-3xl">
          失敗ブース
        </h1>
        <p className="mt-2 max-w-xl text-sm text-muted">
          タイムリミット付きの匿名懺悔。カウントダウンが切れたら消える（または REVEAL）。通常フィードとは別空間。
        </p>
        <button
          type="button"
          onClick={onCompose}
          className="mt-4 rounded-2xl bg-pink px-4 py-2.5 text-sm font-extrabold text-void glow-pink"
        >
          匿名で懺悔する
        </button>
      </header>

      <div className="space-y-4">
        {live.map((p) => (
          <BoothCard key={p.id} post={p} onVibe={onVibe} onTick={onTick} />
        ))}
        {live.length === 0 && (
          <div className="rounded-3xl border border-dashed border-pink/30 p-12 text-center">
            <div className="text-4xl">👻</div>
            <p className="mt-3 font-display text-lg font-bold">ブースは空っぽ</p>
            <p className="mt-1 text-sm text-muted">最初の失敗談を投下して空気を変えよう</p>
          </div>
        )}
      </div>
    </div>
  )
}

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
  if (sec <= 0) return '期限切れ'
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
    <article className="px-4 py-4">
      <div className="flex flex-wrap items-center gap-x-2 gap-y-1 text-[13px]">
        <span className="inline-flex items-center gap-1 font-medium text-ink">
          <Ghost className="h-3.5 w-3.5 text-pink" />
          {post.alias}
        </span>
        <span className="text-muted">{post.tool}</span>
        <span className="text-faint">{post.createdAt}</span>
        {post.revealed && <span className="text-[12px] text-muted">延長中</span>}
      </div>
      <p className="mt-2 text-[15px] leading-[1.65] text-ink">{post.body}</p>
      <div className="mt-3 flex flex-wrap items-center gap-3 text-[13px] text-muted">
        <div className={`inline-flex items-center gap-1 tabular-nums ${urgent ? 'countdown-urgent' : ''}`}>
          <Timer className="h-3.5 w-3.5" />
          {formatRemain(remain)}
        </div>
        <button
          type="button"
          onClick={() => onVibe(post.id)}
          className={`inline-flex items-center gap-1 rounded-full px-2 py-1 transition hover:bg-line-soft ${
            post.myVibe ? 'text-pink' : 'text-muted'
          }`}
        >
          <Heart className={`h-4 w-4 ${post.myVibe ? 'fill-current' : ''}`} />
          あるある {post.vibes}
        </button>
      </div>
    </article>
  )
}

export function FailBooth({ posts, onVibe, onCompose, onTick }: FailBoothProps) {
  const live = posts.filter((p) => p.expiresInSec > 0)

  return (
    <div className="fade-in">
      <header className="border-b border-line px-4 py-4">
        <div className="flex items-center gap-1.5 text-[12px] text-muted">
          <Ghost className="h-3.5 w-3.5" />
          匿名
        </div>
        <h1 className="mt-1 text-xl font-semibold text-ink">失敗ブース</h1>
        <p className="mt-1.5 text-sm leading-relaxed text-muted">
          匿名で失敗談を書く場所です。時間切れで消えます。「あるある」がたくさんつくと、少し残ることがあります。
        </p>
        <button
          type="button"
          onClick={onCompose}
          className="mt-3 rounded-full bg-ink px-4 py-2 text-sm font-semibold text-white"
        >
          匿名で書く
        </button>
      </header>

      <div className="divide-y divide-line">
        {live.map((p) => (
          <BoothCard key={p.id} post={p} onVibe={onVibe} onTick={onTick} />
        ))}
        {live.length === 0 && (
          <div className="px-4 py-16 text-center">
            <p className="text-[15px] font-medium">いま表示中の失敗談はありません</p>
            <p className="mt-1 text-sm text-muted">よかったら1件書いてみてください</p>
          </div>
        )}
      </div>
    </div>
  )
}

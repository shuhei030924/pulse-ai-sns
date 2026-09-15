import { Swords, Zap } from 'lucide-react'
import { challengeMeta } from '../data/mock'
import type { DeptScore } from '../types'

interface ChallengeProps {
  scores: DeptScore[]
  onCheer: (id: DeptScore['id']) => void
}

export function Challenge({ scores, onCheer }: ChallengeProps) {
  const ranked = [...scores].sort((a, b) => b.points - a.points)
  const max = ranked[0]?.points ?? 1

  return (
    <div className="fade-in space-y-5">
      <header className="relative overflow-hidden rounded-3xl border border-lime/40 bg-gradient-to-br from-lime/20 via-white to-pink/10 p-6 challenge-pulse shadow-[0_8px_32px_-12px_rgba(143,212,0,0.3)]">
        <div className="flex items-center gap-2 text-lime">
          <Swords className="h-5 w-5" />
          <span className="text-[10px] font-extrabold tracking-[0.2em]">{challengeMeta.weekLabel}</span>
        </div>
        <h1 className="mt-2 font-display text-2xl font-extrabold text-ink sm:text-3xl">
          部署対抗チャレンジ
        </h1>
        <p className="mt-2 text-sm text-muted">
          {challengeMeta.title} · 締切 {challengeMeta.deadline} · あと{challengeMeta.daysLeft}日
        </p>
        <p className="mt-1 text-xs text-faint">
          投稿 +10 / 「試した」+15 / 失敗ブースの「あるある」は点数に入りません
        </p>
      </header>

      <div className="grid gap-3 sm:grid-cols-2">
        {ranked.map((d, i) => (
          <article
            key={d.id}
            className={`rounded-3xl glass-strong p-5 ${i === 0 ? 'ring-1 ring-lime/50' : ''}`}
          >
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-3">
                <span className="font-display text-2xl font-extrabold text-faint">#{i + 1}</span>
                <div>
                  <div className="text-2xl">{d.emoji}</div>
                  <h3 className="font-display text-lg font-bold text-ink">{d.name}</h3>
                </div>
              </div>
              <div className="text-right">
                <div className="font-display text-2xl font-extrabold" style={{ color: d.color }}>
                  {d.points.toLocaleString()}
                </div>
                <div className="text-[10px] font-bold tracking-wider text-faint">点</div>
              </div>
            </div>
            <div className="mt-3 h-2 overflow-hidden rounded-full bg-line-soft">
              <div
                className="h-full rounded-full transition-all duration-700"
                style={{
                  width: `${Math.round((d.points / max) * 100)}%`,
                  background: d.color,
                  boxShadow: `0 0 12px ${d.color}88`,
                }}
              />
            </div>
            <div className="mt-3 flex gap-3 text-xs text-muted">
              <span>投稿 {d.posts}</span>
              <span>試した {d.tries}</span>
            </div>
            <button
              type="button"
              onClick={() => onCheer(d.id)}
              className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-line-soft px-3 py-1.5 text-xs font-bold text-ink transition hover:bg-lime hover:text-void"
            >
              <Zap className="h-3.5 w-3.5" />
              応援 +5
            </button>
          </article>
        ))}
      </div>
    </div>
  )
}

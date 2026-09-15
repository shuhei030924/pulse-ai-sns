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
    <div className="fade-in">
      <header className="border-b border-line px-4 py-4">
        <p className="text-[12px] text-muted">{challengeMeta.weekLabel}</p>
        <h1 className="mt-1 text-xl font-semibold text-ink">部署対抗チャレンジ</h1>
        <p className="mt-1.5 text-sm text-muted">
          {challengeMeta.title} · 締切 {challengeMeta.deadline} · あと{challengeMeta.daysLeft}日
        </p>
        <p className="mt-1 text-[12px] text-faint">
          投稿 +10 / 「試した」+15 / 失敗ブースの「あるある」は点数に入りません
        </p>
      </header>

      <ol className="divide-y divide-line">
        {ranked.map((d, i) => (
          <li key={d.id} className="px-4 py-4">
            <div className="flex items-center justify-between gap-3">
              <div className="flex min-w-0 items-center gap-3">
                <span className="w-6 text-sm text-faint">{i + 1}</span>
                <span className="text-lg">{d.emoji}</span>
                <div className="min-w-0">
                  <h3 className="font-semibold text-ink">{d.name}</h3>
                  <p className="text-[12px] text-muted">
                    投稿 {d.posts} · 試した {d.tries}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-lg font-semibold tabular-nums text-ink">
                  {d.points.toLocaleString()}
                </div>
                <div className="text-[11px] text-faint">点</div>
              </div>
            </div>
            <div className="mt-3 h-1 overflow-hidden rounded-full bg-line">
              <div
                className="h-full rounded-full bg-ink"
                style={{ width: `${Math.round((d.points / max) * 100)}%` }}
              />
            </div>
            <button
              type="button"
              onClick={() => onCheer(d.id)}
              className="mt-3 text-[13px] font-medium text-accent hover:underline"
            >
              応援 +5
            </button>
          </li>
        ))}
      </ol>
    </div>
  )
}

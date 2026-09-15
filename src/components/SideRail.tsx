import { Flame, Radio } from 'lucide-react'
import { challengeMeta, people, trendingTags } from '../data/mock'
import type { DeptScore, Presence } from '../types'
import { Avatar } from './Avatar'

interface SideRailProps {
  presence: Presence[]
  deptScores: DeptScore[]
  onOpenChallenge: () => void
}

export function SideRail({ presence, deptScores, onOpenChallenge }: SideRailProps) {
  const top = [...deptScores].sort((a, b) => b.points - a.points).slice(0, 3)
  const leader = top[0]

  return (
    <aside className="soft-scroll h-full space-y-8 overflow-y-auto py-5 pl-4 pr-3">
      <section>
        <button
          type="button"
          onClick={onOpenChallenge}
          className="w-full text-left"
        >
          <h3 className="text-[13px] font-semibold text-ink">部署対抗チャレンジ</h3>
          <p className="mt-0.5 text-[12px] text-muted">{challengeMeta.subtitle}</p>
        </button>
        <ul className="mt-3 space-y-2">
          {top.map((d, i) => (
            <li key={d.id} className="flex items-center gap-2 text-[13px]">
              <span className="w-4 text-faint">{i + 1}</span>
              <span>{d.emoji}</span>
              <span className="flex-1 truncate text-ink-soft">{d.name}</span>
              <span className="tabular-nums text-muted">{d.points.toLocaleString()}</span>
            </li>
          ))}
        </ul>
        <button
          type="button"
          onClick={onOpenChallenge}
          className="mt-2 text-[12px] font-medium text-accent hover:underline"
        >
          順位を見る · あと{challengeMeta.daysLeft}日
        </button>
        {leader && (
          <p className="mt-1 text-[11px] text-faint">
            いま1位 {leader.emoji} {leader.name}
          </p>
        )}
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Radio className="h-3.5 w-3.5 text-online" />
          <h3 className="text-[13px] font-semibold text-ink">いま触ってる</h3>
        </div>
        <ul className="space-y-3">
          {presence.slice(0, 5).map((p) => {
            const person = people.find((x) => x.id === p.personId)
            if (!person) return null
            return (
              <li key={`${p.personId}-${p.tool}`} className="flex items-start gap-2.5">
                <Avatar initials={person.initials} color={person.color} size="sm" online />
                <div className="min-w-0 flex-1">
                  <div className="truncate text-[13px] font-medium text-ink">{person.name}</div>
                  <p className="truncate text-[12px] text-muted">
                    {p.tool} · {p.status}
                  </p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section>
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-3.5 w-3.5 text-muted" />
          <h3 className="text-[13px] font-semibold text-ink">トレンド</h3>
        </div>
        <ul className="space-y-2.5">
          {trendingTags.map((t, i) => (
            <li key={t.tag} className="flex items-center gap-3">
              <span className="w-4 text-[13px] text-faint">{i + 1}</span>
              <span className="flex-1 text-[13px] text-ink-soft">#{t.tag}</span>
              <span className="text-[12px] tabular-nums text-faint">{t.count}</span>
            </li>
          ))}
        </ul>
      </section>

      <p className="text-[11px] text-faint">Pulse · 社内専用プロトタイプ · モックデータ</p>
    </aside>
  )
}

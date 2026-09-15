import { Flame, Radio, Swords } from 'lucide-react'
import { challengeMeta, people, trendingTags } from '../data/mock'
import type { DeptScore, Presence } from '../types'
import { Avatar } from './Avatar'

const toolColor: Record<string, string> = {
  Cursor: '#c8ff00',
  Claude: '#d97706',
  ChatGPT: '#10a37f',
  Gemini: '#4285f4',
  'Notion AI': '#00f0ff',
}

interface SideRailProps {
  presence: Presence[]
  deptScores: DeptScore[]
  onOpenChallenge: () => void
}

export function SideRail({ presence, deptScores, onOpenChallenge }: SideRailProps) {
  const top = [...deptScores].sort((a, b) => b.points - a.points).slice(0, 3)
  const leader = top[0]

  return (
    <aside className="soft-scroll h-full space-y-4 overflow-y-auto py-5 pl-1 pr-4">
      <section className="relative overflow-hidden rounded-3xl border border-lime/35 bg-white p-5 challenge-pulse shadow-[0_8px_28px_-12px_rgba(143,212,0,0.25)]">
        <div className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-lime/20 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-10 left-4 h-24 w-24 rounded-full bg-pink/20 blur-3xl" />
        <div className="relative flex items-center gap-2 text-lime">
          <Swords className="h-4 w-4" />
          <span className="text-[10px] font-extrabold tracking-[0.2em]">{challengeMeta.weekLabel}</span>
        </div>
        <h3 className="relative mt-2 font-display text-lg font-extrabold leading-snug text-ink">
          部署対抗チャレンジ
        </h3>
        <p className="relative mt-1 text-xs text-muted">{challengeMeta.subtitle}</p>
        <div className="relative mt-4 space-y-2">
          {top.map((d, i) => (
            <div key={d.id} className="flex items-center gap-2">
              <span className="w-4 font-display text-xs font-bold text-faint">{i + 1}</span>
              <span className="text-sm">{d.emoji}</span>
              <span className="flex-1 text-sm font-semibold text-ink-soft">{d.name}</span>
              <span className="font-display text-sm font-bold" style={{ color: d.color }}>
                {d.points.toLocaleString()}
              </span>
            </div>
          ))}
        </div>
        <button
          type="button"
          onClick={onOpenChallenge}
          className="relative mt-4 w-full rounded-xl bg-lime/15 py-2 text-xs font-bold text-lime ring-1 ring-lime/40 transition hover:bg-lime hover:text-void"
        >
          順位を見る · あと{challengeMeta.daysLeft}日
        </button>
        {leader && (
          <p className="relative mt-2 text-center text-[11px] text-faint">
            いま1位 {leader.emoji} {leader.name}
          </p>
        )}
      </section>

      <section className="rounded-3xl glass-strong p-5">
        <div className="mb-3 flex items-center gap-2">
          <Radio className="h-4 w-4 text-cyan" />
          <h3 className="text-sm font-bold text-ink">いま触ってる</h3>
          <span className="ml-auto h-2 w-2 rounded-full bg-cyan pulse-ring" />
        </div>
        <ul className="space-y-3">
          {presence.slice(0, 5).map((p) => {
            const person = people.find((x) => x.id === p.personId)
            if (!person) return null
            return (
              <li key={`${p.personId}-${p.tool}`} className="flex items-start gap-2.5">
                <Avatar initials={person.initials} color={person.color} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-1.5">
                    <span className="truncate text-sm font-semibold text-ink">{person.name}</span>
                    <span
                      className="shrink-0 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-void"
                      style={{ background: toolColor[p.tool] ?? '#c8ff00' }}
                    >
                      {p.tool}
                    </span>
                  </div>
                  <p className="truncate text-xs text-muted">{p.status}</p>
                  <p className="text-[10px] text-faint">{p.startedAt}</p>
                </div>
              </li>
            )
          })}
        </ul>
      </section>

      <section className="rounded-3xl glass-strong p-5">
        <div className="mb-3 flex items-center gap-2">
          <Flame className="h-4 w-4 text-pink" />
          <h3 className="text-sm font-bold text-ink">トレンド</h3>
        </div>
        <ul className="space-y-2.5">
          {trendingTags.map((t, i) => (
            <li key={t.tag} className="flex items-center gap-3">
              <span className="w-4 font-display text-sm font-bold text-faint">{i + 1}</span>
              <span className="flex-1 text-sm font-medium text-ink-soft">#{t.tag}</span>
              <span className="rounded-full bg-pink/15 px-2 py-0.5 text-[11px] font-bold text-pink">
                {t.count}
              </span>
            </li>
          ))}
        </ul>
      </section>

      <p className="px-2 text-center text-[11px] text-faint">
        Pulse · 社内専用プロトタイプ · モックデータ
      </p>
    </aside>
  )
}

import { useState } from 'react'
import { people, CURRENT_USER_ID, tools } from '../data/mock'
import { Avatar } from '../components/Avatar'
import { UserPlus, UserCheck, Wrench, MessageCircle } from 'lucide-react'

export function People() {
  const [following, setFollowing] = useState<Record<string, boolean>>(() =>
    Object.fromEntries(people.map((p) => [p.id, !!p.following])),
  )
  const [tab, setTab] = useState<'people' | 'tools'>('tools')

  const others = people.filter((p) => p.id !== CURRENT_USER_ID)
  const experts = [...others].sort((a, b) => b.followers - a.followers)

  const toggle = (id: string) => {
    setFollowing((prev) => ({ ...prev, [id]: !prev[id] }))
  }

  return (
    <div className="fade-in space-y-5">
      <header>
        <h1 className="font-display text-2xl font-extrabold text-ink">人 / ツール棚</h1>
        <p className="mt-1 text-sm text-muted">ライセンス済みツールと「この人に聞ける」エキスパート。</p>
      </header>

      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab('tools')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold ${
            tab === 'tools' ? 'bg-cyan text-void' : 'bg-surface text-muted ring-1 ring-line'
          }`}
        >
          社内ツール棚
        </button>
        <button
          type="button"
          onClick={() => setTab('people')}
          className={`rounded-full px-4 py-1.5 text-xs font-bold ${
            tab === 'people' ? 'bg-lime text-void' : 'bg-surface text-muted ring-1 ring-line'
          }`}
        >
          人
        </button>
      </div>

      {tab === 'tools' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {tools.map((tool) => (
            <article key={tool.id} className="rounded-3xl glass-strong p-5">
              <div className="flex items-start gap-3">
                <div
                  className="flex h-11 w-11 items-center justify-center rounded-2xl"
                  style={{ background: `${tool.color}22` }}
                >
                  <Wrench className="h-5 w-5" style={{ color: tool.color }} />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="font-display font-bold text-ink">{tool.name}</h3>
                  <p className="text-xs text-muted">
                    {tool.category} · {tool.license}
                  </p>
                </div>
              </div>
              <p className="mt-3 text-sm text-ink-soft">{tool.description}</p>
              <div className="mt-4">
                <div className="mb-2 flex items-center gap-1.5 text-[10px] font-extrabold uppercase tracking-wider text-cyan">
                  <MessageCircle className="h-3 w-3" />
                  この人に聞ける
                </div>
                <div className="flex flex-wrap gap-2">
                  {tool.expertIds.map((eid) => {
                    const p = people.find((x) => x.id === eid)
                    if (!p) return null
                    return (
                      <div
                        key={eid}
                        className="inline-flex items-center gap-1.5 rounded-full bg-line-soft px-2 py-1 ring-1 ring-line"
                      >
                        <Avatar initials={p.initials} color={p.color} size="sm" />
                        <span className="text-xs font-semibold text-ink">{p.name}</span>
                      </div>
                    )
                  })}
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {tab === 'people' && (
        <div className="grid gap-4 sm:grid-cols-2">
          {experts.map((person) => {
            const isFollowing = following[person.id]
            return (
              <article
                key={person.id}
                className="flex flex-col rounded-3xl glass-strong p-5 transition hover:border-lime/40"
              >
                <div className="flex items-start gap-3">
                  <Avatar initials={person.initials} color={person.color} size="lg" />
                  <div className="min-w-0 flex-1">
                    <h3 className="font-semibold text-ink">{person.name}</h3>
                    <p className="text-xs text-muted">
                      {person.role} · {person.team}
                    </p>
                    <div className="mt-2 flex gap-3 text-xs text-faint">
                      <span>フォロワー {person.followers}</span>
                      <span>投稿 {person.posts}</span>
                    </div>
                  </div>
                </div>
                <p className="mt-3 flex-1 text-sm text-ink-soft">{person.bio}</p>
                <div className="mt-3 flex flex-wrap gap-1.5">
                  {person.expertise.map((e) => (
                    <span
                      key={e}
                      className="rounded-md bg-lime/10 px-2 py-0.5 text-[11px] font-medium text-lime"
                    >
                      {e}
                    </span>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={() => toggle(person.id)}
                  className={`mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl px-3 py-2 text-xs font-bold transition ${
                    isFollowing
                      ? 'bg-line-soft text-ink'
                      : 'bg-lime text-void hover:brightness-110'
                  }`}
                >
                  {isFollowing ? (
                    <>
                      <UserCheck className="h-3.5 w-3.5" />
                      フォロー中
                    </>
                  ) : (
                    <>
                      <UserPlus className="h-3.5 w-3.5" />
                      フォロー
                    </>
                  )}
                </button>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

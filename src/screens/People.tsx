import { useState } from 'react'
import { people, CURRENT_USER_ID, tools } from '../data/mock'
import { Avatar } from '../components/Avatar'
import { UserPlus, UserCheck, MessageCircle } from 'lucide-react'

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
    <div className="fade-in">
      <header className="border-b border-line px-4 py-4">
        <h1 className="text-xl font-semibold text-ink">人 / ツール</h1>
        <p className="mt-1 text-sm text-muted">社内で使えるツールと、詳しい人の一覧です。</p>
      </header>

      <div className="flex border-b border-line">
        <button
          type="button"
          onClick={() => setTab('tools')}
          className={`flex-1 py-3 text-[13px] ${
            tab === 'tools'
              ? 'border-b-2 border-ink font-semibold text-ink'
              : 'border-b-2 border-transparent text-muted'
          }`}
        >
          社内ツール
        </button>
        <button
          type="button"
          onClick={() => setTab('people')}
          className={`flex-1 py-3 text-[13px] ${
            tab === 'people'
              ? 'border-b-2 border-ink font-semibold text-ink'
              : 'border-b-2 border-transparent text-muted'
          }`}
        >
          人
        </button>
      </div>

      {tab === 'tools' && (
        <div className="divide-y divide-line">
          {tools.map((tool) => (
            <article key={tool.id} className="px-4 py-4">
              <h3 className="font-semibold text-ink">{tool.name}</h3>
              <p className="text-[12px] text-muted">
                {tool.category} · {tool.license}
              </p>
              <p className="mt-2 text-sm text-ink-soft">{tool.description}</p>
              <div className="mt-3">
                <div className="mb-2 flex items-center gap-1.5 text-[12px] text-muted">
                  <MessageCircle className="h-3 w-3" />
                  この人に聞ける
                </div>
                <div className="flex flex-wrap gap-2">
                  {tool.expertIds.map((eid) => {
                    const p = people.find((x) => x.id === eid)
                    if (!p) return null
                    return (
                      <div key={eid} className="inline-flex items-center gap-1.5">
                        <Avatar initials={p.initials} color={p.color} size="sm" />
                        <span className="text-[13px] text-ink">{p.name}</span>
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
        <div className="divide-y divide-line">
          {experts.map((person) => {
            const isFollowing = following[person.id]
            return (
              <article key={person.id} className="px-4 py-4">
                <div className="flex items-start gap-3">
                  <Avatar initials={person.initials} color={person.color} size="lg" />
                  <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="font-semibold text-ink">{person.name}</h3>
                        <p className="text-[12px] text-muted">
                          {person.role} · {person.team}
                        </p>
                        <p className="mt-0.5 text-[12px] text-faint">
                          フォロワー {person.followers} · 投稿 {person.posts}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => toggle(person.id)}
                        className={`inline-flex shrink-0 items-center gap-1 rounded-full px-3 py-1.5 text-[12px] font-semibold ${
                          isFollowing
                            ? 'border border-line text-ink'
                            : 'bg-accent text-white'
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
                    </div>
                    <p className="mt-2 text-sm text-ink-soft">{person.bio}</p>
                    <div className="mt-2 flex flex-wrap gap-x-2">
                      {person.expertise.map((e) => (
                        <span key={e} className="text-[12px] text-muted">
                          #{e}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </article>
            )
          })}
        </div>
      )}
    </div>
  )
}

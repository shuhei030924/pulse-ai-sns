import { useState } from 'react'
import { Bookmark, Copy, MessageCircle, Check, Link2, Heart, Lightbulb, Sparkles, ChevronDown } from 'lucide-react'
import type { Person, Post, ReactionKey } from '../types'
import { Avatar } from './Avatar'
import { people } from '../data/mock'

const reactionMeta: { key: ReactionKey; label: string; Icon: typeof Heart }[] = [
  { key: 'fire', label: 'いいね', Icon: Heart },
  { key: 'useful', label: '使える', Icon: Lightbulb },
  { key: 'wow', label: 'なるほど', Icon: Sparkles },
]

interface PostCardProps {
  post: Post
  author: Person
  onReact: (postId: string, key: ReactionKey) => void
  onToggleSave?: (postId: string) => void
  onTry?: (postId: string, result: string) => void
  saved?: boolean
  compact?: boolean
}

export function PostCard({
  post,
  author,
  onReact,
  onToggleSave,
  onTry,
  saved,
  compact,
}: PostCardProps) {
  const [copied, setCopied] = useState(false)
  const [showTry, setShowTry] = useState(false)
  const [tryText, setTryText] = useState('')
  const [chainOpen, setChainOpen] = useState(false)

  const canTry =
    !!(post.promptSnippet || post.type === '学び' || post.type === '事例' || post.type === 'チャレンジ') &&
    !!onTry

  const handleCopy = async () => {
    const text = post.promptSnippet || post.body
    try {
      await navigator.clipboard.writeText(text)
    } catch {
      /* ignore */
    }
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1500)
  }

  const submitTry = () => {
    if (!tryText.trim() || !onTry) return
    onTry(post.id, tryText.trim())
    setTryText('')
    setShowTry(false)
    setChainOpen(true)
  }

  return (
    <article className="group px-4 py-4">
      <div className="flex items-start gap-3">
        <Avatar initials={author.initials} color={author.color} />
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-baseline gap-x-1.5 text-[15px] leading-snug">
                <span className="font-semibold text-ink">{author.name}</span>
                <span className="text-[13px] text-muted">{author.team}</span>
                <span className="text-faint">·</span>
                <time className="text-[13px] text-faint">{post.createdAt}</time>
                {post.pinned && <span className="text-[12px] text-muted">ピン</span>}
              </div>
              <div className="mt-0.5 text-[12px] text-faint">
                {post.type} · {post.audience}
              </div>
            </div>
            {onToggleSave && (
              <button
                type="button"
                onClick={() => onToggleSave(post.id)}
                className={`rounded-full p-1.5 transition ${saved ? 'text-ink' : 'text-faint hover:text-ink'}`}
                aria-label="保存"
              >
                <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
              </button>
            )}
          </div>

          <h3 className="mt-2 text-[15px] font-semibold leading-snug text-ink">{post.title}</h3>
          {!compact && (
            <p className="mt-1.5 text-[15px] leading-[1.65] text-ink-soft">{post.body}</p>
          )}

          {post.promptSnippet && !compact && (
            <div className="mt-3 rounded-xl bg-line-soft px-3 py-2.5">
              <div className="mb-1 flex items-center gap-1 text-[11px] text-muted">
                <Link2 className="h-3 w-3" />
                プロンプト
              </div>
              <p className="font-mono text-[12px] leading-relaxed text-ink-soft">{post.promptSnippet}</p>
            </div>
          )}

          <div className="mt-2 flex flex-wrap gap-x-2 gap-y-0.5">
            {post.tags.map((tag) => (
              <span key={tag} className="text-[13px] text-muted">
                #{tag}
              </span>
            ))}
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-x-1 text-muted">
            {reactionMeta.map(({ key, label, Icon }) => {
              const active = post.myReactions.includes(key)
              return (
                <button
                  key={key}
                  type="button"
                  onClick={() => onReact(post.id, key)}
                  className={`inline-flex items-center gap-1 rounded-full px-2 py-1 text-[13px] transition hover:bg-line-soft ${
                    active ? 'text-pink' : 'text-muted'
                  }`}
                  aria-label={label}
                >
                  <Icon className={`h-4 w-4 ${active && key === 'fire' ? 'fill-current' : ''}`} />
                  <span className="tabular-nums">{post.reactions[key]}</span>
                </button>
              )
            })}
            <span className="inline-flex items-center gap-1 px-2 py-1 text-[13px]">
              <MessageCircle className="h-4 w-4" />
              {post.comments.length}
            </span>

            {canTry && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="ml-auto inline-flex items-center gap-1 rounded-full px-2 py-1 text-[12px] hover:bg-line-soft hover:text-ink"
                >
                  {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
                  {copied ? 'コピーしました' : 'コピーして試す'}
                </button>
                {!post.iTried ? (
                  <button
                    type="button"
                    onClick={() => setShowTry((v) => !v)}
                    className="inline-flex items-center rounded-full px-2 py-1 text-[12px] hover:bg-line-soft hover:text-ink"
                  >
                    試したので結果を書く
                  </button>
                ) : (
                  <span className="px-2 py-1 text-[12px] text-ink">試した</span>
                )}
              </>
            )}
          </div>

          {showTry && (
            <div className="mt-2 flex gap-2">
              <input
                value={tryText}
                onChange={(e) => setTryText(e.target.value)}
                placeholder="結果を一行で"
                className="flex-1 rounded-lg border border-line bg-surface px-3 py-1.5 text-sm outline-none focus:border-ink"
                onKeyDown={(e) => e.key === 'Enter' && submitTry()}
              />
              <button
                type="button"
                onClick={submitTry}
                className="rounded-lg bg-ink px-3 py-1.5 text-xs font-semibold text-white"
              >
                追加
              </button>
            </div>
          )}

          {post.tryChain.length > 0 && (
            <div className="mt-2">
              <button
                type="button"
                onClick={() => setChainOpen((v) => !v)}
                className="inline-flex items-center gap-1 text-[12px] text-muted hover:text-ink"
              >
                <ChevronDown className={`h-3.5 w-3.5 transition ${chainOpen ? 'rotate-180' : ''}`} />
                試した人 · {post.tryChain.length}
              </button>
              {chainOpen && (
                <div className="mt-2 space-y-2 border-l border-line pl-3">
                  {post.tryChain.map((t) => {
                    const who = people.find((p) => p.id === t.authorId)
                    return (
                      <div key={t.id} className="flex items-start gap-2 text-[13px]">
                        <span
                          className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[9px] font-semibold text-white"
                          style={{ background: who?.color ?? '#737373' }}
                        >
                          {who?.initials ?? '?'}
                        </span>
                        <div className="min-w-0">
                          <span className="font-medium text-ink">{who?.name ?? '誰か'}</span>
                          <span className="text-faint"> · {t.createdAt}</span>
                          <p className="text-ink-soft">{t.result}</p>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </article>
  )
}

import { useState } from 'react'
import { Bookmark, Copy, MessageCircle, Check, Link2 } from 'lucide-react'
import type { Person, Post, ReactionKey } from '../types'
import { Avatar } from './Avatar'
import { people } from '../data/mock'

const typeStyles: Record<Post['type'], string> = {
  学び: 'bg-cyan/15 text-cyan',
  事例: 'bg-lime/15 text-lime',
  質問: 'bg-violet-neon/15 text-violet-neon',
  失敗: 'bg-pink/15 text-pink',
  チャレンジ: 'bg-amber-400/20 text-amber-600',
}

const reactionMeta: { key: ReactionKey; label: string; emoji: string }[] = [
  { key: 'fire', label: 'いいね', emoji: '🔥' },
  { key: 'useful', label: '使える', emoji: '⚡' },
  { key: 'wow', label: 'なるほど', emoji: '💫' },
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
  const [burstKey, setBurstKey] = useState<string | null>(null)

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
  }

  return (
    <article className="group slide-up relative overflow-hidden rounded-3xl glass-strong p-5 transition hover:border-lime/30">
      <div className="pointer-events-none absolute -right-10 -top-10 h-28 w-28 rounded-full bg-pink/5 blur-2xl transition group-hover:bg-lime/10" />

      <div className="relative flex items-start gap-3">
        <Avatar initials={author.initials} color={author.color} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
            <span className="font-semibold text-ink">{author.name}</span>
            <span className="text-sm text-muted">{author.team}</span>
            <span className="text-faint">·</span>
            <time className="text-sm text-faint">{post.createdAt}</time>
            {post.pinned && (
              <span className="rounded-full bg-lime/20 px-2 py-0.5 text-[10px] font-extrabold tracking-wide text-lime">
                ピン
              </span>
            )}
          </div>
          <div className="mt-2 flex flex-wrap items-center gap-2">
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-bold ${typeStyles[post.type]}`}>
              {post.type}
            </span>
            <span className="text-xs text-faint">宛先: {post.audience}</span>
          </div>
        </div>
        {onToggleSave && (
          <button
            type="button"
            onClick={() => onToggleSave(post.id)}
            className={`rounded-xl p-2 transition ${saved ? 'text-lime' : 'text-faint hover:bg-line-soft hover:text-ink'}`}
            aria-label="保存"
          >
            <Bookmark className={`h-4 w-4 ${saved ? 'fill-current' : ''}`} />
          </button>
        )}
      </div>

      <h3 className="relative mt-4 font-display text-lg font-bold leading-snug tracking-tight text-ink">
        {post.title}
      </h3>
      {!compact && (
        <p className="relative mt-2 text-[15px] leading-relaxed text-ink-soft">{post.body}</p>
      )}

      {post.promptSnippet && !compact && (
        <div className="relative mt-3 rounded-2xl border border-dashed border-cyan/30 bg-cyan/5 p-3">
          <div className="mb-1 flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-wider text-cyan">
            <Link2 className="h-3 w-3" />
            プロンプト
          </div>
          <p className="font-mono text-xs leading-relaxed text-ink-soft">{post.promptSnippet}</p>
        </div>
      )}

      <div className="relative mt-3 flex flex-wrap gap-1.5">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="rounded-md bg-line-soft px-2 py-0.5 text-xs font-medium text-muted transition group-hover:bg-lime/10 group-hover:text-lime"
          >
            #{tag}
          </span>
        ))}
      </div>

      {/* 試した人 */}
      {(post.promptSnippet || post.type === '学び' || post.type === '事例' || post.type === 'チャレンジ') &&
        onTry && (
          <div className="relative mt-4 flex flex-wrap gap-2">
            <button
              type="button"
              onClick={handleCopy}
              className="inline-flex items-center gap-1.5 rounded-full bg-cyan/15 px-3 py-1.5 text-xs font-bold text-cyan ring-1 ring-cyan/30 transition hover:bg-cyan hover:text-void"
            >
              {copied ? <Check className="h-3.5 w-3.5" /> : <Copy className="h-3.5 w-3.5" />}
              {copied ? 'コピーしました' : 'コピーして試す'}
            </button>
            {!post.iTried ? (
              <button
                type="button"
                onClick={() => setShowTry((v) => !v)}
                className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-3 py-1.5 text-xs font-bold text-lime ring-1 ring-lime/30 transition hover:bg-lime hover:text-void"
              >
                試したので結果を書く
              </button>
            ) : (
              <span className="inline-flex items-center rounded-full bg-lime/20 px-3 py-1.5 text-xs font-bold text-lime">
                ✓ 試した
              </span>
            )}
          </div>
        )}

      {showTry && (
        <div className="relative mt-3 flex gap-2">
          <input
            value={tryText}
            onChange={(e) => setTryText(e.target.value)}
            placeholder="結果を一行で"
            className="flex-1 rounded-xl border border-line bg-line-soft px-3 py-2 text-sm outline-none ring-lime/40 focus:ring-2"
            onKeyDown={(e) => e.key === 'Enter' && submitTry()}
          />
          <button
            type="button"
            onClick={submitTry}
            className="rounded-xl bg-lime px-3 py-2 text-xs font-bold text-void"
          >
            追加
          </button>
        </div>
      )}

      {post.tryChain.length > 0 && (
        <div className="relative mt-4 space-y-2 rounded-2xl border border-lime/25 bg-lime/5 p-3">
          <div className="text-[10px] font-extrabold uppercase tracking-widest text-lime">
            試した人 · {post.tryChain.length}
          </div>
          {post.tryChain.map((t) => {
            const who = people.find((p) => p.id === t.authorId)
            return (
              <div key={t.id} className="flex items-start gap-2 text-sm">
                <span
                  className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-void"
                  style={{ background: who?.color ?? '#c8ff00' }}
                >
                  {who?.initials ?? '?'}
                </span>
                <div className="min-w-0">
                  <span className="font-semibold text-ink-soft">{who?.name ?? '誰か'}</span>
                  <span className="text-faint"> · {t.createdAt}</span>
                  <p className="text-ink">{t.result}</p>
                </div>
              </div>
            )
          })}
        </div>
      )}

      <div className="relative mt-4 flex flex-wrap items-center gap-2 border-t border-line/60 pt-3">
        {reactionMeta.map(({ key, label, emoji }) => {
          const active = post.myReactions.includes(key)
          return (
            <button
              key={key}
              type="button"
              onClick={() => {
                onReact(post.id, key)
                setBurstKey(key)
                window.setTimeout(() => setBurstKey(null), 500)
              }}
              className={`relative inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-bold transition ${
                active
                  ? 'bg-pink text-void react-pop glow-pink'
                  : 'bg-line-soft text-muted hover:bg-pink/20 hover:text-pink'
              }`}
            >
              {burstKey === key && (
                <span className="pointer-events-none absolute inset-0 rounded-full bg-pink/40 burst" />
              )}
              <span>{emoji}</span>
              {label}
              <span className={`tabular-nums ${active ? 'text-void/70' : 'text-faint'}`}>
                {post.reactions[key]}
              </span>
            </button>
          )
        })}
        <span className="ml-auto inline-flex items-center gap-1.5 text-xs text-muted">
          <MessageCircle className="h-3.5 w-3.5" />
          {post.comments.length}
        </span>
      </div>
    </article>
  )
}

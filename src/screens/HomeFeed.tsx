import type { Person, Post, ReactionKey, Story } from '../types'
import { PostCard } from '../components/PostCard'
import { StoriesRail } from '../components/StoriesRail'
import { Sparkles } from 'lucide-react'

const filters = ['すべて', '学び', '事例', '質問', '失敗', 'チャレンジ'] as const

interface HomeFeedProps {
  posts: Post[]
  peopleById: Record<string, Person>
  stories: Story[]
  filter: string
  onFilter: (f: string) => void
  onReact: (postId: string, key: ReactionKey) => void
  onTry: (postId: string, result: string) => void
  savedIds: string[]
  onToggleSave: (postId: string) => void
  onCompose: () => void
  onOpenStory: (index: number) => void
}

export function HomeFeed({
  posts,
  peopleById,
  stories,
  filter,
  onFilter,
  onReact,
  onTry,
  savedIds,
  onToggleSave,
  onCompose,
  onOpenStory,
}: HomeFeedProps) {
  const visible = filter === 'すべて' ? posts : posts.filter((p) => p.type === filter)

  return (
    <div className="fade-in space-y-5">
      <header className="relative overflow-hidden rounded-3xl border border-line bg-gradient-to-br from-white via-lime/10 to-pink/15 p-6 shadow-[0_8px_32px_-12px_rgba(24,24,27,0.12)]">
        <div className="pointer-events-none absolute -right-8 top-0 h-40 w-40 rounded-full bg-lime/20 blur-3xl" />
        <div className="pointer-events-none absolute bottom-0 left-1/3 h-24 w-24 rounded-full bg-cyan/15 blur-2xl" />
        <div className="relative flex flex-wrap items-start justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-lime/15 px-2.5 py-1 text-[11px] font-extrabold text-lime ring-1 ring-lime/30">
              <Sparkles className="h-3 w-3" />
              社内専用
            </div>
            <h1 className="mt-3 font-display text-2xl font-extrabold tracking-tight text-ink sm:text-3xl">
              社内で<span className="neon-lime">AIの使い方</span>を共有する場所
            </h1>
            <p className="mt-2 max-w-lg text-sm leading-relaxed text-muted">
              うまくいったやり方、失敗した話、今週のお題。同僚の投稿を見て、自分の仕事でも試せます。
            </p>
          </div>
          <button
            type="button"
            onClick={onCompose}
            className="rounded-2xl bg-lime px-4 py-2.5 text-sm font-extrabold text-void glow-lime transition hover:brightness-110"
          >
            投稿する
          </button>
        </div>
      </header>

      <StoriesRail stories={stories} onOpen={onOpenStory} />

      <div className="flex flex-wrap gap-1.5">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onFilter(f)}
            className={`rounded-full px-3.5 py-1.5 text-xs font-bold transition ${
              filter === f
                ? 'bg-lime text-void'
                : 'bg-surface text-muted ring-1 ring-line hover:text-ink hover:ring-lime/40'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {visible.map((post) => {
          const author = peopleById[post.authorId]
          if (!author) return null
          return (
            <PostCard
              key={post.id}
              post={post}
              author={author}
              onReact={onReact}
              onTry={onTry}
              saved={savedIds.includes(post.id)}
              onToggleSave={onToggleSave}
            />
          )
        })}
        {visible.length === 0 && (
          <div className="rounded-3xl border border-dashed border-line bg-surface/50 p-12 text-center">
            <div className="text-4xl">📝</div>
            <p className="mt-3 font-display text-lg font-bold text-ink">この条件の投稿はまだないです</p>
            <p className="mt-1 text-sm text-muted">よかったら最初の1件を書いてみてください</p>
          </div>
        )}
      </div>
    </div>
  )
}

import type { Person, Post, ReactionKey, Story } from '../types'
import { PostCard } from '../components/PostCard'
import { StoriesRail } from '../components/StoriesRail'
import { Avatar } from '../components/Avatar'
import { CURRENT_USER_ID, people } from '../data/mock'

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
  const me = people.find((p) => p.id === CURRENT_USER_ID)!

  return (
    <div className="fade-in">
      <StoriesRail stories={stories} onOpen={onOpenStory} />

      <button
        type="button"
        onClick={onCompose}
        className="flex w-full items-center gap-3 border-b border-line px-4 py-3 text-left hover:bg-line-soft/60"
      >
        <Avatar initials={me.initials} color={me.color} />
        <span className="flex-1 text-[15px] text-muted">うまくいったこと、失敗したこと…</span>
        <span className="text-[13px] font-semibold text-accent">投稿する</span>
      </button>

      <div className="hide-scrollbar flex gap-0 overflow-x-auto border-b border-line">
        {filters.map((f) => (
          <button
            key={f}
            type="button"
            onClick={() => onFilter(f)}
            className={`shrink-0 px-3.5 py-3 text-[13px] transition ${
              filter === f
                ? 'border-b-2 border-ink font-semibold text-ink'
                : 'border-b-2 border-transparent text-muted hover:text-ink'
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="divide-y divide-line">
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
          <div className="px-4 py-16 text-center">
            <p className="text-[15px] font-medium text-ink">この条件の投稿はまだないです</p>
            <p className="mt-1 text-sm text-muted">よかったら最初の1件を書いてみてください</p>
          </div>
        )}
      </div>
    </div>
  )
}

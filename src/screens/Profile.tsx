import { people, CURRENT_USER_ID } from '../data/mock'
import type { Person, Post, ReactionKey } from '../types'
import { Avatar } from '../components/Avatar'
import { PostCard } from '../components/PostCard'
import { Flame, Bookmark } from 'lucide-react'

interface ProfileProps {
  posts: Post[]
  peopleById: Record<string, Person>
  savedIds: string[]
  onReact: (postId: string, key: ReactionKey) => void
  onTry: (postId: string, result: string) => void
  onToggleSave: (postId: string) => void
}

export function Profile({ posts, peopleById, savedIds, onReact, onTry, onToggleSave }: ProfileProps) {
  const me = people.find((p) => p.id === CURRENT_USER_ID)!
  const myPosts = posts.filter((p) => p.authorId === CURRENT_USER_ID)
  const saved = posts.filter((p) => savedIds.includes(p.id))

  return (
    <div className="fade-in space-y-5">
      <section className="overflow-hidden rounded-3xl glass-strong">
        <div className="h-28 bg-gradient-to-r from-lime/40 via-pink/30 to-cyan/40" />
        <div className="relative px-6 pb-6">
          <div className="-mt-8 flex flex-wrap items-end justify-between gap-4">
            <div className="flex items-end gap-4">
              <Avatar
                initials={me.initials}
                color={me.color}
                size="lg"
                className="ring-4 ring-white"
              />
              <div className="pb-1">
                <h1 className="font-display text-xl font-extrabold text-ink">{me.name}</h1>
                <p className="text-sm text-muted">
                  {me.role} · {me.team}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-lime/15 px-3 py-2 text-lime ring-1 ring-lime/30">
              <Flame className="h-4 w-4" />
              <span className="text-sm font-extrabold">連続 12日</span>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-ink-soft">{me.bio}</p>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {me.expertise.map((e) => (
              <span key={e} className="rounded-md bg-line-soft px-2 py-0.5 text-xs text-muted">
                {e}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="font-display text-lg font-bold text-ink">自分の投稿</h2>
        {myPosts.map((post) => {
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
      </section>

      <section className="space-y-3">
        <div className="flex items-center gap-2">
          <Bookmark className="h-4 w-4 text-lime" />
          <h2 className="font-display text-lg font-bold text-ink">保存済み</h2>
        </div>
        {saved.map((post) => {
          const author = peopleById[post.authorId]
          if (!author) return null
          return (
            <PostCard
              key={post.id}
              post={post}
              author={author}
              onReact={onReact}
              onTry={onTry}
              saved
              onToggleSave={onToggleSave}
            />
          )
        })}
        {saved.length === 0 && (
          <p className="text-sm text-muted">まだ保存なし。ブックマークで後で試そう。</p>
        )}
      </section>
    </div>
  )
}

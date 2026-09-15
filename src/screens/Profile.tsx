import { people, CURRENT_USER_ID } from '../data/mock'
import type { Person, Post, ReactionKey } from '../types'
import { Avatar } from '../components/Avatar'
import { PostCard } from '../components/PostCard'
import { Bookmark } from 'lucide-react'

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
    <div className="fade-in">
      <section className="border-b border-line px-4 py-5">
        <div className="flex items-start gap-4">
          <Avatar initials={me.initials} color={me.color} size="lg" />
          <div className="min-w-0 flex-1">
            <h1 className="text-lg font-semibold text-ink">{me.name}</h1>
            <p className="text-sm text-muted">
              {me.role} · {me.team}
            </p>
            <p className="mt-1 text-[12px] text-muted">12日連続で投稿</p>
          </div>
        </div>
        <p className="mt-4 text-sm leading-relaxed text-ink-soft">{me.bio}</p>
        <div className="mt-2 flex flex-wrap gap-x-2">
          {me.expertise.map((e) => (
            <span key={e} className="text-[13px] text-muted">
              #{e}
            </span>
          ))}
        </div>
      </section>

      <section>
        <h2 className="border-b border-line px-4 py-3 text-[13px] font-semibold text-ink">自分の投稿</h2>
        <div className="divide-y divide-line">
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
        </div>
      </section>

      <section className="border-t border-line">
        <div className="flex items-center gap-2 border-b border-line px-4 py-3">
          <Bookmark className="h-4 w-4 text-muted" />
          <h2 className="text-[13px] font-semibold text-ink">保存済み</h2>
        </div>
        <div className="divide-y divide-line">
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
        </div>
        {saved.length === 0 && (
          <p className="px-4 py-8 text-sm text-muted">
            保存した投稿はまだありません。後で読むものはブックマークできます。
          </p>
        )}
      </section>
    </div>
  )
}

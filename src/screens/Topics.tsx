import { useState } from 'react'
import { topics } from '../data/mock'
import type { Person, Post, ReactionKey } from '../types'
import { PostCard } from '../components/PostCard'
import { Pin } from 'lucide-react'

interface TopicsProps {
  posts: Post[]
  peopleById: Record<string, Person>
  onReact: (postId: string, key: ReactionKey) => void
  onTry: (postId: string, result: string) => void
}

export function Topics({ posts, peopleById, onReact, onTry }: TopicsProps) {
  const [activeId, setActiveId] = useState(topics[0].id)
  const topic = topics.find((t) => t.id === activeId)!
  const topicPosts = posts.filter((p) => p.topicId === activeId)
  const pinned = topicPosts.filter((p) => p.pinned)
  const rest = topicPosts.filter((p) => !p.pinned)

  return (
    <div className="fade-in">
      <header className="border-b border-line px-4 py-4">
        <h1 className="text-xl font-semibold text-ink">トピック</h1>
        <p className="mt-1 text-sm text-muted">話題ごとに投稿をまとめています。大事なものはピン留めされます。</p>
      </header>

      <div className="hide-scrollbar flex gap-0 overflow-x-auto border-b border-line">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveId(t.id)}
            className={`flex shrink-0 items-center gap-1.5 px-3.5 py-3 text-[13px] transition ${
              activeId === t.id
                ? 'border-b-2 border-ink font-semibold text-ink'
                : 'border-b-2 border-transparent text-muted hover:text-ink'
            }`}
          >
            <span>{t.icon}</span>
            {t.name}
          </button>
        ))}
      </div>

      <section className="border-b border-line px-4 py-4">
        <h2 className="font-semibold text-ink">
          {topic.icon} {topic.name}
        </h2>
        <p className="mt-1 text-sm text-muted">{topic.description}</p>
        <p className="mt-2 text-[12px] text-faint">
          {topic.members}人 · {topic.posts}投稿
        </p>
      </section>

      {pinned.length > 0 && (
        <div className="divide-y divide-line border-b border-line">
          <div className="flex items-center gap-1.5 px-4 py-2 text-[12px] text-muted">
            <Pin className="h-3.5 w-3.5" />
            ピン留め
          </div>
          {pinned.map((post) => {
            const author = peopleById[post.authorId]
            if (!author) return null
            return (
              <PostCard
                key={post.id}
                post={post}
                author={author}
                onReact={onReact}
                onTry={onTry}
              />
            )
          })}
        </div>
      )}

      <div className="divide-y divide-line">
        {rest.map((post) => {
          const author = peopleById[post.authorId]
          if (!author) return null
          return (
            <PostCard key={post.id} post={post} author={author} onReact={onReact} onTry={onTry} />
          )
        })}
        {topicPosts.length === 0 && (
          <div className="px-4 py-16 text-center text-sm text-muted">
            このトピックにはまだ投稿がありません
          </div>
        )}
      </div>
    </div>
  )
}

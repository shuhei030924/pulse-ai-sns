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
    <div className="fade-in space-y-5">
      <header>
        <h1 className="font-display text-2xl font-extrabold text-ink">トピック</h1>
        <p className="mt-1 text-sm text-muted">話題ごとに投稿をまとめています。大事なものはピン留めされます。</p>
      </header>

      <div className="hide-scrollbar flex gap-2 overflow-x-auto pb-1">
        {topics.map((t) => (
          <button
            key={t.id}
            type="button"
            onClick={() => setActiveId(t.id)}
            className={`flex shrink-0 items-center gap-2 rounded-2xl px-3.5 py-2 text-sm font-bold transition ${
              activeId === t.id
                ? 'bg-lime text-void'
                : 'bg-surface text-ink-soft ring-1 ring-line hover:ring-lime/50'
            }`}
          >
            <span>{t.icon}</span>
            {t.name}
          </button>
        ))}
      </div>

      <section className="rounded-3xl glass-strong p-5">
        <div className="flex items-start gap-3">
          <span
            className="flex h-12 w-12 items-center justify-center rounded-2xl text-xl"
            style={{ background: `${topic.color}22`, color: topic.color }}
          >
            {topic.icon}
          </span>
          <div>
            <h2 className="font-display text-xl font-bold text-ink">{topic.name}</h2>
            <p className="mt-1 text-sm text-muted">{topic.description}</p>
            <p className="mt-2 text-xs text-faint">
              {topic.members}人 · {topic.posts}投稿
            </p>
          </div>
        </div>
      </section>

      {pinned.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-1.5 text-xs font-bold text-lime">
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

      <div className="space-y-4">
        {rest.map((post) => {
          const author = peopleById[post.authorId]
          if (!author) return null
          return (
            <PostCard key={post.id} post={post} author={author} onReact={onReact} onTry={onTry} />
          )
        })}
        {topicPosts.length === 0 && (
          <div className="rounded-3xl border border-dashed border-line p-10 text-center text-sm text-muted">
            このトピックにはまだ投稿がありません
          </div>
        )}
      </div>
    </div>
  )
}

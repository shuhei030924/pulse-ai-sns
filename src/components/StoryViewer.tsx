import { useEffect, useState } from 'react'
import { X } from 'lucide-react'
import { people } from '../data/mock'
import type { Story } from '../types'
import { Avatar } from './Avatar'

interface StoryViewerProps {
  stories: Story[]
  index: number
  onClose: () => void
  onViewed: (id: string) => void
  onIndex: (i: number) => void
}

export function StoryViewer({ stories, index, onClose, onViewed, onIndex }: StoryViewerProps) {
  const story = stories[index]
  const [key, setKey] = useState(0)

  useEffect(() => {
    if (!story) return
    onViewed(story.id)
    setKey((k) => k + 1)
    const t = window.setTimeout(() => {
      if (index < stories.length - 1) onIndex(index + 1)
      else onClose()
    }, 4500)
    return () => window.clearTimeout(t)
  }, [index, story?.id])

  if (!story) return null
  const author = people.find((p) => p.id === story.authorId)
  if (!author) return null

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-void/95 p-4 fade-in">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <div
        className="relative flex h-[min(720px,90svh)] w-full max-w-md flex-col overflow-hidden rounded-3xl border border-white/10 shadow-2xl"
        style={{
          background: `linear-gradient(165deg, ${story.accent}33 0%, #0a0a0e 45%, #121216 100%)`,
        }}
      >
        <div className="flex gap-1 px-3 pt-3">
          {stories.map((s, i) => (
            <div key={s.id} className="h-1 flex-1 overflow-hidden rounded-full bg-white/20">
              <div
                key={i === index ? `p-${key}` : `s-${i}`}
                className={`h-full rounded-full bg-white ${
                  i < index ? 'w-full' : i === index ? 'progress-story' : 'w-0'
                }`}
                style={i === index ? { animationDuration: '4.5s' } : undefined}
              />
            </div>
          ))}
        </div>

        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar initials={author.initials} color={author.color} size="sm" />
          <div className="min-w-0 flex-1">
            <div className="text-sm font-bold text-white">{author.name}</div>
            <div className="text-[11px] text-white/60">あと {story.hoursLeft}h · 24h Tips</div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-full bg-white/10 p-2 text-white hover:bg-white/20"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        <div className="flex flex-1 flex-col justify-center px-6 pb-10">
          <p className="text-[11px] font-extrabold uppercase tracking-[0.25em] text-white/50">
            tip
          </p>
          <h2 className="mt-2 font-display text-3xl font-extrabold leading-tight text-white">
            {story.title}
          </h2>
          <p className="mt-5 text-base leading-relaxed text-white/85">{story.body}</p>
        </div>

        <div className="absolute inset-y-0 left-0 w-1/3" onClick={() => index > 0 && onIndex(index - 1)} />
        <div
          className="absolute inset-y-0 right-0 w-1/3"
          onClick={() => (index < stories.length - 1 ? onIndex(index + 1) : onClose())}
        />
      </div>
    </div>
  )
}

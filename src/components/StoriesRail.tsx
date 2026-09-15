import { people } from '../data/mock'
import type { Story } from '../types'
import { Avatar } from './Avatar'

interface StoriesRailProps {
  stories: Story[]
  onOpen: (index: number) => void
}

export function StoriesRail({ stories, onOpen }: StoriesRailProps) {
  return (
    <section className="border-b border-line px-3 pb-3 pt-3 sm:px-4">
      <div className="mb-3 flex items-baseline justify-between px-1">
        <h2 className="text-[13px] font-semibold text-ink">今日のTips</h2>
        <span className="text-[11px] text-faint">24時間で消えます</span>
      </div>
      <div className="hide-scrollbar flex gap-4 overflow-x-auto pb-1">
        {stories.map((story, i) => {
          const author = people.find((p) => p.id === story.authorId)
          if (!author) return null
          return (
            <button
              key={story.id}
              type="button"
              onClick={() => onOpen(i)}
              className="group flex w-[76px] shrink-0 flex-col items-center gap-1.5"
            >
              <div
                className={`rounded-full p-[3px] ${story.viewed ? 'story-ring-seen' : 'story-ring'}`}
              >
                <div className="rounded-full bg-surface p-[2px]">
                  <Avatar initials={author.initials} color={author.color} size="story" />
                </div>
              </div>
              <span className="w-full truncate text-center text-[11px] text-ink-soft group-hover:text-ink">
                {story.title}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

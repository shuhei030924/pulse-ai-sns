import { people } from '../data/mock'
import type { Story } from '../types'
import { Avatar } from './Avatar'

interface StoriesRailProps {
  stories: Story[]
  onOpen: (index: number) => void
}

export function StoriesRail({ stories, onOpen }: StoriesRailProps) {
  return (
    <section className="fade-in">
      <div className="mb-2 flex items-baseline justify-between px-1">
        <h2 className="font-display text-sm font-bold tracking-wide text-ink">
          24h Tips
        </h2>
        <span className="text-[10px] font-semibold uppercase tracking-widest text-cyan">
          ephemeral
        </span>
      </div>
      <div className="hide-scrollbar flex gap-3 overflow-x-auto pb-2">
        {stories.map((story, i) => {
          const author = people.find((p) => p.id === story.authorId)
          if (!author) return null
          return (
            <button
              key={story.id}
              type="button"
              onClick={() => onOpen(i)}
              className="group flex w-[72px] shrink-0 flex-col items-center gap-1.5"
            >
              <div
                className={`rounded-full p-[2.5px] ${story.viewed ? 'story-ring-seen' : 'story-ring'}`}
              >
                <div className="rounded-full bg-canvas p-[2px]">
                  <Avatar initials={author.initials} color={author.color} size="md" />
                </div>
              </div>
              <span className="w-full truncate text-center text-[10px] font-medium text-muted group-hover:text-ink">
                {story.title}
              </span>
            </button>
          )
        })}
      </div>
    </section>
  )
}

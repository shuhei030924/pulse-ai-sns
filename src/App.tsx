import { useCallback, useMemo, useState } from 'react'
import {
  CURRENT_USER_ID,
  initialDeptScores,
  initialFailBooth,
  initialPosts,
  initialPresence,
  initialStories,
  people,
  savedPostIds as initialSaved,
} from './data/mock'
import type {
  DeptId,
  DeptScore,
  FailBoothPost,
  Post,
  Presence,
  ReactionKey,
  Story,
  TabId,
} from './types'
import { SideNav } from './components/SideNav'
import { SideRail } from './components/SideRail'
import { Composer } from './components/Composer'
import { StoryViewer } from './components/StoryViewer'
import { HomeFeed } from './screens/HomeFeed'
import { FailBooth } from './screens/FailBooth'
import { Challenge } from './screens/Challenge'
import { Topics } from './screens/Topics'
import { People } from './screens/People'
import { Profile } from './screens/Profile'
import { Menu, PenLine, X } from 'lucide-react'

export default function App() {
  const [tab, setTab] = useState<TabId>('home')
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [failPosts, setFailPosts] = useState<FailBoothPost[]>(initialFailBooth)
  const [stories, setStories] = useState<Story[]>(initialStories)
  const [presence] = useState<Presence[]>(initialPresence)
  const [deptScores, setDeptScores] = useState<DeptScore[]>(initialDeptScores)
  const [filter, setFilter] = useState('すべて')
  const [composerOpen, setComposerOpen] = useState(false)
  const [composerTemplate, setComposerTemplate] = useState<
    Post['type'] | '失敗ブース' | undefined
  >()
  const [savedIds, setSavedIds] = useState<string[]>(initialSaved)
  const [mobileNav, setMobileNav] = useState(false)
  const [mobileRail, setMobileRail] = useState(false)
  const [storyIndex, setStoryIndex] = useState<number | null>(null)

  const me = people.find((p) => p.id === CURRENT_USER_ID)!
  const peopleById = useMemo(
    () => Object.fromEntries(people.map((p) => [p.id, p])),
    [],
  )

  const bumpDept = useCallback((dept: DeptId, points: number, kind: 'posts' | 'tries') => {
    setDeptScores((prev) =>
      prev.map((d) =>
        d.id === dept
          ? {
              ...d,
              points: d.points + points,
              posts: kind === 'posts' ? d.posts + 1 : d.posts,
              tries: kind === 'tries' ? d.tries + 1 : d.tries,
            }
          : d,
      ),
    )
  }, [])

  const handleReact = (postId: string, key: ReactionKey) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        const active = p.myReactions.includes(key)
        const myReactions = active
          ? p.myReactions.filter((r) => r !== key)
          : [...p.myReactions, key]
        const reactions = {
          ...p.reactions,
          [key]: p.reactions[key] + (active ? -1 : 1),
        }
        return { ...p, myReactions, reactions }
      }),
    )
  }

  const handleTry = (postId: string, result: string) => {
    setPosts((prev) =>
      prev.map((p) => {
        if (p.id !== postId) return p
        return {
          ...p,
          iTried: true,
          tryChain: [
            ...p.tryChain,
            {
              id: `tr-${Date.now()}`,
              authorId: CURRENT_USER_ID,
              result,
              createdAt: 'たった今',
            },
          ],
        }
      }),
    )
    bumpDept(me.dept, 15, 'tries')
  }

  const handleToggleSave = (postId: string) => {
    setSavedIds((prev) =>
      prev.includes(postId) ? prev.filter((id) => id !== postId) : [...prev, postId],
    )
  }

  const handleSubmit = (post: Post) => {
    setPosts((prev) => [post, ...prev])
    bumpDept(me.dept, 10, 'posts')
    setTab('home')
    setFilter('すべて')
  }

  const handleFailBooth = (post: FailBoothPost) => {
    setFailPosts((prev) => [post, ...prev])
    setTab('failbooth')
  }

  const handleFailVibe = (id: string) => {
    setFailPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const active = !!p.myVibe
        return {
          ...p,
          myVibe: !active,
          vibes: p.vibes + (active ? -1 : 1),
        }
      }),
    )
  }

  const handleFailTick = useCallback((id: string, remaining: number) => {
    setFailPosts((prev) =>
      prev.map((p) => {
        if (p.id !== id) return p
        const next = { ...p, expiresInSec: remaining }
        if (remaining === 0 && !p.revealed && p.vibes >= 100) {
          next.revealed = true
          next.expiresInSec = 3600
        }
        return next
      }),
    )
  }, [])

  const handleCheer = (id: DeptId) => {
    setDeptScores((prev) =>
      prev.map((d) => (d.id === id ? { ...d, points: d.points + 5 } : d)),
    )
  }

  const navigate = (t: TabId) => {
    setTab(t)
    setMobileNav(false)
  }

  const openComposer = (template?: Post['type'] | '失敗ブース') => {
    setComposerTemplate(template)
    setComposerOpen(true)
  }

  const titles: Record<TabId, string> = {
    home: 'ホーム',
    failbooth: '失敗ブース',
    challenge: 'チャレンジ',
    topics: 'トピック',
    people: '人 / ツール',
    profile: '自分',
  }

  return (
    <div className="min-h-svh">
      <div className="mx-auto flex min-h-svh max-w-[1440px]">
        <div className="sticky top-0 hidden h-svh w-56 shrink-0 lg:block xl:w-60">
          <SideNav
            active={tab}
            onNavigate={navigate}
            onCompose={() => openComposer()}
            userInitials={me.initials}
            userColor={me.color}
            userName={me.name}
          />
        </div>

        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-20 flex items-center gap-3 border-b border-line/80 bg-canvas/85 px-4 py-3 backdrop-blur-xl lg:hidden">
            <button
              type="button"
              onClick={() => setMobileNav(true)}
              className="rounded-xl p-2 text-ink hover:bg-line-soft"
              aria-label="メニュー"
            >
              <Menu className="h-5 w-5" />
            </button>
            <div className="flex-1">
              <div className="font-display text-sm font-extrabold text-ink">Pulse</div>
              <div className="text-[11px] text-muted">{titles[tab]}</div>
            </div>
            <button
              type="button"
              onClick={() => setMobileRail(true)}
              className="rounded-xl px-2 py-1 text-xs font-bold text-lime hover:bg-lime/10"
            >
              LIVE
            </button>
            <button
              type="button"
              onClick={() => openComposer()}
              className="rounded-xl bg-lime p-2 text-void"
              aria-label="投稿"
            >
              <PenLine className="h-4 w-4" />
            </button>
          </header>

          <main className="flex-1 px-4 py-5 sm:px-6 lg:px-8">
            {tab === 'home' && (
              <HomeFeed
                posts={posts}
                peopleById={peopleById}
                stories={stories}
                filter={filter}
                onFilter={setFilter}
                onReact={handleReact}
                onTry={handleTry}
                savedIds={savedIds}
                onToggleSave={handleToggleSave}
                onCompose={() => openComposer()}
                onOpenStory={(i) => setStoryIndex(i)}
              />
            )}
            {tab === 'failbooth' && (
              <FailBooth
                posts={failPosts}
                onVibe={handleFailVibe}
                onCompose={() => openComposer('失敗ブース')}
                onTick={handleFailTick}
              />
            )}
            {tab === 'challenge' && (
              <Challenge scores={deptScores} onCheer={handleCheer} />
            )}
            {tab === 'topics' && (
              <Topics
                posts={posts}
                peopleById={peopleById}
                onReact={handleReact}
                onTry={handleTry}
              />
            )}
            {tab === 'people' && <People />}
            {tab === 'profile' && (
              <Profile
                posts={posts}
                peopleById={peopleById}
                savedIds={savedIds}
                onReact={handleReact}
                onTry={handleTry}
                onToggleSave={handleToggleSave}
              />
            )}
          </main>
        </div>

        <div className="sticky top-0 hidden h-svh w-72 shrink-0 xl:block 2xl:w-80">
          <SideRail
            presence={presence}
            deptScores={deptScores}
            onOpenChallenge={() => navigate('challenge')}
          />
        </div>
      </div>

      {mobileNav && (
        <div className="fixed inset-0 z-40 lg:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setMobileNav(false)} />
          <div className="absolute inset-y-0 left-0 w-64 slide-up bg-white shadow-xl">
            <SideNav
              active={tab}
              onNavigate={navigate}
              onCompose={() => {
                setMobileNav(false)
                openComposer()
              }}
              userInitials={me.initials}
              userColor={me.color}
              userName={me.name}
            />
          </div>
        </div>
      )}

      {mobileRail && (
        <div className="fixed inset-0 z-40 xl:hidden">
          <div className="absolute inset-0 bg-ink/30" onClick={() => setMobileRail(false)} />
          <div className="absolute inset-y-0 right-0 w-80 max-w-[90vw] overflow-y-auto bg-white p-4 shadow-xl slide-up">
            <div className="mb-2 flex justify-end">
              <button
                type="button"
                onClick={() => setMobileRail(false)}
                className="rounded-xl p-2 text-muted hover:bg-line-soft"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            <SideRail
              presence={presence}
              deptScores={deptScores}
              onOpenChallenge={() => {
                setMobileRail(false)
                navigate('challenge')
              }}
            />
          </div>
        </div>
      )}

      <Composer
        open={composerOpen}
        onClose={() => {
          setComposerOpen(false)
          setComposerTemplate(undefined)
        }}
        onSubmit={handleSubmit}
        onFailBooth={handleFailBooth}
        initialTemplate={composerTemplate}
      />

      {storyIndex !== null && (
        <StoryViewer
          stories={stories}
          index={storyIndex}
          onClose={() => setStoryIndex(null)}
          onIndex={setStoryIndex}
          onViewed={(id) =>
            setStories((prev) => prev.map((s) => (s.id === id ? { ...s, viewed: true } : s)))
          }
        />
      )}
    </div>
  )
}

export type PostType = '学び' | '事例' | '質問' | '失敗' | 'チャレンジ'

export type ReactionKey = 'fire' | 'useful' | 'wow'

export interface Person {
  id: string
  name: string
  team: string
  role: string
  bio: string
  expertise: string[]
  followers: number
  posts: number
  following?: boolean
  color: string
  initials: string
  dept: DeptId
}

export type DeptId = 'sales' | 'eng' | 'cs' | 'hr' | 'marketing' | 'legal' | 'data'

export interface Comment {
  id: string
  authorId: string
  body: string
  createdAt: string
}

export interface TryResult {
  id: string
  authorId: string
  result: string
  createdAt: string
}

export interface Post {
  id: string
  authorId: string
  type: PostType
  title: string
  body: string
  tags: string[]
  topicId?: string
  promptSnippet?: string
  reactions: Record<ReactionKey, number>
  myReactions: ReactionKey[]
  comments: Comment[]
  tryChain: TryResult[]
  iTried?: boolean
  createdAt: string
  pinned?: boolean
  audience: string
}

export interface FailBoothPost {
  id: string
  alias: string
  body: string
  tool: string
  createdAt: string
  expiresInSec: number
  revealed: boolean
  vibes: number
  myVibe?: boolean
}

export interface Story {
  id: string
  authorId: string
  title: string
  body: string
  accent: string
  viewed: boolean
  hoursLeft: number
}

export interface Presence {
  personId: string
  tool: 'Cursor' | 'Claude' | 'ChatGPT' | 'Gemini' | 'Notion AI'
  status: string
  startedAt: string
}

export interface ToolItem {
  id: string
  name: string
  category: string
  license: string
  description: string
  expertIds: string[]
  color: string
}

export interface Topic {
  id: string
  name: string
  description: string
  members: number
  posts: number
  color: string
  icon: string
}

export interface DeptScore {
  id: DeptId
  name: string
  emoji: string
  points: number
  posts: number
  tries: number
  color: string
}

export type TabId = 'home' | 'failbooth' | 'challenge' | 'topics' | 'people' | 'profile'

import { useEffect, useState, type FormEvent } from 'react'
import { X, Ghost } from 'lucide-react'
import type { FailBoothPost, Post, PostType } from '../types'
import { CURRENT_USER_ID } from '../data/mock'

const templates: { type: PostType | '失敗ブース'; title: string; hint: string }[] = [
  { type: '学び', title: '学び', hint: '今日試してうまくいったコツを短く' },
  { type: '事例', title: '事例', hint: '数字やビフォーアフターがあると強い' },
  { type: '質問', title: '質問', hint: '困っていることと、すでに試したことを' },
  { type: '失敗', title: '失敗（公開）', hint: '何が起きて、次どうするかを実名で' },
  { type: 'チャレンジ', title: 'チャレンジ', hint: '今週の課題への回答・参加表明' },
  { type: '失敗ブース', title: '失敗ブース', hint: '匿名・タイムリミット。社内だけのお懺悔' },
]

const tagSuggestions = ['プロンプト術', 'Cursor', 'ChatGPT', 'Claude', '業務活用', '失敗から学ぶ', '新人向け']
const audiences = ['全社', '開発部', '営業本部', 'マーケティング', '自分のチーム']
const aliases = ['匿名のうさぎ', '匿名のねこ', '匿名のきつね', '匿名のぱんだ', '匿名のペンギン']

interface ComposerProps {
  open: boolean
  onClose: () => void
  onSubmit: (post: Post) => void
  onFailBooth: (post: FailBoothPost) => void
  initialTemplate?: PostType | '失敗ブース'
}

export function Composer({ open, onClose, onSubmit, onFailBooth, initialTemplate }: ComposerProps) {
  const [type, setType] = useState<PostType | '失敗ブース'>(initialTemplate ?? '学び')
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const [prompt, setPrompt] = useState('')
  const [tags, setTags] = useState<string[]>([])
  const [audience, setAudience] = useState('全社')
  const [tagInput, setTagInput] = useState('')
  const [tool, setTool] = useState('ChatGPT')

  useEffect(() => {
    if (open && initialTemplate) setType(initialTemplate)
  }, [open, initialTemplate])

  if (!open) return null

  const isBooth = type === '失敗ブース'

  const reset = () => {
    setType('学び')
    setTitle('')
    setBody('')
    setPrompt('')
    setTags([])
    setAudience('全社')
    setTagInput('')
    setTool('ChatGPT')
  }

  const addTag = (t: string) => {
    const clean = t.replace(/^#/, '').trim()
    if (!clean || tags.includes(clean) || tags.length >= 5) return
    setTags([...tags, clean])
    setTagInput('')
  }

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault()
    if (!body.trim()) return

    if (isBooth) {
      const fb: FailBoothPost = {
        id: `fb-${Date.now()}`,
        alias: aliases[Math.floor(Math.random() * aliases.length)],
        body: body.trim(),
        tool,
        createdAt: 'たった今',
        expiresInSec: 3600 * 6,
        revealed: false,
        vibes: 0,
      }
      onFailBooth(fb)
      reset()
      onClose()
      return
    }

    if (!title.trim()) return
    const post: Post = {
      id: `p-${Date.now()}`,
      authorId: CURRENT_USER_ID,
      type: type as PostType,
      title: title.trim(),
      body: body.trim(),
      promptSnippet: prompt.trim() || undefined,
      tags: tags.length ? tags : ['つぶやき'],
      reactions: { fire: 0, useful: 0, wow: 0 },
      myReactions: [],
      comments: [],
      tryChain: [],
      createdAt: 'たった今',
      audience,
    }
    onSubmit(post)
    reset()
    onClose()
  }

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-ink/40 p-4 pt-[6vh] backdrop-blur-md fade-in">
      <div className="absolute inset-0" onClick={onClose} aria-hidden />
      <form
        onSubmit={handleSubmit}
        className="relative slide-up w-full max-w-xl overflow-hidden rounded-3xl border border-line bg-white shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-line px-5 py-4">
          <div>
            <h2 className="font-display text-lg font-extrabold text-ink">
              {isBooth ? '失敗ブースに投稿' : '新規投稿'}
            </h2>
            <p className="text-xs text-muted">
              {isBooth ? '匿名・期限つき。社内の安全なお懺悔スペース' : 'テンプレを選んで、熱量を投下'}
            </p>
          </div>
          <button type="button" onClick={onClose} className="rounded-xl p-2 text-muted hover:bg-line-soft">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="max-h-[70vh] space-y-5 overflow-y-auto p-5 soft-scroll">
          <div>
            <label className="mb-2 block text-xs font-bold text-muted">テンプレート</label>
            <div className="flex flex-wrap gap-2">
              {templates.map((t) => (
                <button
                  key={t.type}
                  type="button"
                  onClick={() => setType(t.type)}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition ${
                    type === t.type
                      ? t.type === '失敗ブース'
                        ? 'bg-pink text-void glow-pink'
                        : 'bg-lime text-void glow-lime'
                      : 'bg-line-soft text-muted hover:text-ink'
                  }`}
                >
                  {t.type === '失敗ブース' && <Ghost className="mr-1 inline h-3 w-3" />}
                  {t.title}
                </button>
              ))}
            </div>
            <p className="mt-2 text-xs text-faint">{templates.find((t) => t.type === type)?.hint}</p>
          </div>

          {!isBooth && (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-muted">タイトル</label>
              <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="一言で刺さる見出し"
                className="w-full rounded-xl border border-line bg-line-soft px-3 py-2.5 text-sm outline-none ring-lime/40 transition focus:ring-2"
                required={!isBooth}
              />
            </div>
          )}

          <div>
            <label className="mb-1.5 block text-xs font-bold text-muted">
              {isBooth ? '懺悔（匿名）' : '本文'}
            </label>
            <textarea
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder={isBooth ? '何が起きた？次どうする？個人情報は書かないでね' : '手順、プロンプト、結果や学びを…'}
              rows={5}
              className="w-full resize-none rounded-xl border border-line bg-line-soft px-3 py-2.5 text-sm outline-none ring-lime/40 transition focus:ring-2"
              required
            />
          </div>

          {isBooth && (
            <div>
              <label className="mb-1.5 block text-xs font-bold text-muted">使ってたツール</label>
              <div className="flex flex-wrap gap-2">
                {['ChatGPT', 'Claude', 'Cursor', 'Gemini', 'その他'].map((t) => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setTool(t)}
                    className={`rounded-lg px-3 py-1.5 text-xs font-bold ${
                      tool === t ? 'bg-pink text-void' : 'bg-line-soft text-muted'
                    }`}
                  >
                    {t}
                  </button>
                ))}
              </div>
            </div>
          )}

          {!isBooth && (
            <>
              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted">プロンプト断片（任意・試したチェーン用）</label>
                <textarea
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  placeholder="コピーして試せる短いプロンプト"
                  rows={2}
                  className="w-full resize-none rounded-xl border border-line bg-line-soft px-3 py-2.5 font-mono text-xs outline-none focus:ring-2 focus:ring-cyan/40"
                />
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted">タグ</label>
                <div className="mb-2 flex flex-wrap gap-1.5">
                  {tags.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setTags(tags.filter((x) => x !== t))}
                      className="rounded-md bg-lime/15 px-2 py-0.5 text-xs font-medium text-lime"
                    >
                      #{t} ×
                    </button>
                  ))}
                </div>
                <input
                  value={tagInput}
                  onChange={(e) => setTagInput(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault()
                      addTag(tagInput)
                    }
                  }}
                  placeholder="タグを入力して Enter"
                  className="w-full rounded-xl border border-line bg-line-soft px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-lime/40"
                />
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {tagSuggestions
                    .filter((t) => !tags.includes(t))
                    .map((t) => (
                      <button
                        key={t}
                        type="button"
                        onClick={() => addTag(t)}
                        className="rounded-md bg-line-soft px-2 py-0.5 text-xs text-muted hover:bg-lime/15 hover:text-lime"
                      >
                        + {t}
                      </button>
                    ))}
                </div>
              </div>

              <div>
                <label className="mb-1.5 block text-xs font-bold text-muted">公開範囲</label>
                <div className="flex flex-wrap gap-2">
                  {audiences.map((a) => (
                    <button
                      key={a}
                      type="button"
                      onClick={() => setAudience(a)}
                      className={`rounded-lg px-3 py-1.5 text-xs font-bold transition ${
                        audience === a ? 'bg-cyan text-void' : 'bg-line-soft text-muted hover:text-ink'
                      }`}
                    >
                      {a}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}
        </div>

        <div className="flex items-center justify-end gap-2 border-t border-line px-5 py-4">
          <button
            type="button"
            onClick={onClose}
            className="rounded-xl px-4 py-2 text-sm font-medium text-muted hover:bg-line-soft"
          >
            キャンセル
          </button>
          <button
            type="submit"
            className={`rounded-xl px-5 py-2 text-sm font-extrabold text-void transition ${
              isBooth
                ? 'bg-pink shadow-[0_0_24px_-6px_rgba(255,45,149,0.7)] hover:brightness-110'
                : 'bg-lime shadow-[0_0_24px_-6px_rgba(200,255,0,0.7)] hover:brightness-110'
            }`}
          >
            {isBooth ? '匿名で投下' : 'Pulseに投稿'}
          </button>
        </div>
      </form>
    </div>
  )
}

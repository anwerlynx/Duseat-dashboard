'use client'

import * as React from 'react'
import { MessageSquare, X, Send, Bot, User, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ChatMsg {
  id: number
  sender: string
  body: string
  time: string
  isSelf: boolean
}

const defaultMessages: ChatMsg[] = [
  { id: 1, sender: 'Compliance Officer', body: 'Agent #AG-1048 trade license was validated with DED registry.', time: '10:14 AM', isSelf: false },
  { id: 2, sender: 'You', body: 'Great, thanks for the update. Flagging for final approval.', time: '10:16 AM', isSelf: true },
  { id: 3, sender: 'Support Bot', body: 'All 3 pending investor verification requests queued for inspection.', time: '10:30 AM', isSelf: false },
]

export function MessagingPanel() {
  const [open, setOpen] = React.useState(false)
  const [messages, setMessages] = React.useState<ChatMsg[]>(defaultMessages)
  const [text, setText] = React.useState('')
  const [isTyping, setIsTyping] = React.useState(false)
  const ref = React.useRef<HTMLDivElement>(null)
  const messagesEndRef = React.useRef<HTMLDivElement>(null)

  // Load from LocalStorage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('duseat_chat_messages')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed) && parsed.length > 0) setMessages(parsed)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const saveMessages = (items: ChatMsg[]) => {
    setMessages(items)
    try {
      localStorage.setItem('duseat_chat_messages', JSON.stringify(items))
    } catch (e) {
      // ignore
    }
  }

  // Scroll to bottom when messages update
  React.useEffect(() => {
    if (open) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }
  }, [messages, open, isTyping])

  // Click outside to close
  React.useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false)
    }
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handleClick)
      document.removeEventListener('keydown', handleKey)
    }
  }, [open])

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault()
    if (!text.trim()) return

    const userMsg: ChatMsg = {
      id: Date.now(),
      sender: 'You',
      body: text.trim(),
      time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      isSelf: true,
    }

    const updated = [...messages, userMsg]
    saveMessages(updated)
    setText('')

    // Simulate intelligent platform bot response after 900ms
    setIsTyping(true)
    setTimeout(() => {
      setIsTyping(false)
      const botReplies = [
        'Understood. The action has been logged into the platform audit trail.',
        'Checked the latest marketplace data. Everything is operating smoothly.',
        'Noted. Will sync with the investor & agent management queues.',
        'All active deals and offers in this category are updated.',
      ]
      const randomReply = botReplies[Math.floor(Math.random() * botReplies.length)]
      const replyMsg: ChatMsg = {
        id: Date.now() + 1,
        sender: 'AI Operations Assistant',
        body: randomReply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        isSelf: false,
      }
      saveMessages([...updated, replyMsg])
    }, 900)
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle platform messaging"
        aria-expanded={open}
        className={cn(
          'relative flex size-9 items-center justify-center rounded-lg border border-input bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
          open && 'bg-secondary text-foreground'
        )}
      >
        <MessageSquare className="size-[18px]" />
        <span className="absolute right-1.5 top-1.5 size-2 rounded-full bg-brand ring-2 ring-card" />
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 flex h-[460px] w-80 sm:w-96 flex-col origin-top-right animate-fade-up rounded-2xl border border-border bg-popover shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2.5">
              <span className="flex size-7 items-center justify-center rounded-lg bg-accent text-brand">
                <Sparkles className="size-4" />
              </span>
              <div>
                <h3 className="text-sm font-bold text-foreground">Operations Messenger</h3>
                <p className="text-[11px] text-muted-foreground">Internal team & system channel</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>

          {/* Messages list */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m) => (
              <div key={m.id} className={cn('flex flex-col', m.isSelf ? 'items-end' : 'items-start')}>
                <div className="flex items-center gap-1.5 mb-1 px-1">
                  <span className="text-[10px] font-semibold text-muted-foreground">{m.sender}</span>
                  <span className="text-[9px] text-muted-foreground/70">{m.time}</span>
                </div>
                <div
                  className={cn(
                    'max-w-[85%] rounded-2xl px-3.5 py-2 text-xs leading-relaxed shadow-sm',
                    m.isSelf
                      ? 'rounded-br-none bg-primary text-primary-foreground'
                      : 'rounded-bl-none border border-border bg-card text-card-foreground'
                  )}
                >
                  {m.body}
                </div>
              </div>
            ))}

            {isTyping && (
              <div className="flex items-center gap-2 text-xs text-muted-foreground">
                <span className="size-2 animate-bounce rounded-full bg-brand" />
                <span className="size-2 animate-bounce rounded-full bg-brand [animation-delay:0.2s]" />
                <span className="size-2 animate-bounce rounded-full bg-brand [animation-delay:0.4s]" />
                <span className="text-[11px]">Assistant is replying…</span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Input Form */}
          <form onSubmit={handleSend} className="border-t border-border bg-card p-3 rounded-b-2xl">
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={text}
                onChange={(e) => setText(e.target.value)}
                placeholder="Type your message..."
                className="flex-1 rounded-xl border border-input bg-background px-3.5 py-2 text-xs outline-none focus:border-ring focus:ring-2 focus:ring-ring/30"
              />
              <button
                type="submit"
                disabled={!text.trim()}
                className="flex size-8 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-all hover:bg-primary/90 disabled:opacity-40"
              >
                <Send className="size-3.5" />
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  )
}

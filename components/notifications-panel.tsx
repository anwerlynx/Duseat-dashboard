'use client'

import * as React from 'react'
import { Bell, X, Check, CheckCheck, Trash2, Plus, Sparkles } from 'lucide-react'
import { cn } from '@/lib/utils'

interface NotificationItem {
  id: number
  title: string
  body: string
  read: boolean
  time: string
}

const defaultNotifications: NotificationItem[] = [
  { id: 1, title: 'New agent verification', body: 'Layla Haddad submitted documents for review.', read: false, time: '10m ago' },
  { id: 2, title: 'Offer accepted', body: 'An investor accepted an offer in Downtown apartment.', read: false, time: '35m ago' },
  { id: 3, title: 'Subscription renewal', body: 'Three agent packages renewed successfully.', read: true, time: '2h ago' },
  { id: 4, title: 'Security check', body: 'Zero anomalous login attempts detected.', read: true, time: '5h ago' },
]

export function NotificationsPanel() {
  const [open, setOpen] = React.useState(false)
  const [notifications, setNotifications] = React.useState<NotificationItem[]>(defaultNotifications)
  const ref = React.useRef<HTMLDivElement>(null)

  // Load from local storage
  React.useEffect(() => {
    try {
      const saved = localStorage.getItem('duseat_notifications')
      if (saved) {
        const parsed = JSON.parse(saved)
        if (Array.isArray(parsed)) setNotifications(parsed)
      }
    } catch (e) {
      // ignore
    }
  }, [])

  const save = (items: NotificationItem[]) => {
    setNotifications(items)
    try {
      localStorage.setItem('duseat_notifications', JSON.stringify(items))
    } catch (e) {
      // ignore
    }
  }

  // Click outside to close
  React.useEffect(() => {
    if (!open) return
    const handleClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
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

  const handleMarkRead = (id: number) => {
    save(notifications.map((n) => (n.id === id ? { ...n, read: true } : n)))
  }

  const handleMarkAllRead = () => {
    save(notifications.map((n) => ({ ...n, read: true })))
  }

  const handleClearAll = () => {
    save([])
  }

  const handleAddSample = () => {
    const newItem: NotificationItem = {
      id: Date.now(),
      title: 'Real-time alert',
      body: `New marketplace event registered at ${new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}.`,
      read: false,
      time: 'Just now',
    }
    save([newItem, ...notifications])
  }

  const unreadCount = notifications.filter((n) => !n.read).length

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        aria-label="Toggle notifications menu"
        aria-expanded={open}
        className={cn(
          'relative flex size-9 items-center justify-center rounded-lg border border-input bg-card text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground',
          open && 'bg-secondary text-foreground'
        )}
      >
        <Bell className="size-[18px]" />
        {unreadCount > 0 && (
          <span className="absolute right-1.5 top-1.5 flex size-2.5 items-center justify-center rounded-full bg-destructive ring-2 ring-card">
            <span className="sr-only">{unreadCount} unread</span>
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 sm:w-96 origin-top-right animate-fade-up rounded-2xl border border-border bg-popover p-0 shadow-2xl">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border p-4">
            <div className="flex items-center gap-2">
              <h3 className="font-bold text-foreground">Notifications</h3>
              {unreadCount > 0 && (
                <span className="rounded-full bg-accent px-2 py-0.5 text-xs font-semibold text-accent-foreground">
                  {unreadCount} new
                </span>
              )}
            </div>
            <div className="flex items-center gap-1">
              <button
                type="button"
                onClick={handleAddSample}
                title="Send test alert"
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <Plus className="size-4" />
              </button>
              {unreadCount > 0 && (
                <button
                  type="button"
                  onClick={handleMarkAllRead}
                  title="Mark all as read"
                  className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
                >
                  <CheckCheck className="size-4" />
                </button>
              )}
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="flex size-7 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
              >
                <X className="size-4" />
              </button>
            </div>
          </div>

          {/* List */}
          <div className="max-h-80 overflow-y-auto divide-y divide-border">
            {notifications.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-8 text-center">
                <Bell className="size-8 text-muted-foreground/40" />
                <p className="mt-2 text-sm font-semibold text-foreground">No notifications</p>
                <p className="text-xs text-muted-foreground">You are completely up to date!</p>
                <button
                  type="button"
                  onClick={handleAddSample}
                  className="mt-3 rounded-lg border border-input bg-card px-3 py-1.5 text-xs font-medium hover:bg-secondary"
                >
                  Create demo notification
                </button>
              </div>
            ) : (
              notifications.map((n) => (
                <div
                  key={n.id}
                  onClick={() => handleMarkRead(n.id)}
                  className={cn(
                    'group flex cursor-pointer items-start gap-3 p-3.5 transition-colors hover:bg-secondary/60',
                    !n.read && 'bg-accent/40'
                  )}
                >
                  <span
                    className={cn(
                      'mt-1 size-2 shrink-0 rounded-full',
                      n.read ? 'bg-transparent' : 'bg-brand ring-4 ring-brand/20'
                    )}
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between gap-1">
                      <p className="truncate text-xs font-semibold text-foreground">{n.title}</p>
                      <span className="text-[10px] text-muted-foreground">{n.time}</span>
                    </div>
                    <p className="mt-0.5 text-xs text-muted-foreground leading-relaxed">{n.body}</p>
                  </div>
                  {!n.read && (
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation()
                        handleMarkRead(n.id)
                      }}
                      className="size-6 shrink-0 rounded text-muted-foreground opacity-0 group-hover:opacity-100 hover:text-brand"
                    >
                      <Check className="size-4" />
                    </button>
                  )}
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {notifications.length > 0 && (
            <div className="flex items-center justify-between border-t border-border bg-secondary/30 px-4 py-2.5 text-xs">
              <button
                type="button"
                onClick={handleMarkAllRead}
                className="font-medium text-brand hover:underline"
              >
                Mark all as read
              </button>
              <button
                type="button"
                onClick={handleClearAll}
                className="text-muted-foreground hover:text-destructive"
              >
                Clear all
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

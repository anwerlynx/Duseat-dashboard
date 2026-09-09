'use client'

import * as React from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { CheckCircle2, Info, TriangleAlert, X, ExternalLink } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ToastVariant = 'success' | 'error' | 'info'

export interface Toast {
  id: number
  title: string
  description?: string
  variant: ToastVariant
  actionLabel?: string
  actionRoute?: string
  onAction?: () => void
}

export interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const variantConfig: Record<ToastVariant, { icon: React.ReactNode; ring: string }> = {
  success: { icon: <CheckCircle2 className="size-5 text-[#17b26a]" />, ring: 'border-l-[#17b26a]' },
  error: { icon: <TriangleAlert className="size-5 text-[#d92d20]" />, ring: 'border-l-[#d92d20]' },
  info: { icon: <Info className="size-5 text-[#00c2cb]" />, ring: 'border-l-[#00c2cb]' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter()
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const idRef = React.useRef(0)

  const remove = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = ++idRef.current
      setToasts((prev) => [...prev, { ...t, id }])
      setTimeout(() => remove(id), 5000)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2 font-sans">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex animate-in fade-in slide-in-from-bottom-2 items-start gap-3 rounded-xl border border-[#d3d5d7] border-l-4 bg-white p-3.5 shadow-xl',
              variantConfig[t.variant].ring,
            )}
          >
            <div className="mt-0.5 shrink-0">{variantConfig[t.variant].icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold text-[#1f2327]">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-[#6f777f] leading-relaxed">{t.description}</p>}
              {t.actionLabel && (
                <div className="mt-2 flex items-center gap-2">
                  {t.actionRoute ? (
                    <Link
                      href={t.actionRoute}
                      onClick={() => remove(t.id)}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#00c2cb] hover:underline"
                    >
                      <span>{t.actionLabel}</span>
                      <ExternalLink className="size-3" />
                    </Link>
                  ) : t.onAction ? (
                    <button
                      type="button"
                      onClick={() => {
                        t.onAction?.()
                        remove(t.id)
                      }}
                      className="inline-flex items-center gap-1 text-xs font-bold text-[#00c2cb] hover:underline cursor-pointer"
                    >
                      <span>{t.actionLabel}</span>
                    </button>
                  ) : null}
                </div>
              )}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => remove(t.id)}
              className="rounded-md p-0.5 text-[#9da4ae] transition-colors hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer shrink-0"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

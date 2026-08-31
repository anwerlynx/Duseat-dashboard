'use client'

import * as React from 'react'
import { CheckCircle2, Info, TriangleAlert, X } from 'lucide-react'
import { cn } from '@/lib/utils'

type ToastVariant = 'success' | 'error' | 'info'

interface Toast {
  id: number
  title: string
  description?: string
  variant: ToastVariant
}

interface ToastContextValue {
  toast: (t: Omit<Toast, 'id'>) => void
}

const ToastContext = React.createContext<ToastContextValue | null>(null)

export function useToast() {
  const ctx = React.useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}

const variantConfig: Record<ToastVariant, { icon: React.ReactNode; ring: string }> = {
  success: { icon: <CheckCircle2 className="size-5 text-success" />, ring: 'border-l-success' },
  error: { icon: <TriangleAlert className="size-5 text-destructive" />, ring: 'border-l-destructive' },
  info: { icon: <Info className="size-5 text-brand" />, ring: 'border-l-brand' },
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<Toast[]>([])
  const idRef = React.useRef(0)

  const remove = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }, [])

  const toast = React.useCallback(
    (t: Omit<Toast, 'id'>) => {
      const id = ++idRef.current
      setToasts((prev) => [...prev, { ...t, id }])
      setTimeout(() => remove(id), 4000)
    },
    [remove],
  )

  return (
    <ToastContext.Provider value={{ toast }}>
      {children}
      <div className="pointer-events-none fixed bottom-4 right-4 z-[100] flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            role="status"
            className={cn(
              'pointer-events-auto flex animate-fade-up items-start gap-3 rounded-xl border border-border border-l-4 bg-popover p-3.5 shadow-lg',
              variantConfig[t.variant].ring,
            )}
          >
            <div className="mt-0.5 shrink-0">{variantConfig[t.variant].icon}</div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-foreground">{t.title}</p>
              {t.description && <p className="mt-0.5 text-xs text-muted-foreground">{t.description}</p>}
            </div>
            <button
              type="button"
              aria-label="Dismiss notification"
              onClick={() => remove(t.id)}
              className="rounded-md p-0.5 text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  )
}

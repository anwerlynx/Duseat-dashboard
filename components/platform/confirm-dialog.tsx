'use client'

import * as React from 'react'
import { AlertTriangle, KeyRound, ShieldOff, Trash2, UserX, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ConfirmTone = 'danger' | 'warning' | 'brand'

export type ConfirmRequest = {
  title: string
  description: string
  confirmLabel: string
  tone?: ConfirmTone
  icon?: 'delete' | 'ban' | 'suspend' | 'reset' | 'warning'
  onConfirm: () => void
}

const iconMap = {
  delete: Trash2,
  ban: ShieldOff,
  suspend: UserX,
  reset: KeyRound,
  warning: AlertTriangle,
}

const toneStyles: Record<ConfirmTone, { badge: string; confirm: string }> = {
  danger: { badge: 'bg-destructive/15 text-destructive', confirm: 'bg-destructive text-destructive-foreground hover:bg-destructive/90' },
  warning: { badge: 'bg-amber-100 text-amber-700', confirm: 'bg-amber-500 text-white hover:bg-amber-600' },
  brand: { badge: 'bg-accent text-brand', confirm: 'bg-primary text-primary-foreground hover:bg-primary/90' },
}

export function ConfirmDialog({ request, onClose }: { request: ConfirmRequest | null; onClose: () => void }) {
  React.useEffect(() => {
    if (!request) return
    const onKey = (event: KeyboardEvent) => { if (event.key === 'Escape') onClose() }
    document.addEventListener('keydown', onKey)
    return () => document.removeEventListener('keydown', onKey)
  }, [request, onClose])

  if (!request) return null
  const tone = request.tone ?? 'danger'
  const Icon = iconMap[request.icon ?? (tone === 'danger' ? 'warning' : 'warning')]

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center bg-foreground/40 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-label={request.title}>
      <button type="button" onClick={onClose} className="absolute inset-0 cursor-default" aria-label="Cancel" />
      <div className="relative w-full max-w-sm rounded-2xl border border-border bg-card p-3 shadow-2xl">
        <div className="flex justify-end">
          <button type="button" onClick={onClose} aria-label="Close" className="rounded-md p-1 text-muted-foreground hover:bg-secondary hover:text-foreground"><X className="size-4" /></button>
        </div>
        <div className="flex flex-col items-center gap-6 px-3 pb-2">
          <div className="flex flex-col items-center gap-6">
            <span className="flex size-[68px] items-center justify-center rounded-xl border border-border">
              <span className={cn('flex size-[42px] items-center justify-center rounded-lg', toneStyles[tone].badge)}><Icon className="size-5" /></span>
            </span>
            <div className="space-y-2 text-center">
              <h2 className="text-lg font-semibold text-foreground">{request.title}</h2>
              <p className="text-sm text-muted-foreground text-pretty">{request.description}</p>
            </div>
          </div>
          <div className="flex w-full items-center gap-3">
            <button type="button" onClick={onClose} className="h-11 flex-1 rounded-lg border border-input text-sm font-medium hover:bg-secondary">Cancel</button>
            <button type="button" onClick={() => { request.onConfirm(); onClose() }} className={cn('h-11 flex-1 rounded-lg text-sm font-medium', toneStyles[tone].confirm)}>{request.confirmLabel}</button>
          </div>
        </div>
      </div>
    </div>
  )
}

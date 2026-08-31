'use client'

import * as React from 'react'
import { TriangleAlert } from 'lucide-react'
import { cn } from '@/lib/utils'

interface ConfirmDialogProps {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  destructive?: boolean
  onConfirm: () => void
  onCancel: () => void
}

export function ConfirmDialog({
  open,
  title,
  description,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  destructive = true,
  onConfirm,
  onCancel,
}: ConfirmDialogProps) {
  React.useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onCancel()
    }
    document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open, onCancel])

  if (!open) return null

  return (
    <div className="fixed inset-0 z-[90] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-foreground/40 backdrop-blur-[2px] animate-fade-up"
        onClick={onCancel}
        aria-hidden="true"
      />
      <div
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-title"
        className="relative z-10 w-full max-w-md animate-fade-up rounded-2xl border border-border bg-popover p-6 shadow-xl"
      >
        <div className="flex items-start gap-4">
          <div
            className={cn(
              'flex size-10 shrink-0 items-center justify-center rounded-full',
              destructive ? 'bg-destructive/10 text-destructive' : 'bg-brand/10 text-brand',
            )}
          >
            <TriangleAlert className="size-5" />
          </div>
          <div className="flex-1">
            <h2 id="confirm-title" className="text-base font-semibold text-foreground">
              {title}
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">{description}</p>
          </div>
        </div>
        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="rounded-lg border border-input bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={cn(
              'rounded-lg px-4 py-2 text-sm font-medium text-white transition-colors focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none',
              destructive
                ? 'bg-destructive hover:bg-destructive/90 focus-visible:ring-destructive'
                : 'bg-brand hover:bg-brand/90 focus-visible:ring-brand',
            )}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  )
}

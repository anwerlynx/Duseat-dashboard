'use client'

import * as React from 'react'
import { X, LucideIcon } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface ModalShellProps {
  isOpen?: boolean
  onClose: () => void
  title: string
  subtitle?: string
  icon?: LucideIcon
  iconTone?: 'neutral' | 'brand' | 'success' | 'warning' | 'destructive'
  children: React.ReactNode
  footer?: React.ReactNode
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '2xl' | '5xl'
  className?: string
}

export function ModalShell({
  isOpen = true,
  onClose,
  title,
  subtitle,
  icon: Icon,
  iconTone = 'brand',
  children,
  footer,
  maxWidth = 'lg',
  className,
}: ModalShellProps) {
  React.useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose()
    }
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [onClose])

  if (!isOpen) return null

  const iconToneStyles = {
    neutral: 'bg-[#eff1f3] text-[#1f2327]',
    brand: 'bg-[#e5f6f7] text-[#00c2cb]',
    success: 'bg-[#dfefe8] text-[#17b26a]',
    warning: 'bg-[#fffaf0] text-[#f79009] border border-[#f79009]/20',
    destructive: 'bg-[#f3e1e0] text-[#d92d20]',
  }

  const maxWidthStyles = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '2xl': 'max-w-2xl',
    '5xl': 'max-w-5xl',
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div
        className={cn(
          'relative flex w-full flex-col overflow-hidden rounded-[12px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom',
          maxWidthStyles[maxWidth],
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d3d5d7] px-5 py-4 bg-[#fcfcfc]">
          <div className="flex items-center gap-3">
            {Icon && (
              <div
                className={cn(
                  'flex size-10 items-center justify-center rounded-[8px]',
                  iconToneStyles[iconTone]
                )}
              >
                <Icon className="size-5" />
              </div>
            )}
            <div>
              <h2 className="text-[18px] font-bold text-[#1f2327]">{title}</h2>
              {subtitle && <p className="text-[13px] text-[#6f777f]">{subtitle}</p>}
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close modal"
            className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 overflow-y-auto max-h-[75vh] space-y-4">{children}</div>

        {/* Footer */}
        {footer && (
          <div className="flex items-center justify-between border-t border-[#d3d5d7] px-5 py-3.5 bg-[#fcfcfc]">
            {footer}
          </div>
        )}
      </div>
    </div>
  )
}

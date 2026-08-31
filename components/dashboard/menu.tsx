'use client'

import * as React from 'react'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

interface MenuOption {
  label: string
  value: string
  icon?: React.ReactNode
  destructive?: boolean
}

interface DropdownProps {
  label?: string
  value?: string
  options: MenuOption[]
  onSelect: (value: string) => void
  align?: 'start' | 'end'
  trigger?: React.ReactNode
  className?: string
  menuClassName?: string
  ariaLabel?: string
  floating?: boolean
}

function useClickOutside(ref: React.RefObject<HTMLElement | null>, onClose: () => void, open: boolean) {
  React.useEffect(() => {
    if (!open) return
    function handle(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) onClose()
    }
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') onClose()
    }
    document.addEventListener('mousedown', handle)
    document.addEventListener('keydown', handleKey)
    return () => {
      document.removeEventListener('mousedown', handle)
      document.removeEventListener('keydown', handleKey)
    }
  }, [ref, onClose, open])
}

export function Dropdown({
  label,
  value,
  options,
  onSelect,
  align = 'end',
  trigger,
  className,
  menuClassName,
  ariaLabel,
  floating = false,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [position, setPosition] = React.useState<{ top: number; left?: number; right?: number }>()
  const ref = React.useRef<HTMLDivElement>(null)
  const triggerRef = React.useRef<HTMLButtonElement>(null)
  useClickOutside(ref, () => setOpen(false), open)
  React.useEffect(() => {
    if (!open || !floating || !triggerRef.current) return
    const update = () => { const rect = triggerRef.current?.getBoundingClientRect(); if (!rect) return; setPosition({ top: rect.bottom + 8, right: window.innerWidth - rect.right }) }
    update()
    window.addEventListener('resize', update)
    window.addEventListener('scroll', update, true)
    return () => { window.removeEventListener('resize', update); window.removeEventListener('scroll', update, true) }
  }, [open, floating])

  const current = options.find((o) => o.value === value)

  return (
    <div ref={ref} className={cn('relative', className)}>
      {trigger ? (
        <button
          type="button"
          aria-label={ariaLabel}
          ref={triggerRef}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center outline-none"
        >
          {trigger}
        </button>
      ) : (
        <button
          type="button"
          ref={triggerRef}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={() => setOpen((o) => !o)}
          className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none"
        >
          {current?.label ?? label}
          <ChevronDown className={cn('size-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')} />
        </button>
      )}

      {open && (
        <div
          role="menu"
          style={floating && position ? { position: 'fixed', top: position.top, right: position.right } : undefined}
          className={cn(
            floating ? 'fixed z-[100] min-w-[180px] origin-top ant-dropdown-pop rounded-xl border border-border bg-popover p-1 shadow-lg' : 'absolute z-50 mt-2 min-w-[180px] origin-top ant-dropdown-pop rounded-xl border border-border bg-popover p-1 shadow-lg',
            !floating && (align === 'end' ? 'right-0' : 'left-0'),
            menuClassName,
          )}
        >
          {options.map((opt) => {
            const active = opt.value === value
            return (
              <button
                key={opt.value}
                type="button"
                role="menuitem"
                onClick={() => {
                  onSelect(opt.value)
                  setOpen(false)
                }}
                className={cn(
                  'flex w-full items-center gap-2 rounded-lg px-3 py-2 text-left text-sm transition-colors',
                  opt.destructive
                    ? 'text-destructive hover:bg-destructive/10'
                    : 'text-foreground hover:bg-secondary',
                  active && !opt.destructive && 'bg-secondary font-medium',
                )}
              >
                {opt.icon}
                <span className="flex-1">{opt.label}</span>
                {active && <span className="size-1.5 rounded-full bg-brand" />}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}

'use client'

import * as React from 'react'
import { createPortal } from 'react-dom'
import { ChevronDown } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface MenuOption {
  label: string
  value: string
  icon?: React.ReactNode
  destructive?: boolean
}

export interface DropdownProps {
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
}: DropdownProps) {
  const [open, setOpen] = React.useState(false)
  const [mounted, setMounted] = React.useState(false)
  const [position, setPosition] = React.useState<{ top: number; left?: number; right?: number } | null>(null)

  const triggerRef = React.useRef<HTMLButtonElement>(null)
  const menuRef = React.useRef<HTMLDivElement>(null)

  React.useEffect(() => {
    setMounted(true)
  }, [])

  const updatePosition = React.useCallback(() => {
    if (!triggerRef.current) return
    const rect = triggerRef.current.getBoundingClientRect()

    // If trigger element has zero dimension or scrolled way off screen
    if (rect.width === 0 && rect.height === 0) {
      setOpen(false)
      return
    }

    const menuEl = menuRef.current
    const menuWidth = menuEl ? menuEl.offsetWidth : 210
    const menuHeight = menuEl ? menuEl.offsetHeight : Math.min(360, options.length * 42 + 20)

    // Vertical: default right below trigger with 6px gap
    let top = rect.bottom + 6

    // If menu exceeds bottom of screen, flip above trigger
    if (top + menuHeight > window.innerHeight - 8 && rect.top - menuHeight > 8) {
      top = rect.top - menuHeight - 6
    }

    // Horizontal alignment
    let left: number | undefined
    let right: number | undefined

    if (align === 'end') {
      right = Math.max(8, window.innerWidth - rect.right)
      if (rect.right - menuWidth < 8) {
        // Off left screen boundary
        right = undefined
        left = 8
      }
    } else {
      left = Math.max(8, rect.left)
      if (rect.left + menuWidth > window.innerWidth - 8) {
        // Off right screen boundary
        left = undefined
        right = 8
      }
    }

    setPosition({ top, left, right })
  }, [align, options.length])

  // Update position on open, window resize, and window scroll
  React.useEffect(() => {
    if (!open) {
      setPosition(null)
      return
    }

    updatePosition()

    const handleScrollOrResize = () => {
      updatePosition()
    }

    window.addEventListener('resize', handleScrollOrResize, { passive: true })
    window.addEventListener('scroll', handleScrollOrResize, { capture: true, passive: true })

    return () => {
      window.removeEventListener('resize', handleScrollOrResize)
      window.removeEventListener('scroll', handleScrollOrResize, { capture: true } as any)
    }
  }, [open, updatePosition])

  // Click outside and Escape key to close
  React.useEffect(() => {
    if (!open) return

    function handleMouseDown(e: MouseEvent) {
      const target = e.target as Node
      if (
        triggerRef.current &&
        !triggerRef.current.contains(target) &&
        menuRef.current &&
        !menuRef.current.contains(target)
      ) {
        setOpen(false)
      }
    }

    function handleKeyDown(e: KeyboardEvent) {
      if (e.key === 'Escape') {
        setOpen(false)
      }
    }

    document.addEventListener('mousedown', handleMouseDown)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('mousedown', handleMouseDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [open])

  const current = options.find((o) => o.value === value)

  return (
    <div className={cn('relative inline-flex', className)}>
      {trigger ? (
        <div
          role="button"
          tabIndex={0}
          aria-label={ariaLabel}
          ref={triggerRef as any}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation()
            setOpen((o) => !o)
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault()
              e.stopPropagation()
              setOpen((o) => !o)
            }
          }}
          className="inline-flex items-center outline-none cursor-pointer"
        >
          {trigger}
        </div>
      ) : (
        <button
          type="button"
          ref={triggerRef}
          aria-haspopup="menu"
          aria-expanded={open}
          onClick={(e) => {
            e.stopPropagation()
            setOpen((o) => !o)
          }}
          className="inline-flex items-center gap-1.5 rounded-lg border border-input bg-card px-3 py-1.5 text-sm font-medium text-foreground shadow-sm transition-colors hover:bg-secondary focus-visible:ring-2 focus-visible:ring-ring focus-visible:outline-none cursor-pointer"
        >
          {current?.label ?? label}
          <ChevronDown
            className={cn('size-4 text-muted-foreground transition-transform duration-200', open && 'rotate-180')}
          />
        </button>
      )}

      {/* Portal Dropdown Menu directly in document.body */}
      {open &&
        mounted &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            aria-label={ariaLabel}
            style={{
              position: 'fixed',
              top: position?.top ?? 0,
              left: position?.left !== undefined ? position.left : undefined,
              right: position?.right !== undefined ? position.right : undefined,
              visibility: position ? 'visible' : 'hidden',
              zIndex: 99999,
            }}
            className={cn(
              'min-w-[210px] max-w-[calc(100vw-16px)] origin-top rounded-[12px] border border-[#E5E7EB] bg-white p-1.5 shadow-[0px_10px_38px_rgba(0,0,0,0.14),0px_3px_10px_rgba(0,0,0,0.06)] font-sans transition-opacity duration-150 animate-in fade-in zoom-in-95',
              menuClassName
            )}
          >
            {options.map((opt) => {
              const active = opt.value === value
              return (
                <button
                  key={opt.value}
                  type="button"
                  role="menuitem"
                  onClick={(e) => {
                    e.stopPropagation()
                    onSelect(opt.value)
                    setOpen(false)
                  }}
                  className={cn(
                    'flex w-full items-center gap-2.5 rounded-[8px] px-3 py-2 text-left text-[13.5px] font-medium transition-colors cursor-pointer',
                    opt.destructive
                      ? 'text-[#D92D20] hover:bg-[#FEF3F2]'
                      : 'text-[#344054] hover:bg-[#F3F4F6] hover:text-[#101828]',
                    active && !opt.destructive && 'bg-[#F3F4F6] font-semibold text-[#101828]'
                  )}
                >
                  {opt.icon && (
                    <span className="shrink-0 size-4 flex items-center justify-center text-inherit">
                      {opt.icon}
                    </span>
                  )}
                  <span className="flex-1 truncate">{opt.label}</span>
                  {active && <span className="size-1.5 rounded-full bg-[#00C2CB] shrink-0" />}
                </button>
              )
            })}
          </div>,
          document.body
        )}
    </div>
  )
}

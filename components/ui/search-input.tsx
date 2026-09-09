'use client'

import * as React from 'react'
import { Search, X } from 'lucide-react'
import { cn } from '@/lib/utils'

export interface SearchInputProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'onChange'> {
  value: string
  onChange?: ((event: React.ChangeEvent<HTMLInputElement>) => void) | ((value: string) => void)
  onClear?: () => void
  sizeVariant?: 'sm' | 'md'
  containerClassName?: string
}

export function SearchInput({
  value,
  onChange,
  onClear,
  placeholder = 'Search by keyword, name, email or ID…',
  sizeVariant = 'md',
  className,
  containerClassName,
  disabled,
  ...props
}: SearchInputProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!onChange) return
    // Support both (e: ChangeEvent) => void and (value: string) => void
    try {
      ;(onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(e)
    } catch {
      ;(onChange as (val: string) => void)(e.target.value)
    }
  }

  const handleClear = (e: React.MouseEvent) => {
    e.stopPropagation()
    if (onClear) {
      onClear()
    } else if (onChange) {
      try {
        ;(onChange as (val: string) => void)('')
      } catch {
        const event = {
          target: { value: '' },
        } as React.ChangeEvent<HTMLInputElement>
        ;(onChange as (e: React.ChangeEvent<HTMLInputElement>) => void)(event)
      }
    }
  }

  return (
    <div className={cn('relative flex-1 min-w-[200px]', containerClassName)}>
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae] pointer-events-none" />
      <input
        type="text"
        value={value}
        onChange={handleChange}
        disabled={disabled}
        placeholder={placeholder}
        className={cn(
          'w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-8 text-[#1f2327] outline-none placeholder:text-[#9da4ae] transition-colors focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20 disabled:bg-[#eff1f3] disabled:opacity-60',
          sizeVariant === 'sm' ? 'h-[32px] text-[13px]' : 'h-[38px] text-[14px]',
          className
        )}
        {...props}
      />
      {value && (
        <button
          type="button"
          onClick={handleClear}
          aria-label="Clear search"
          className="absolute right-2.5 top-1/2 -translate-y-1/2 text-[#9da4ae] hover:text-[#1f2327] transition-colors p-0.5 rounded cursor-pointer"
        >
          <X className="size-3.5" />
        </button>
      )}
    </div>
  )
}

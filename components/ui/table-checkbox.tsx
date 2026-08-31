'use client'

import * as React from 'react'
import { Check } from 'lucide-react'
import { cn } from '@/lib/utils'

export function TableCheckbox({
  checked,
  onChange,
  ariaLabel,
  className,
}: {
  checked: boolean
  onChange: () => void
  ariaLabel?: string
  className?: string
}) {
  return (
    <button
      type="button"
      role="checkbox"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={onChange}
      className={cn(
        'size-[14px] rounded-[4px] flex items-center justify-center transition-all cursor-pointer ant-wave-btn shrink-0',
        checked
          ? 'bg-[#00C2CB] text-white shadow-xs'
          : 'border border-[#90969C] bg-white hover:border-[#00C2CB]',
        className
      )}
    >
      {checked && <Check className="size-2.5 stroke-[3]" />}
    </button>
  )
}

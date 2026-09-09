'use client'

import * as React from 'react'
import Link from 'next/link'
import { MoreHorizontal, X, RotateCcw } from 'lucide-react'
import { Dropdown } from '@/components/dashboard/menu'
import { TableCheckbox } from './table-checkbox'
import { TableAvatar } from './table-avatar'
import { Flag, getCountryCode } from './flag'
import { FigmaStatusBadge } from './figma-badges'
import { cn } from '@/lib/utils'

/* ========================================================================== */
/* 1. DATA TABLE CONTAINER                                                    */
/* ========================================================================== */

export function DataTableContainer({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'overflow-visible rounded-[12px] border border-[#d3d5d7] bg-white shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] font-sans flex flex-col',
        className
      )}
    >
      {children}
    </section>
  )
}

/* ========================================================================== */
/* 2. DATA TABLE TOOLBAR                                                      */
/* ========================================================================== */

export interface DataTableToolbarProps {
  children?: React.ReactNode
  onResetFilters?: () => void
  hasActiveFilters?: boolean
  className?: string
}

export function DataTableToolbar({
  children,
  onResetFilters,
  hasActiveFilters = false,
  className,
}: DataTableToolbarProps) {
  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-3 border-b border-[#d3d5d7] p-3.5 sm:p-4 bg-white',
        className
      )}
    >
      <div className="flex flex-1 flex-wrap items-center gap-2.5 min-w-0">
        {children}
        {hasActiveFilters && onResetFilters && (
          <button
            type="button"
            onClick={onResetFilters}
            className="inline-flex items-center gap-1 text-[13px] font-semibold text-[#00c2cb] hover:underline cursor-pointer ml-1"
          >
            <RotateCcw className="size-3.5" />
            <span>Reset filters</span>
          </button>
        )}
      </div>
    </div>
  )
}

/* ========================================================================== */
/* 3. BULK SELECTION BAR                                                      */
/* ========================================================================== */

export interface DataTableBulkBarProps {
  selectedCount: number
  itemLabel?: string
  actions?: React.ReactNode
  onClear: () => void
}

export function DataTableBulkBar({
  selectedCount,
  itemLabel = 'items',
  actions,
  onClear,
}: DataTableBulkBarProps) {
  if (selectedCount === 0) return null

  return (
    <div className="flex flex-wrap items-center justify-between gap-3 border-b border-[#00c2cb]/30 bg-[#e5f6f7] px-6 py-2.5 animate-in fade-in duration-150">
      <div className="flex flex-wrap items-center gap-3">
        <span className="text-[14px] font-semibold text-[#1f2327]">
          {selectedCount} {itemLabel} selected
        </span>
        {actions}
      </div>

      <button
        type="button"
        onClick={onClear}
        className="rounded p-1 text-[#6f777f] hover:bg-[#c7ecee]/50 hover:text-[#1f2327] transition-colors cursor-pointer"
        aria-label="Clear selection"
      >
        <X className="size-4" />
      </button>
    </div>
  )
}

/* ========================================================================== */
/* 4. DATA TABLE ELEMENT                                                      */
/* ========================================================================== */

export function DataTable({
  children,
  minWidth = 'min-w-[1200px]',
  className,
}: {
  children: React.ReactNode
  minWidth?: string
  className?: string
}) {
  return (
    <div className="overflow-x-auto table-scrollbar flex-1">
      <table className={cn('w-full border-collapse text-left text-[14px] font-sans', minWidth, className)}>
        {children}
      </table>
    </div>
  )
}

/* ========================================================================== */
/* 5. TABLE HEADER & CELLS                                                    */
/* ========================================================================== */

export function DataTableHeader({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return (
    <thead className={cn('bg-[#fcfcfc] border-b border-[#d3d5d7]', className)}>
      <tr className="h-12 whitespace-nowrap">{children}</tr>
    </thead>
  )
}

export function DataTableHeaderCell({
  children,
  align = 'left',
  width,
  className,
}: {
  children?: React.ReactNode
  align?: 'left' | 'center' | 'right'
  width?: string
  className?: string
}) {
  const alignClass =
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'

  return (
    <th
      className={cn(
        'px-4 text-[14px] font-semibold text-[#1f2327] whitespace-nowrap',
        alignClass,
        width,
        className
      )}
    >
      {children}
    </th>
  )
}

/* ========================================================================== */
/* 6. TABLE BODY & ROW                                                        */
/* ========================================================================== */

export function DataTableBody({
  children,
  className,
}: {
  children: React.ReactNode
  className?: string
}) {
  return <tbody className={cn('divide-y divide-[#d3d5d7]', className)}>{children}</tbody>
}

export function DataTableRow({
  children,
  selected = false,
  onClick,
  className,
}: {
  children: React.ReactNode
  selected?: boolean
  onClick?: () => void
  className?: string
}) {
  return (
    <tr
      onClick={onClick}
      className={cn(
        'h-[60px] transition-colors font-sans hover:bg-[#f8f9fa] whitespace-nowrap',
        selected && 'bg-[#e5f6f7]/40',
        onClick && 'cursor-pointer',
        className
      )}
    >
      {children}
    </tr>
  )
}

export function DataTableCell({
  children,
  align = 'left',
  className,
}: {
  children: React.ReactNode
  align?: 'left' | 'center' | 'right'
  className?: string
}) {
  const alignClass =
    align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left'

  return (
    <td className={cn('px-4 whitespace-nowrap text-[14px] leading-[20px]', alignClass, className)}>
      {children}
    </td>
  )
}

/* ========================================================================== */
/* 7. COMPOSABLE CELL PATTERNS                                                */
/* ========================================================================== */

export function CellAvatarName({
  name,
  subtitle,
  avatar,
  href,
  country,
}: {
  name: string
  subtitle?: string
  avatar?: string
  href?: string
  country?: string
}) {
  const countryCode = country ? getCountryCode(country) : undefined

  const content = (
    <div className="flex items-center gap-3 font-semibold text-[14px] leading-[20px] text-[#1f2327] hover:text-[#00c2cb] transition-colors whitespace-nowrap">
      <TableAvatar
        src={avatar}
        name={name}
        countryCode={countryCode}
        size="md"
        variant="brand"
      />
      <div className="min-w-0">
        <p className="leading-[20px] whitespace-nowrap">{name}</p>
        {subtitle && (
          <p className="text-[12px] leading-[16px] font-normal text-[#6f777f] whitespace-nowrap">
            {subtitle}
          </p>
        )}
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}

export function CellId({
  id,
  href,
}: {
  id: string
  href?: string
}) {
  if (href) {
    return (
      <Link
        href={href}
        className="font-mono text-[14px] leading-[20px] font-semibold text-[#00c2cb] hover:underline whitespace-nowrap"
      >
        {id}
      </Link>
    )
  }

  return (
    <span className="font-mono text-[14px] leading-[20px] font-semibold text-[#00c2cb] whitespace-nowrap">
      {id}
    </span>
  )
}

export function CellCountry({ country }: { country: string }) {
  const code = getCountryCode(country)
  return (
    <div className="flex items-center gap-1.5 whitespace-nowrap text-[14px] text-[#1f2327]">
      <Flag code={code} size="s" />
      <span className="whitespace-nowrap">{country}</span>
    </div>
  )
}

export function CellValue({
  value,
  accent = false,
  className,
}: {
  value: string | number
  accent?: boolean
  className?: string
}) {
  return (
    <span
      className={cn(
        'font-bold text-[14px] leading-[20px] whitespace-nowrap',
        accent ? 'text-[#00c2cb]' : 'text-[#1f2327]',
        className
      )}
    >
      {value}
    </span>
  )
}

export function CellBadge({ status }: { status: string }) {
  return <FigmaStatusBadge status={status} />
}

export function CellActions({
  options,
  onSelect,
  ariaLabel = 'Actions',
}: {
  options: { label: string; value: string; icon?: React.ReactNode; destructive?: boolean }[]
  onSelect: (value: string) => void
  ariaLabel?: string
}) {
  return (
    <Dropdown
      align="end"
      floating
      ariaLabel={ariaLabel}
      options={options}
      onSelect={onSelect}
      trigger={
        <button
          type="button"
          className="flex size-8 items-center justify-center rounded-[6px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
        >
          <MoreHorizontal className="size-4" />
        </button>
      }
    />
  )
}

'use client'

import * as React from 'react'
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import { Dropdown } from '@/components/dashboard/menu'
import { cn } from '@/lib/utils'

export interface PaginationProps {
  currentPage: number
  totalItems: number
  totalPages?: number
  rowsPerPage: number
  onPageChange: (page: number) => void
  onRowsPerPageChange?: (rows: number) => void
  rowsOptions?: number[]
  itemLabel?: string
  className?: string
}

export function Pagination({
  currentPage,
  totalItems,
  totalPages: customTotalPages,
  rowsPerPage,
  onPageChange,
  onRowsPerPageChange,
  rowsOptions = [10, 20, 30],
  itemLabel = 'items',
  className,
}: PaginationProps) {
  const totalPages = customTotalPages || Math.ceil(totalItems / rowsPerPage) || 1
  const startItem = totalItems > 0 ? (currentPage - 1) * rowsPerPage + 1 : 0
  const endItem = Math.min(currentPage * rowsPerPage, totalItems)

  const getPageNumbers = () => {
    const pages: number[] = []
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) pages.push(i)
    } else {
      if (currentPage <= 3) {
        pages.push(1, 2, 3, 4, totalPages)
      } else if (currentPage >= totalPages - 2) {
        pages.push(1, totalPages - 3, totalPages - 2, totalPages - 1, totalPages)
      } else {
        pages.push(1, currentPage - 1, currentPage, currentPage + 1, totalPages)
      }
    }
    return pages
  }

  return (
    <div
      className={cn(
        'flex flex-wrap items-center justify-between gap-4 border-t border-[#d3d5d7] px-5 py-3.5 bg-white select-none',
        className
      )}
    >
      {/* Rows per page & Range text */}
      <div className="flex items-center gap-3">
        {onRowsPerPageChange && (
          <>
            <span className="text-[13px] text-[#6f777f]">Rows per page:</span>
            <Dropdown
              align="start"
              options={rowsOptions.map((c) => ({ label: `${c}`, value: `${c}` }))}
              value={`${rowsPerPage}`}
              onSelect={(val) => onRowsPerPageChange(Number(val))}
              trigger={
                <span className="inline-flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-2.5 text-[13px] font-medium text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer">
                  <span>{rowsPerPage}</span>
                  <ChevronDown className="size-3 text-[#9da4ae]" />
                </span>
              }
            />
          </>
        )}
        <span className="text-[13px] text-[#6f777f]">
          Showing {startItem}–{endItem} of {totalItems} {itemLabel}
        </span>
      </div>

      {/* Page Navigation */}
      <div className="flex items-center gap-1">
        <button
          type="button"
          onClick={() => onPageChange(Math.max(1, currentPage - 1))}
          disabled={currentPage <= 1}
          className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#eff1f3] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
          title="Previous page"
        >
          <ChevronLeft className="size-4" />
        </button>

        {getPageNumbers().map((page, idx) => (
          <button
            key={`${page}-${idx}`}
            type="button"
            onClick={() => onPageChange(page)}
            className={cn(
              'flex size-8 items-center justify-center rounded-[6px] text-[13px] font-bold transition-colors cursor-pointer ant-wave-btn',
              currentPage === page
                ? 'bg-[#00c2cb] text-white shadow-2xs'
                : 'hover:bg-[#eff1f3] text-[#6f777f]'
            )}
          >
            {page}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
          disabled={currentPage >= totalPages}
          className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#eff1f3] disabled:opacity-40 disabled:hover:bg-transparent cursor-pointer disabled:cursor-not-allowed transition-colors"
          title="Next page"
        >
          <ChevronRight className="size-4" />
        </button>
      </div>
    </div>
  )
}

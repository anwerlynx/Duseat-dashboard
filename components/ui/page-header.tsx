'use client'

import * as React from 'react'
import { ChevronRight } from 'lucide-react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface BreadcrumbItem {
  label: string
  href?: string
}

export interface PageHeaderProps {
  title: string
  description?: string
  eyebrow?: string
  breadcrumbs?: BreadcrumbItem[]
  actions?: React.ReactNode
  className?: string
}

export function PageHeader({
  title,
  description,
  eyebrow,
  breadcrumbs,
  actions,
  className,
}: PageHeaderProps) {
  return (
    <header
      className={cn(
        'rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] font-sans',
        className
      )}
    >
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="min-w-0">
          {/* Breadcrumbs or Eyebrow */}
          {breadcrumbs && breadcrumbs.length > 0 ? (
            <nav aria-label="Breadcrumb" className="mb-1 flex items-center gap-1.5 text-[12px] text-[#6f777f]">
              {breadcrumbs.map((crumb, idx) => {
                const isLast = idx === breadcrumbs.length - 1
                return (
                  <React.Fragment key={crumb.label}>
                    {idx > 0 && <ChevronRight className="size-3 text-[#9da4ae]" />}
                    {crumb.href && !isLast ? (
                      <Link href={crumb.href} className="hover:text-[#1f2327] transition-colors">
                        {crumb.label}
                      </Link>
                    ) : (
                      <span className={isLast ? 'font-semibold text-[#1f2327]' : ''}>{crumb.label}</span>
                    )}
                  </React.Fragment>
                )
              })}
            </nav>
          ) : eyebrow ? (
            <p className="mb-1 text-[11px] font-bold uppercase tracking-wider text-[#00c2cb]">{eyebrow}</p>
          ) : null}

          <h1 className="text-[24px] sm:text-[32px] font-bold leading-[32px] sm:leading-[40px] text-[#1f2327] tracking-[-0.02em]">
            {title}
          </h1>

          {description && (
            <p className="mt-1 text-[14px] leading-[20px] text-[#6f777f] max-w-3xl">
              {description}
            </p>
          )}
        </div>

        {actions && (
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            {actions}
          </div>
        )}
      </div>
    </header>
  )
}

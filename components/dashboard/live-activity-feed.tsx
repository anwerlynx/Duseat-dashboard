'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import {
  UserPlus,
  BadgeCheck,
  FileText,
  ScrollText,
  Handshake,
  CreditCard,
  AlertTriangle,
  ShieldCheck,
  Briefcase,
  ChevronRight,
  Filter,
} from 'lucide-react'
import { initialLiveActivityFeed, type LiveActivityItem } from './data'
import { cn } from '@/lib/utils'

const ICONS_MAP: Record<LiveActivityItem['category'], React.ComponentType<{ className?: string }>> = {
  user: UserPlus,
  request: FileText,
  offer: ScrollText,
  deal: Handshake,
  subscription: CreditCard,
  report: AlertTriangle,
  verification: ShieldCheck,
  admin: Briefcase,
}

const COLORS_MAP: Record<LiveActivityItem['category'], { bg: string; text: string }> = {
  user: { bg: 'bg-[#eaf2ff]', text: 'text-[#2f54eb]' },
  request: { bg: 'bg-[#e5f6f7]', text: 'text-[#00c2cb]' },
  offer: { bg: 'bg-[#fffaf0]', text: 'text-[#f79009]' },
  deal: { bg: 'bg-[#dfefe8]', text: 'text-[#17b26a]' },
  subscription: { bg: 'bg-[#f9f0ff]', text: 'text-[#722ed1]' },
  report: { bg: 'bg-[#fee4e2]', text: 'text-[#d92d20]' },
  verification: { bg: 'bg-[#dfefe8]', text: 'text-[#17b26a]' },
  admin: { bg: 'bg-[#eff1f3]', text: 'text-[#1f2327]' },
}

export function LiveActivityFeed({ onViewAll }: { onViewAll?: () => void }) {
  const router = useRouter()
  const [filter, setFilter] = React.useState<string>('all')

  const filteredItems = initialLiveActivityFeed.filter((item) => {
    if (filter === 'all') return true
    if (filter === 'users') return item.category === 'user' || item.category === 'verification'
    if (filter === 'marketplace') return item.category === 'request' || item.category === 'offer' || item.category === 'deal'
    if (filter === 'security') return item.category === 'report' || item.category === 'admin'
    return true
  })

  const displayedItems = filteredItems.slice(0, 4)

  return (
    <div className="rounded-[12px] border border-[#d3d5d7] bg-white p-4 sm:p-5 shadow-2xs font-sans flex flex-col justify-between h-full min-h-[440px]">
      <div>
        <div className="flex items-center justify-between border-b border-[#d3d5d7] pb-3">
          <div className="flex items-center gap-2.5">
            <div className="relative flex size-2.5">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#17b26a] opacity-75" />
              <span className="relative inline-flex rounded-full size-2.5 bg-[#17b26a]" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1f2327]">Live Activity Feed</h3>
              <p className="text-[12px] text-[#6f777f]">Real-time telemetry across UAE platform</p>
            </div>
          </div>

          {/* Filter Pills */}
          <div className="flex items-center gap-1 text-xs">
            {(['all', 'users', 'marketplace', 'security'] as const).map((cat) => (
              <button
                key={cat}
                type="button"
                onClick={() => setFilter(cat)}
                className={cn(
                  'px-2 py-1 rounded-[6px] font-bold capitalize transition-all cursor-pointer text-[11px]',
                  filter === cat
                    ? 'bg-[#00c2cb] text-white shadow-2xs'
                    : 'bg-[#f8f9fa] border border-[#d3d5d7] text-[#6f777f] hover:bg-white hover:text-[#1f2327]'
                )}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Feed List */}
        <div className="divide-y divide-[#d3d5d7]/50 pt-1">
          {displayedItems.map((item) => {
            const Icon = ICONS_MAP[item.category] || Briefcase
            const colors = COLORS_MAP[item.category] || { bg: 'bg-[#eff1f3]', text: 'text-[#1f2327]' }

            return (
              <div
                key={item.id}
                onClick={() => item.href && router.push(item.href)}
                className="py-2.5 flex items-start justify-between gap-3 hover:bg-[#f8f9fa] px-1.5 rounded-[8px] transition-colors cursor-pointer group"
              >
                <div className="flex items-start gap-2.5 min-w-0">
                  <div className={cn('flex size-8 items-center justify-center rounded-[7px] shrink-0 mt-0.5 shadow-2xs', colors.bg, colors.text)}>
                    <Icon className="size-3.5" />
                  </div>

                  <div className="min-w-0">
                    <div className="flex items-center gap-1.5">
                      <p className="font-semibold text-[13px] text-[#1f2327] group-hover:text-[#00c2cb] transition-colors truncate">
                        {item.title}
                      </p>
                      {item.badge && (
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.2 rounded-[4px] shrink-0', colors.bg, colors.text)}>
                          {item.badge}
                        </span>
                      )}
                    </div>
                    <p className="text-[11.5px] text-[#6f777f] mt-0.5 line-clamp-1 leading-snug">
                      {item.detail}
                    </p>
                    <p className="text-[10.5px] text-[#9da4ae] mt-0.5 font-mono">
                      By {item.actor} • {item.time}
                    </p>
                  </div>
                </div>

                <ChevronRight className="size-3.5 text-[#9da4ae] group-hover:text-[#00c2cb] group-hover:translate-x-0.5 transition-all shrink-0 mt-1.5" />
              </div>
            )
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-[#d3d5d7] mt-auto">
        <button
          type="button"
          onClick={onViewAll}
          className="w-full h-[32px] rounded-[6px] border border-[#d3d5d7] bg-[#fcfcfc] text-[12px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer flex items-center justify-center gap-1.5"
        >
          <span>View Full Activity Audit Trail</span>
          <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'
import {
  Handshake,
  UserPlus,
  ShieldAlert,
  BadgeCheck,
  ScrollText,
  Inbox,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import { recentActivity, type ActivityType } from './data'
import { WidgetCard } from './widget-card'

const typeConfig: Record<ActivityType, { icon: LucideIcon; tint: string }> = {
  deal: { icon: Handshake, tint: 'bg-success/10 text-success' },
  user: { icon: UserPlus, tint: 'bg-brand/10 text-brand' },
  report: { icon: ShieldAlert, tint: 'bg-destructive/10 text-destructive' },
  verification: { icon: BadgeCheck, tint: 'bg-brand/10 text-brand' },
  offer: { icon: ScrollText, tint: 'bg-amber-100 text-amber-600' },
}

export function RecentActivity({ onViewAll }: { onViewAll: () => void }) {
  const [items, setItems] = React.useState(recentActivity)

  return (
    <WidgetCard title="Recent activity" onViewAll={onViewAll}>
      {items.length === 0 ? (
        <EmptyState onReset={() => setItems(recentActivity)} />
      ) : (
        <ul className="divide-y divide-border">
          {items.map((item, i) => {
            const { icon: Icon, tint } = typeConfig[item.type]
            return (
              <li
                key={item.id}
                style={{ animationDelay: `${i * 40}ms` }}
                className="flex animate-fade-up items-start gap-3 py-2.5 transition-colors hover:bg-secondary/60 -mx-1 rounded-lg px-1"
              >
                <span className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg ${tint}`}>
                  <Icon className="size-4" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[14px] leading-[20px] font-medium text-foreground">{item.title}</p>
                  <p className="truncate text-[12px] leading-[16px] font-normal text-muted-foreground">{item.meta}</p>
                </div>
                <span className="shrink-0 whitespace-nowrap text-[12px] leading-[16px] text-muted-foreground">{item.time}</span>
              </li>
            )
          })}
        </ul>
      )}
    </WidgetCard>
  )
}

function EmptyState({ onReset }: { onReset: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center py-10 text-center">
      <span className="flex size-12 items-center justify-center rounded-full bg-secondary text-muted-foreground">
        <Inbox className="size-6" />
      </span>
      <p className="mt-3 text-[16px] leading-[24px] font-semibold text-foreground">No recent activity</p>
      <p className="mt-1 text-[12px] leading-[16px] text-muted-foreground">Platform events will appear here as they happen.</p>
      <button
        type="button"
        onClick={onReset}
        className="mt-3 rounded-lg border border-input bg-card px-3 py-1.5 text-[12px] leading-[16px] font-medium text-foreground transition-colors hover:bg-secondary"
      >
        Reload
      </button>
    </div>
  )
}

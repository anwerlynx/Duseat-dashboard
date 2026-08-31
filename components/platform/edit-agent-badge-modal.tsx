'use client'

import * as React from 'react'
import { X, Check, Award, ShieldCheck, Sparkles, Flame, CheckCircle2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlatformAgent } from '@/lib/platform-users'

export type PlanKey = 'free' | 'pro' | 'elite' | 'power'

interface EditAgentBadgeModalProps {
  agent: PlatformAgent
  isOpen: boolean
  onClose: () => void
  onSave: (selectedPlan: string, selectedBadge: string) => void
}

const planTiers = [
  {
    id: 'free' as PlanKey,
    name: 'Free',
    label: 'Free',
    price: 'Free',
    offersQuota: 8,
    offersText: '8 offers / month',
    badgeText: null,
    badgeColor: null,
  },
  {
    id: 'pro' as PlanKey,
    name: 'Pro Agent',
    label: 'Pro Agent',
    price: 'AED 199',
    priceCycle: 'Aed 199 / month',
    offersQuota: 30,
    offersText: '30 offers / month',
    badgeText: 'Pro agent',
    badgeTone: 'cyan',
    badgeBg: 'bg-[#e5f6f7]',
    badgeTextCol: 'text-[#00c2cb]',
    badgeIcon: 'cyan-star',
  },
  {
    id: 'elite' as PlanKey,
    name: 'Elite',
    label: 'Elite',
    price: 'AED 349',
    priceCycle: 'Aed 349 / month',
    offersQuota: 60,
    offersText: '60 offers / month',
    badgeText: 'Pro agent',
    badgeTone: 'blue',
    badgeBg: 'bg-[#eaf2ff]',
    badgeTextCol: 'text-[#3366ff]',
    badgeIcon: 'blue-gem',
  },
  {
    id: 'power' as PlanKey,
    name: 'Power',
    label: 'Power',
    price: 'AED 429',
    priceCycle: 'Aed 429 / month',
    offersQuota: 75,
    offersText: '75 offers / month',
    badgeText: 'Pro agent',
    badgeTone: 'red',
    badgeBg: 'bg-[#f3e1e0]',
    badgeTextCol: 'text-[#d92d20]',
    badgeIcon: 'ruby-shield',
  },
]

const presetBadges = [
  { id: 'deal-completed', label: 'Deal completed', bg: 'bg-[#dfefe8]', border: 'border-[#9cdabd]', text: 'text-[#17b26a]' },
  { id: 'top-performer', label: 'Top Performer', bg: 'bg-[#fff4e5]', border: 'border-[#ffc98a]', text: 'text-[#f79009]' },
  { id: 'rera-verified', label: 'RERA Certified', bg: 'bg-[#e5f6f7]', border: 'border-[#a5e8ec]', text: 'text-[#00a4ac]' },
  { id: 'luxury-specialist', label: 'Luxury Specialist', bg: 'bg-[#eaf2ff]', border: 'border-[#b5d0ff]', text: 'text-[#3366ff]' },
]

export function EditAgentBadgeModal({ agent, isOpen, onClose, onSave }: EditAgentBadgeModalProps) {
  const [selectedPlan, setSelectedPlan] = React.useState<PlanKey>(() => {
    const sub = (agent.subscription || '').toLowerCase()
    if (sub.includes('power')) return 'power'
    if (sub.includes('elite')) return 'elite'
    if (sub.includes('free')) return 'free'
    return 'pro'
  })

  const [selectedBadge, setSelectedBadge] = React.useState<string>('deal-completed')

  if (!isOpen) return null

  const currentTier = planTiers.find((p) => p.id === selectedPlan) || planTiers[1]
  const offersUsed = Math.min(18, currentTier.offersQuota)
  const offersRemaining = Math.max(0, currentTier.offersQuota - offersUsed)
  const usagePercentage = Math.round((offersUsed / currentTier.offersQuota) * 100)

  const handleApply = () => {
    const planName = currentTier.name
    const badgeName = presetBadges.find((b) => b.id === selectedBadge)?.label || 'Deal completed'
    onSave(planName, badgeName)
    onClose()
  }

  const handleRemove = () => {
    onSave('Free', '')
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4 backdrop-blur-xs font-sans animate-in fade-in duration-200"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative w-full max-w-[1240px] rounded-[12px] border border-[#d3d5d7] bg-white p-6 sm:p-8 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <h2 className="text-[24px] sm:text-[28px] font-bold text-[#1f2327]">Edit agent</h2>
            <p className="text-[18px] sm:text-[20px] text-[#6f777f]">Choose a preset or upload custom badge</p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="rounded-[8px] p-2 text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-6" />
          </button>
        </div>

        {/* Top 2 Cards Row: Current Plan & Monthly Offers */}
        <div className="grid gap-6 md:grid-cols-2">
          {/* Card 1: Current Plan */}
          <div className="rounded-[12px] border-2 border-[#1f2327] bg-[#f2f2f2] p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] flex flex-col justify-between gap-6 min-h-[180px]">
            <div className="space-y-1.5">
              <p className="text-[18px] sm:text-[20px] text-[#6f777f]">Current plan</p>
              <div className="flex flex-wrap items-center gap-3">
                <h3 className="text-[28px] sm:text-[32px] font-bold text-[#1f2327]">{currentTier.name}</h3>
                {currentTier.badgeText && (
                  <div
                    className={cn(
                      'px-3 py-1 rounded-[12px] flex items-center gap-1.5 text-[15px] sm:text-[16px] font-medium',
                      currentTier.badgeBg,
                      currentTier.badgeTextCol
                    )}
                  >
                    <span>{currentTier.badgeText}</span>
                    <BadgeGlyph tone={currentTier.id} />
                  </div>
                )}
              </div>
              <p className="text-[18px] sm:text-[20px] text-[#6f777f]">
                {currentTier.price === 'Free' ? 'Free tier' : `${currentTier.price} / month`}
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-between gap-4 pt-2 border-t border-[#d3d5d7]/50 text-[15px] sm:text-[16px]">
              <div>
                <span className="text-[#6f777f]">Billing cycle</span>
                <p className="font-medium text-[#1f2327]">01 Jun 2026 – 30 Jun 2026</p>
              </div>
              <div>
                <span className="text-[#6f777f]">Next billing</span>
                <p className="font-medium text-[#1f2327]">01 Jul 2026</p>
              </div>
            </div>
          </div>

          {/* Card 2: Monthly Offers */}
          <div className="rounded-[12px] border-2 border-[#1f2327] bg-[#f2f2f2] p-6 shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)] flex flex-col justify-between gap-6 min-h-[180px]">
            <div className="space-y-2">
              <p className="text-[18px] sm:text-[20px] text-[#6f777f]">Monthly offers</p>
              <div className="flex items-baseline justify-between">
                <p className="text-[28px] sm:text-[32px] font-bold text-[#1f2327]">
                  {offersUsed}/{currentTier.offersQuota}
                </p>
                <span className="text-[18px] sm:text-[20px] text-[#6f777f] font-medium">{usagePercentage}%</span>
              </div>

              {/* Progress bar */}
              <div className="w-full bg-[#e5e7eb] h-[6px] rounded-full overflow-hidden">
                <div
                  className="bg-[#00c2cb] h-full rounded-full transition-all duration-300"
                  style={{ width: `${Math.min(100, usagePercentage)}%` }}
                />
              </div>

              <p className="text-[16px] sm:text-[18px] text-[#6f777f]">{offersRemaining} offers remaining this cycle.</p>
            </div>

            <div className="pt-2 border-t border-[#d3d5d7]/50">
              <p className="text-[18px] sm:text-[20px] font-medium text-[#1f2327]">Visa ending 4242</p>
            </div>
          </div>
        </div>

        {/* 4 Plan Selectors Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {planTiers.map((plan) => {
            const isSelected = selectedPlan === plan.id
            return (
              <button
                type="button"
                key={plan.id}
                onClick={() => setSelectedPlan(plan.id)}
                className={cn(
                  'text-left rounded-[12px] p-5 flex flex-col justify-between gap-4 transition-all cursor-pointer ant-wave-btn shadow-[0px_1px_3px_rgba(16,24,40,0.05),0px_1px_2px_rgba(16,24,40,0.05)]',
                  isSelected
                    ? 'border-2 border-[#1f2327] bg-[#f2f2f2] scale-[1.01]'
                    : 'border border-[#d3d5d7] bg-[#f2f2f2] hover:border-[#00c2cb]/60'
                )}
              >
                <div className="space-y-1">
                  <p className="text-[18px] sm:text-[20px] text-[#6f777f]">{plan.label}</p>
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="text-[26px] sm:text-[30px] font-bold text-[#1f2327]">{plan.price}</p>
                    {plan.badgeText && (
                      <span
                        className={cn(
                          'px-2.5 py-0.5 rounded-[12px] flex items-center gap-1 text-[13px] sm:text-[14px] font-medium',
                          plan.badgeBg,
                          plan.badgeTextCol
                        )}
                      >
                        <span>{plan.badgeText}</span>
                        <BadgeGlyph tone={plan.id} />
                      </span>
                    )}
                  </div>
                  <p className="text-[16px] sm:text-[18px] text-[#6f777f] pt-1">{plan.offersText}</p>
                </div>
              </button>
            )
          })}
        </div>

        {/* Preset Badges Section */}
        <div className="space-y-3 pt-2">
          <p className="text-[16px] sm:text-[18px] font-semibold text-[#1f2327]">Active Preset Badge</p>
          <div className="flex flex-wrap gap-2.5">
            {presetBadges.map((badge) => (
              <button
                key={badge.id}
                type="button"
                onClick={() => setSelectedBadge(badge.id)}
                className={cn(
                  'px-3.5 py-1.5 rounded-[8px] text-[15px] sm:text-[16px] font-medium border transition-all cursor-pointer ant-wave-btn',
                  badge.bg,
                  badge.border,
                  badge.text,
                  selectedBadge === badge.id
                    ? 'ring-2 ring-[#00c2cb] ring-offset-1 font-bold'
                    : 'opacity-80 hover:opacity-100'
                )}
              >
                {badge.label}
              </button>
            ))}
          </div>
        </div>

        {/* Action Buttons Footer */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-[#d3d5d7]">
          <button
            type="button"
            onClick={handleRemove}
            className="h-[40px] px-4 rounded-[8px] border border-[#d3d5d7] bg-white text-[15px] sm:text-[16px] font-medium text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer ant-wave-btn"
          >
            Remove
          </button>
          <button
            type="button"
            onClick={handleApply}
            className="h-[40px] px-5 rounded-[8px] bg-[#00c2cb] text-[15px] sm:text-[16px] font-bold text-white hover:opacity-90 transition-opacity cursor-pointer ant-wave-btn shadow-xs"
          >
            Assign badge
          </button>
        </div>
      </div>
    </div>
  )
}

function BadgeGlyph({ tone }: { tone: PlanKey }) {
  if (tone === 'pro') {
    return (
      <svg className="size-3.5 text-[#00c2cb]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 1L3 5v6c0 5.55 3.84 10.74 9 12 5.16-1.26 9-6.45 9-12V5l-9-4zm-1 16l-4-4 1.41-1.41L11 14.17l6.59-6.59L19 9l-8 8z" />
      </svg>
    )
  }
  if (tone === 'elite') {
    return (
      <svg className="size-3.5 text-[#3366ff]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
      </svg>
    )
  }
  if (tone === 'power') {
    return (
      <svg className="size-3.5 text-[#d92d20]" viewBox="0 0 24 24" fill="currentColor">
        <path d="M13.5.67s.74 2.65.74 4.8c0 2.06-1.35 3.73-3.41 3.73-2.07 0-3.63-1.67-3.63-3.73l.03-.36C5.21 7.51 4 10.62 4 14c0 4.42 3.58 8 8 8s8-3.58 8-8C20 8.61 17.41 3.8 13.5.67zM11.71 19c-1.78 0-3.22-1.4-3.22-3.14 0-1.62 1.05-2.76 2.81-3.12 1.77-.36 3.6-1.21 4.62-2.58.39 1.29.59 2.65.59 4.04 0 2.65-2.15 4.8-4.8 4.8z" />
      </svg>
    )
  }
  return null
}

'use client'

import * as React from 'react'
import {
  X,
  CheckCircle2,
  AlertTriangle,
  Building,
  User,
  ShieldCheck,
  DollarSign,
  FileCheck,
  CreditCard,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlatformDeal } from '@/lib/deals-data'

interface CompleteDealModalProps {
  deal: PlatformDeal | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (dealId: string) => void
}

export function CompleteDealModal({
  deal,
  isOpen,
  onClose,
  onConfirm,
}: CompleteDealModalProps) {
  const [acknowledged, setAcknowledged] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) setAcknowledged(false)
  }, [isOpen])

  if (!isOpen || !deal) return null

  const verifiedDocs = deal.documents.filter((d) => d.status === 'Verified' || d.status === 'Signed').length
  const totalDocs = Math.max(deal.documents.length, 1)
  const isFullyPaid = deal.escrowStatus === 'Funded' || deal.escrowStatus === 'Released'

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 font-sans backdrop-blur-xs ant-fade-in"
      role="dialog"
      aria-modal="true"
    >
      <div className="flex w-full max-w-lg flex-col overflow-hidden rounded-[16px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d3d5d7] bg-[#fcfcfc] px-6 py-4">
          <div className="flex items-center gap-2.5">
            <div className="flex size-9 items-center justify-center rounded-[8px] bg-[#dfefe8] text-[#17b26a]">
              <CheckCircle2 className="size-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1f2327]">Complete & Convey Deal</h3>
              <p className="text-[12px] text-[#6f777f]">Ref: {deal.id}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-[8px] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
            aria-label="Close modal"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="rounded-[10px] bg-[#dfefe8]/40 border border-[#17b26a]/30 p-3.5 flex items-start gap-2.5 text-[#17b26a]">
            <CheckCircle2 className="size-5 shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-[#1f2327] leading-[18px]">
              Completing this transaction will execute official DLD title conveyance, release locked escrow funds, and trigger automated broker commission disbursement.
            </p>
          </div>

          {/* Deal Summary Matrix */}
          <div className="divide-y divide-[#d3d5d7] rounded-[10px] border border-[#d3d5d7] bg-[#fcfcfc] text-[13px]">
            <div className="p-3 flex justify-between">
              <span className="text-[#6f777f]">Property:</span>
              <span className="font-semibold text-[#1f2327] text-right max-w-[260px] truncate">{deal.propertyTitle}</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-[#6f777f]">Investor (Buyer):</span>
              <span className="font-semibold text-[#1f2327]">{deal.investorName} ({deal.investorCountry})</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-[#6f777f]">Licensed Agent:</span>
              <span className="font-semibold text-[#1f2327]">{deal.agentName} • {deal.agentAgency}</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-[#6f777f]">Total Deal Value:</span>
              <span className="font-bold text-[#00c2cb]">{deal.dealValue}</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-[#6f777f]">Commission Payout:</span>
              <span className="font-bold text-[#17b26a]">{deal.commissionAmount} ({deal.commissionRate})</span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-[#6f777f]">Payment & Escrow:</span>
              <span className={cn('font-semibold', isFullyPaid ? 'text-[#17b26a]' : 'text-[#f79009]')}>
                {deal.escrowStatus} ({deal.escrowAmount})
              </span>
            </div>
            <div className="p-3 flex justify-between">
              <span className="text-[#6f777f]">Conveyance Documents:</span>
              <span className="font-semibold text-[#1f2327]">{verifiedDocs} of {totalDocs} Verified</span>
            </div>
          </div>

          {/* Confirmation Checkbox */}
          <label className="flex items-start gap-2.5 cursor-pointer pt-1">
            <input
              type="checkbox"
              checked={acknowledged}
              onChange={(e) => setAcknowledged(e.target.checked)}
              className="size-4 mt-0.5 rounded border-[#d3d5d7] text-[#00c2cb] focus:ring-[#00c2cb]"
            />
            <span className="text-[12.5px] text-[#1f2327] leading-[18px]">
              I confirm that all DLD conveyance appointments, KYC documents, and escrow settlements have been verified by the assigned manager.
            </span>
          </label>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-[#d3d5d7] bg-[#fcfcfc] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-4 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!acknowledged}
            onClick={() => {
              onConfirm(deal.id)
              onClose()
            }}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#17b26a] px-4 text-[13px] font-semibold text-white hover:bg-[#159a5c] disabled:opacity-50 transition-colors cursor-pointer shadow-2xs ant-wave-btn"
          >
            <CheckCircle2 className="size-4" />
            <span>Confirm & Complete Deal</span>
          </button>
        </div>
      </div>
    </div>
  )
}

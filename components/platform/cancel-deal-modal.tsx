'use client'

import * as React from 'react'
import {
  X,
  AlertTriangle,
  XCircle,
  FileText,
  Building,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import type { PlatformDeal } from '@/lib/deals-data'

interface CancelDealModalProps {
  deal: PlatformDeal | null
  isOpen: boolean
  onClose: () => void
  onConfirm: (dealId: string, reason: string, notes: string) => void
}

const CANCELLATION_REASONS = [
  'Buyer financing failed / mortgage declined',
  'Seller withdrew property from market',
  'Legal or title conveyance defect',
  'Inspection or structural survey rejected',
  'Mutual agreement without penalty',
  'Deposit payment deadline expired',
  'Compliance or KYC violation',
  'Other operational reason',
]

export function CancelDealModal({
  deal,
  isOpen,
  onClose,
  onConfirm,
}: CancelDealModalProps) {
  const [reason, setReason] = React.useState(CANCELLATION_REASONS[0])
  const [adminNotes, setAdminNotes] = React.useState('')

  React.useEffect(() => {
    if (isOpen) {
      setReason(CANCELLATION_REASONS[0])
      setAdminNotes('')
    }
  }, [isOpen])

  if (!isOpen || !deal) return null

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
            <div className="flex size-9 items-center justify-center rounded-[8px] bg-[#fee4e2] text-[#d92d20]">
              <XCircle className="size-5" />
            </div>
            <div>
              <h3 className="text-[16px] font-bold text-[#1f2327]">Cancel Deal Transaction</h3>
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

        {/* Form Body */}
        <div className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          <div className="rounded-[10px] bg-[#fee4e2]/40 border border-[#d92d20]/30 p-3.5 flex items-start gap-2.5 text-[#d92d20]">
            <AlertTriangle className="size-5 shrink-0 mt-0.5" />
            <p className="text-[12.5px] text-[#1f2327] leading-[18px]">
              Cancelling this deal will terminate all conveyance appointments and initiate escrow security refund protocol to the buyer. This action will be permanently recorded in the deal audit history.
            </p>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#1f2327]">Cancellation Reason *</label>
            <select
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              className="w-full h-[40px] rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[13px] text-[#1f2327] outline-none focus:border-[#d92d20] focus:ring-2 focus:ring-[#d92d20]/20"
            >
              {CANCELLATION_REASONS.map((r) => (
                <option key={r} value={r}>
                  {r}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-semibold text-[#1f2327]">Admin / Compliance Notes (Optional)</label>
            <textarea
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Provide context or explanation for internal audit records..."
              className="w-full h-24 p-3 rounded-[8px] border border-[#d3d5d7] bg-white text-[13px] text-[#1f2327] outline-none focus:border-[#d92d20] focus:ring-2 focus:ring-[#d92d20]/20 resize-none"
            />
          </div>

          <div className="rounded-[8px] bg-[#fcfcfc] border border-[#d3d5d7] p-3 text-[12px] text-[#6f777f]">
            <span className="font-semibold text-[#1f2327]">Deal: </span>
            {deal.propertyTitle} ({deal.dealValue})
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-2.5 border-t border-[#d3d5d7] bg-[#fcfcfc] px-6 py-4">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-4 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
          >
            Go Back
          </button>
          <button
            type="button"
            onClick={() => {
              onConfirm(deal.id, reason, adminNotes)
              onClose()
            }}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#d92d20] px-4 text-[13px] font-semibold text-white hover:bg-[#b42318] transition-colors cursor-pointer shadow-2xs ant-wave-btn"
          >
            <XCircle className="size-4" />
            <span>Confirm Deal Cancellation</span>
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'
import {
  X,
  ShieldCheck,
  CheckCircle2,
  AlertTriangle,
  Award,
  Sparkles,
} from 'lucide-react'
import { type VerificationCase } from '@/lib/verification-data'
import { Flag, getCountryCode } from '@/components/ui/flag'

interface ApproveVerificationModalProps {
  caseItem: VerificationCase
  onClose: () => void
  onConfirm: () => void
}

export function ApproveVerificationModal({
  caseItem,
  onClose,
  onConfirm,
}: ApproveVerificationModalProps) {
  const [isProcessing, setIsProcessing] = React.useState(false)
  const countryCode = getCountryCode(caseItem.country)
  const verifiedDocsCount = caseItem.documents.filter((d) => d.status === 'Verified').length

  const handleApprove = () => {
    setIsProcessing(true)
    setTimeout(() => {
      onConfirm()
      setIsProcessing(false)
      onClose()
    }, 400)
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 p-4 backdrop-blur-xs ant-fade-in font-sans"
      role="dialog"
      aria-modal="true"
    >
      <div className="relative flex w-full max-w-lg flex-col overflow-hidden rounded-[12px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#d3d5d7] px-5 py-4 bg-[#fcfcfc]">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#dfefe8] text-[#17b26a]">
              <ShieldCheck className="size-6" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#1f2327]">Approve Verification?</h2>
              <p className="text-[13px] text-[#6f777f]">Confirm final compliance approval and badge issuance</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327] transition-colors cursor-pointer"
          >
            <X className="size-4" />
          </button>
        </div>

        {/* Summary Details */}
        <div className="p-5 space-y-4">
          <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-4 space-y-3">
            <div className="flex items-center gap-3">
              {caseItem.applicantAvatar ? (
                <img
                  src={caseItem.applicantAvatar}
                  alt={caseItem.applicantName}
                  className="size-11 rounded-[8px] object-cover border border-[#d3d5d7]"
                />
              ) : (
                <div className="flex size-11 items-center justify-center rounded-[8px] bg-[#eff1f3] font-bold text-[#1f2327]">
                  {caseItem.applicantName.slice(0, 2).toUpperCase()}
                </div>
              )}
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-bold text-[15px] text-[#1f2327]">{caseItem.applicantName}</span>
                  <span className="text-[12px] font-semibold text-[#6f777f]">({caseItem.userId})</span>
                </div>
                <div className="text-[13px] text-[#6f777f] flex items-center gap-1.5 mt-0.5">
                  <Flag code={countryCode} className="size-3 rounded-xs" />
                  <span>{caseItem.country}</span>
                  <span>•</span>
                  <span>{caseItem.applicantEmail}</span>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-2 pt-2 border-t border-[#d3d5d7]/60 text-[13px]">
              <div>
                <span className="text-[#6f777f] block text-[11px] uppercase font-semibold">Verification ID:</span>
                <span className="font-mono font-bold text-[#1f2327]">{caseItem.id}</span>
              </div>
              <div>
                <span className="text-[#6f777f] block text-[11px] uppercase font-semibold">User Role:</span>
                <span className="font-semibold text-[#1f2327]">{caseItem.role}</span>
              </div>
              <div>
                <span className="text-[#6f777f] block text-[11px] uppercase font-semibold">Verified Requirements:</span>
                <span className="font-bold text-[#17b26a]">
                  {verifiedDocsCount} / {caseItem.documents.length} Completed
                </span>
              </div>
              <div>
                <span className="text-[#6f777f] block text-[11px] uppercase font-semibold">Risk Rating:</span>
                <span className="font-bold text-[#17b26a]">{caseItem.riskScore}% Low Risk</span>
              </div>
            </div>
          </div>

          {/* Consequence Notice */}
          <div className="rounded-[8px] border border-[#17b26a]/30 bg-[#dfefe8]/40 p-3 text-[13px] text-[#1f2327] space-y-1.5">
            <div className="flex items-center gap-1.5 font-bold text-[#17b26a]">
              <Sparkles className="size-4" />
              <span>Consequences of this approval:</span>
            </div>
            <ul className="list-disc list-inside text-[12px] text-[#4b5563] space-y-1">
              <li>Status will transition to <strong>Approved</strong> with immutable audit timestamp.</li>
              <li>Official {caseItem.role === 'Agent' ? 'RERA Pro Verified Badge' : 'KYC Tier 2 Verified Investor Badge'} will be granted.</li>
              <li>Verification queue and dashboard KPIs will be updated immediately.</li>
            </ul>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center justify-between border-t border-[#d3d5d7] px-5 py-3.5 bg-[#fcfcfc]">
          <button
            type="button"
            onClick={onClose}
            disabled={isProcessing}
            className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-4 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleApprove}
            disabled={isProcessing}
            className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#17b26a] px-5 text-[13px] font-bold text-white hover:bg-[#139757] disabled:opacity-50 transition-colors shadow-2xs cursor-pointer ant-wave-btn"
          >
            <ShieldCheck className="size-4" />
            <span>{isProcessing ? 'Approving...' : 'Approve Verification'}</span>
          </button>
        </div>
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'
import {
  X,
  XCircle,
  AlertTriangle,
  FileWarning,
} from 'lucide-react'
import { type VerificationCase } from '@/lib/verification-data'
import { Flag, getCountryCode } from '@/components/ui/flag'

interface RejectVerificationModalProps {
  caseItem: VerificationCase
  onClose: () => void
  onConfirm: (reason: string, notes: string) => void
}

const standardRejectionReasons = [
  'Invalid documents',
  'Information mismatch',
  'Missing documents',
  'Expired documents',
  'Failed identity verification',
  'Failed business verification',
  'Suspicious submission',
  'Other',
]

export function RejectVerificationModal({
  caseItem,
  onClose,
  onConfirm,
}: RejectVerificationModalProps) {
  const [selectedReason, setSelectedReason] = React.useState('Invalid documents')
  const [adminNotes, setAdminNotes] = React.useState('')
  const [isProcessing, setIsProcessing] = React.useState(false)

  const countryCode = getCountryCode(caseItem.country)

  const handleReject = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      onConfirm(selectedReason, adminNotes.trim())
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
            <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#f3e1e0] text-[#d92d20]">
              <XCircle className="size-6" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#1f2327]">Reject Verification</h2>
              <p className="text-[13px] text-[#6f777f]">Fail verification request with structured justification</p>
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

        {/* Form Body */}
        <form onSubmit={handleReject} className="p-5 space-y-4">
          <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 flex items-center gap-3 text-[13px]">
            {caseItem.applicantAvatar ? (
              <img
                src={caseItem.applicantAvatar}
                alt={caseItem.applicantName}
                className="size-9 rounded-[8px] object-cover border border-[#d3d5d7]"
              />
            ) : (
              <div className="flex size-9 items-center justify-center rounded-[8px] bg-[#eff1f3] font-bold text-[#1f2327]">
                {caseItem.applicantName.slice(0, 2).toUpperCase()}
              </div>
            )}
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-[#1f2327]">{caseItem.applicantName}</span>
                <span className="font-mono text-[#6f777f] text-[12px]">{caseItem.id}</span>
              </div>
              <span className="text-[12px] text-[#6f777f]">{caseItem.role} • {caseItem.country}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1f2327]">
              Rejection Reason <span className="text-[#d92d20]">*</span>
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
            >
              {standardRejectionReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1f2327]">
              Admin Compliance Notes <span className="text-[#d92d20]">*</span>
            </label>
            <textarea
              required
              rows={3}
              value={adminNotes}
              onChange={(e) => setAdminNotes(e.target.value)}
              placeholder="Explain why this verification failed and what actions were taken..."
              className="w-full rounded-[8px] border border-[#d3d5d7] bg-white p-3 text-[14px] text-[#1f2327] placeholder:text-[#9da4ae] outline-none focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
            />
          </div>

          <div className="rounded-[8px] border border-[#d92d20]/30 bg-[#f3e1e0]/40 p-3 text-[12px] text-[#d92d20] flex items-start gap-2">
            <AlertTriangle className="size-4 shrink-0 mt-0.5" />
            <span>
              This will transition the verification status to <strong>Rejected</strong>, save audit timestamps,
              and record the rejection in the applicant’s compliance history.
            </span>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-between border-t border-[#d3d5d7] pt-4 mt-2">
            <button
              type="button"
              onClick={onClose}
              disabled={isProcessing}
              className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-4 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isProcessing || !adminNotes.trim()}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#d92d20] px-5 text-[13px] font-bold text-white hover:bg-[#b92518] disabled:opacity-50 transition-colors shadow-2xs cursor-pointer ant-wave-btn"
            >
              <XCircle className="size-4" />
              <span>{isProcessing ? 'Rejecting...' : 'Reject Verification'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

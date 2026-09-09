'use client'

import * as React from 'react'
import {
  X,
  UserCheck,
  UserX,
  Search,
  ShieldCheck,
  Check,
  AlertCircle,
} from 'lucide-react'
import {
  availableReviewers,
  type ReviewerUser,
  type VerificationCase,
} from '@/lib/verification-data'
import { cn } from '@/lib/utils'

interface AssignReviewerModalProps {
  caseItem?: VerificationCase | null
  casesCount?: number
  onClose: () => void
  onAssign: (reviewer: ReviewerUser | null) => void
}

export function AssignReviewerModal({
  caseItem,
  casesCount = 1,
  onClose,
  onAssign,
}: AssignReviewerModalProps) {
  const [searchQuery, setSearchQuery] = React.useState('')
  const [selectedReviewerId, setSelectedReviewerId] = React.useState<string | null>(
    caseItem?.assignedReviewer
      ? availableReviewers.find((r) => r.name === caseItem.assignedReviewer?.name)?.id || null
      : null
  )

  const filteredReviewers = availableReviewers.filter(
    (r) =>
      r.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.role.toLowerCase().includes(searchQuery.toLowerCase()) ||
      r.email.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const selectedReviewer = availableReviewers.find((r) => r.id === selectedReviewerId) || null

  const handleConfirm = () => {
    onAssign(selectedReviewer)
    onClose()
  }

  const handleUnassign = () => {
    onAssign(null)
    onClose()
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
            <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#e5f6f7] text-[#00c2cb]">
              <UserCheck className="size-5" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#1f2327]">
                {casesCount > 1 ? `Assign Reviewer (${casesCount} Cases)` : 'Assign Compliance Reviewer'}
              </h2>
              <p className="text-[13px] text-[#6f777f]">
                {caseItem
                  ? `Select compliance officer to adjudicate ${caseItem.id} (${caseItem.applicantName})`
                  : `Assign selected ${casesCount} verification cases to a reviewer`}
              </p>
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

        {/* Body */}
        <div className="p-5 space-y-4 max-h-[70vh] overflow-y-auto">
          {/* Current Reviewer info if single case */}
          {caseItem && (
            <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 flex items-center justify-between text-[13px]">
              <div>
                <span className="text-[#6f777f] block text-[11px] uppercase font-semibold">
                  Currently Assigned:
                </span>
                <span className="font-bold text-[#1f2327]">
                  {caseItem.assignedReviewer?.name || 'Unassigned'}
                </span>
                {caseItem.assignedReviewer?.role && (
                  <span className="text-[#6f777f] text-[12px] ml-1.5">
                    ({caseItem.assignedReviewer.role})
                  </span>
                )}
              </div>
              {caseItem.assignedReviewer && (
                <button
                  type="button"
                  onClick={handleUnassign}
                  className="text-[12px] font-semibold text-[#d92d20] hover:underline cursor-pointer flex items-center gap-1"
                >
                  <UserX className="size-3.5" />
                  Unassign
                </button>
              )}
            </div>
          )}

          {/* Search reviewers */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-[#9da4ae]" />
            <input
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search compliance team by name or role..."
              className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white pl-9 pr-3 text-[14px] outline-none placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
            />
          </div>

          {/* Reviewers list */}
          <div className="space-y-2">
            <span className="text-[12px] font-bold uppercase tracking-wider text-[#6f777f]">
              Available Reviewers ({filteredReviewers.length})
            </span>
            <div className="space-y-2">
              {filteredReviewers.map((reviewer) => {
                const isSelected = selectedReviewerId === reviewer.id
                return (
                  <div
                    key={reviewer.id}
                    onClick={() => setSelectedReviewerId(reviewer.id)}
                    className={cn(
                      'flex items-center justify-between p-3 rounded-[8px] border transition-all cursor-pointer',
                      isSelected
                        ? 'border-[#00c2cb] bg-[#e5f6f7]/50 shadow-xs'
                        : 'border-[#d3d5d7] bg-white hover:bg-[#fcfcfc]'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <img
                        src={reviewer.avatar}
                        alt={reviewer.name}
                        className="size-10 rounded-[8px] object-cover border border-[#d3d5d7]"
                      />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-[14px] text-[#1f2327]">{reviewer.name}</span>
                          {isSelected && <Check className="size-4 text-[#00c2cb]" />}
                        </div>
                        <p className="text-[12px] text-[#6f777f]">{reviewer.role}</p>
                        <p className="text-[11px] text-[#9da4ae] font-mono">{reviewer.email}</p>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="inline-flex items-center rounded-full bg-[#eff1f3] px-2 py-0.5 text-[11px] font-semibold text-[#1f2327]">
                        {reviewer.activeCasesCount} active cases
                      </span>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between border-t border-[#d3d5d7] px-5 py-3.5 bg-[#fcfcfc]">
          <button
            type="button"
            onClick={onClose}
            className="h-[36px] rounded-[8px] border border-[#d3d5d7] bg-white px-4 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
          >
            Cancel
          </button>
          <div className="flex items-center gap-2">
            {caseItem?.assignedReviewer && (
              <button
                type="button"
                onClick={handleUnassign}
                className="h-[36px] rounded-[8px] border border-[#d92d20]/30 bg-[#f3e1e0] px-3.5 text-[13px] font-bold text-[#d92d20] hover:bg-[#f3e1e0]/80 transition-colors cursor-pointer"
              >
                Unassign Reviewer
              </button>
            )}
            <button
              type="button"
              onClick={handleConfirm}
              disabled={!selectedReviewer}
              className="h-[36px] rounded-[8px] bg-[#00c2cb] px-4 text-[13px] font-bold text-white hover:bg-[#00a8b0] disabled:opacity-40 transition-colors shadow-2xs cursor-pointer ant-wave-btn"
            >
              {caseItem?.assignedReviewer ? 'Reassign Reviewer' : 'Assign Reviewer'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

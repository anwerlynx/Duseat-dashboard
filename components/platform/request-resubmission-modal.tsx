'use client'

import * as React from 'react'
import {
  X,
  RefreshCw,
  CheckSquare,
  Square,
  AlertCircle,
  FileText,
  Send,
} from 'lucide-react'
import { type VerificationCase } from '@/lib/verification-data'
import { TableCheckbox } from '@/components/ui/table-checkbox'
import { cn } from '@/lib/utils'

interface RequestResubmissionModalProps {
  caseItem: VerificationCase
  onClose: () => void
  onConfirm: (selectedRequirements: string[], reason: string, message: string) => void
}

const standardResubmitReasons = [
  'Document image is blurry or has strong flash glare',
  'Document is expired or nearing expiration deadline',
  'Information mismatch with registered user name',
  'Missing appendix, partners page, or stamp',
  'Document cut-off margins or missing back page',
  'Other compliance correction required',
]

export function RequestResubmissionModal({
  caseItem,
  onClose,
  onConfirm,
}: RequestResubmissionModalProps) {
  const [selectedItems, setSelectedItems] = React.useState<string[]>(() => {
    // Default to unverified/pending/rejected items
    return caseItem.documents
      .filter((d) => d.status !== 'Verified')
      .map((d) => d.type)
  })
  const [selectedReason, setSelectedReason] = React.useState(standardResubmitReasons[0])
  const [userMessage, setUserMessage] = React.useState('')
  const [isProcessing, setIsProcessing] = React.useState(false)

  const toggleItem = (type: string) => {
    setSelectedItems((prev) =>
      prev.includes(type) ? prev.filter((i) => i !== type) : [...prev, type]
    )
  }

  const toggleAll = () => {
    if (selectedItems.length === caseItem.documents.length) {
      setSelectedItems([])
    } else {
      setSelectedItems(caseItem.documents.map((d) => d.type))
    }
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (selectedItems.length === 0) return
    setIsProcessing(true)
    setTimeout(() => {
      onConfirm(
        selectedItems,
        selectedReason,
        userMessage.trim() || `Please upload a clearer and certified copy of: ${selectedItems.join(', ')}.`
      )
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
            <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#e5f6f7] text-[#00c2cb]">
              <RefreshCw className="size-5" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#1f2327]">Request Verification Resubmission</h2>
              <p className="text-[13px] text-[#6f777f]">
                Specify exactly which requirements require replacement
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

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 max-h-[72vh] overflow-y-auto">
          {/* Requirement checklist */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-[13px] font-bold text-[#1f2327]">
                Select Requirements for Re-upload <span className="text-[#d92d20]">*</span>
              </label>
              <button
                type="button"
                onClick={toggleAll}
                className="text-[12px] font-semibold text-[#00c2cb] hover:underline cursor-pointer"
              >
                {selectedItems.length === caseItem.documents.length ? 'Deselect All' : 'Select All'}
              </button>
            </div>

            <div className="space-y-2 rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3">
              {caseItem.documents.map((doc) => {
                const isChecked = selectedItems.includes(doc.type)
                return (
                  <div
                    key={doc.id}
                    onClick={() => toggleItem(doc.type)}
                    className={cn(
                      'flex items-center justify-between p-2.5 rounded-[6px] border transition-all cursor-pointer text-[13px]',
                      isChecked
                        ? 'border-[#00c2cb] bg-white shadow-xs'
                        : 'border-transparent bg-transparent hover:bg-white'
                    )}
                  >
                    <div className="flex items-center gap-3">
                      <TableCheckbox
                        checked={isChecked}
                        onChange={() => toggleItem(doc.type)}
                        ariaLabel={`Select ${doc.type}`}
                      />
                      <div>
                        <span className="font-semibold text-[#1f2327]">{doc.type}</span>
                        <span className="text-[12px] text-[#6f777f] block truncate max-w-[220px]">
                          {doc.name}
                        </span>
                      </div>
                    </div>
                    <span
                      className={cn(
                        'rounded-[4px] px-2 py-0.5 text-[11px] font-semibold',
                        doc.status === 'Verified'
                          ? 'bg-[#dfefe8] text-[#17b26a]'
                          : doc.status === 'Expired'
                          ? 'bg-[#f3e1e0] text-[#d92d20]'
                          : 'bg-[#eff1f3] text-[#6f777f]'
                      )}
                    >
                      {doc.status}
                    </span>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Reason selection */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1f2327]">
              Reason for Resubmission <span className="text-[#d92d20]">*</span>
            </label>
            <select
              value={selectedReason}
              onChange={(e) => setSelectedReason(e.target.value)}
              className="h-[38px] w-full rounded-[8px] border border-[#d3d5d7] bg-white px-3 text-[14px] text-[#1f2327] outline-none focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
            >
              {standardResubmitReasons.map((reason) => (
                <option key={reason} value={reason}>
                  {reason}
                </option>
              ))}
            </select>
          </div>

          {/* User message */}
          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1f2327]">
              Direct Instructions to User
            </label>
            <textarea
              rows={3}
              value={userMessage}
              onChange={(e) => setUserMessage(e.target.value)}
              placeholder="e.g. Please upload a high-resolution, uncropped copy of the Trade License with official DED seal..."
              className="w-full rounded-[8px] border border-[#d3d5d7] bg-white p-3 text-[14px] text-[#1f2327] placeholder:text-[#9da4ae] outline-none focus:border-[#00c2cb] focus:ring-2 focus:ring-[#00c2cb]/20"
            />
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
              disabled={isProcessing || selectedItems.length === 0}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-5 text-[13px] font-bold text-white hover:bg-[#00a8b0] disabled:opacity-40 transition-colors shadow-2xs cursor-pointer ant-wave-btn"
            >
              <Send className="size-4" />
              <span>{isProcessing ? 'Sending...' : 'Request Resubmission'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

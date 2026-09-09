'use client'

import * as React from 'react'
import {
  X,
  Clock,
  AlertTriangle,
  Send,
  FileText,
} from 'lucide-react'
import { type VerificationDocumentItem, type VerificationCase } from '@/lib/verification-data'

interface RequestDocUpdateModalProps {
  caseItem: VerificationCase
  document: VerificationDocumentItem
  onClose: () => void
  onConfirm: (message: string) => void
}

export function RequestDocUpdateModal({
  caseItem,
  document,
  onClose,
  onConfirm,
}: RequestDocUpdateModalProps) {
  const [message, setMessage] = React.useState(
    `Your ${document.type} (${document.name}) expired on ${document.expiryDate || 'recently'}. Please upload a renewed and officially certified certificate to maintain active status.`
  )
  const [isProcessing, setIsProcessing] = React.useState(false)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsProcessing(true)
    setTimeout(() => {
      onConfirm(message.trim())
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
              <Clock className="size-6" />
            </div>
            <div>
              <h2 className="text-[18px] font-bold text-[#1f2327]">Request Document Update</h2>
              <p className="text-[13px] text-[#6f777f]">Send formal renewal notice for expired document</p>
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

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3.5 space-y-2 text-[13px]">
            <div className="flex items-center justify-between">
              <span className="text-[#6f777f] font-medium">User:</span>
              <span className="font-bold text-[#1f2327]">{caseItem.applicantName} ({caseItem.userId})</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6f777f] font-medium">Expired Document:</span>
              <span className="font-semibold text-[#1f2327]">{document.type}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-[#6f777f] font-medium">Expiry Date:</span>
              <span className="font-bold text-[#d92d20]">{document.expiryDate || 'Expired'}</span>
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-[13px] font-bold text-[#1f2327]">
              Message to Applicant
            </label>
            <textarea
              required
              rows={4}
              value={message}
              onChange={(e) => setMessage(e.target.value)}
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
              disabled={isProcessing || !message.trim()}
              className="flex h-[36px] items-center gap-1.5 rounded-[8px] bg-[#00c2cb] px-5 text-[13px] font-bold text-white hover:bg-[#00a8b0] disabled:opacity-50 transition-colors shadow-2xs cursor-pointer ant-wave-btn"
            >
              <Send className="size-4" />
              <span>{isProcessing ? 'Sending...' : 'Request Update'}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

'use client'

import * as React from 'react'
import {
  X,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Clock,
  FileText,
  AlertTriangle,
  Building,
  User,
  Phone,
  Mail,
  Calendar,
  ExternalLink,
  Eye,
  Plus,
  Pin,
  RefreshCw,
  Award,
  Sparkles,
  ShieldAlert,
  Send,
  MessageSquare,
  History,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { StatusTag } from '@/components/ui/badge-tag'
import { FigmaStatusBadge } from '@/components/ui/figma-badges'
import { Flag, getCountryCode } from '@/components/ui/flag'
import type {
  VerificationCase,
  VerificationDocumentItem,
  VerificationNote,
  VerificationHistoryEvent,
} from '@/lib/verification-data'
import { VerificationDocInspectorModal } from './verification-doc-inspector-modal'
import { AddVerificationNoteModal } from './add-verification-note-modal'

interface VerificationCaseModalProps {
  caseItem: VerificationCase
  notes: VerificationNote[]
  history: VerificationHistoryEvent[]
  onClose: () => void
  onUpdateCaseStatus: (
    caseId: string,
    status: VerificationCase['status'],
    reason?: string
  ) => void
  onUpdateDocStatus: (
    docId: string,
    status: VerificationDocumentItem['status'],
    notes?: string,
    rejectionReason?: string
  ) => void
  onAddNote: (note: Omit<VerificationNote, 'id' | 'createdAt'>) => void
}

export function VerificationCaseModal({
  caseItem,
  notes,
  history,
  onClose,
  onUpdateCaseStatus,
  onUpdateDocStatus,
  onAddNote,
}: VerificationCaseModalProps) {
  const [activeTab, setActiveTab] = React.useState<'checklist' | 'history' | 'notes'>('checklist')
  const [inspectDocId, setInspectDocId] = React.useState<string | null>(null)
  const [isAddNoteOpen, setIsAddNoteOpen] = React.useState(false)
  const [showRejectForm, setShowRejectForm] = React.useState(false)
  const [rejectionReason, setRejectionReason] = React.useState('')

  const countryCode = getCountryCode(caseItem.country)

  const caseNotes = notes.filter((n) => n.caseId === caseItem.id || n.targetName === caseItem.applicantName)
  const caseHistory = history.filter((h) => h.caseId === caseItem.id || h.targetName === caseItem.applicantName)

  const totalDocs = caseItem.documents.length
  const verifiedDocs = caseItem.documents.filter((d) => d.status === 'Verified').length
  const completionPercent = totalDocs > 0 ? Math.round((verifiedDocs / totalDocs) * 100) : 100

  const handleApproveCase = () => {
    onUpdateCaseStatus(caseItem.id, 'Approved')
  }

  const handleRejectCase = () => {
    if (!rejectionReason.trim()) {
      setShowRejectForm(true)
      return
    }
    onUpdateCaseStatus(caseItem.id, 'Rejected', rejectionReason)
    setShowRejectForm(false)
  }

  const handleRequestResubmit = () => {
    onUpdateCaseStatus(caseItem.id, 'Resubmitted', rejectionReason || 'Re-upload requested for incomplete documents')
    setShowRejectForm(false)
  }

  return (
    <>
      <div
        className="fixed inset-0 z-40 flex items-center justify-center bg-black/60 p-2 sm:p-4 backdrop-blur-xs ant-fade-in font-sans"
        role="dialog"
        aria-modal="true"
      >
        <div className="relative flex h-[92vh] w-full max-w-5xl flex-col overflow-hidden rounded-[12px] border border-[#d3d5d7] bg-white shadow-2xl ant-modal-zoom">
          {/* MODAL HEADER */}
          <div className="flex shrink-0 items-center justify-between border-b border-[#d3d5d7] px-5 py-4 bg-[#fcfcfc]">
            <div className="flex items-center gap-3.5">
              <div className="relative">
                {caseItem.applicantAvatar ? (
                  <img
                    src={caseItem.applicantAvatar}
                    alt={caseItem.applicantName}
                    className="size-12 rounded-[8px] object-cover border border-[#d3d5d7]"
                  />
                ) : (
                  <div className="flex size-12 items-center justify-center rounded-[8px] bg-[#e5f6f7] text-[#00c2cb] font-bold text-[16px]">
                    {caseItem.applicantName.slice(0, 2).toUpperCase()}
                  </div>
                )}
                <span className="absolute -bottom-1 -right-1 flex size-5 items-center justify-center rounded-full bg-white border border-[#d3d5d7] shadow-2xs text-[10px]">
                  <Flag code={countryCode} className="size-3.5 rounded-xs" />
                </span>
              </div>

              <div>
                <div className="flex items-center gap-2">
                  <h2 className="text-[20px] font-bold text-[#1f2327]">{caseItem.applicantName}</h2>
                  <span
                    className={cn(
                      'rounded-[6px] px-2 py-0.5 text-[12px] font-semibold uppercase tracking-wider',
                      caseItem.role === 'Agent'
                        ? 'bg-[#eaf2ff] text-[#3366ff]'
                        : 'bg-[#e5f6f7] text-[#00c2cb]'
                    )}
                  >
                    {caseItem.role}
                  </span>
                  <FigmaStatusBadge status={caseItem.status} />
                </div>
                <div className="flex flex-wrap items-center gap-3 text-[13px] text-[#6f777f] mt-0.5">
                  <span className="font-mono text-[#1f2327] font-semibold">{caseItem.id}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Mail className="size-3.5 text-[#9da4ae]" />
                    {caseItem.applicantEmail}
                  </span>
                  <span>•</span>
                  <span className="flex items-center gap-1">
                    <Phone className="size-3.5 text-[#9da4ae]" />
                    {caseItem.applicantPhone}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="flex size-8 items-center justify-center rounded-[6px] border border-[#d3d5d7] text-[#6f777f] transition-colors hover:bg-[#eff1f3] hover:text-[#1f2327] cursor-pointer"
              >
                <X className="size-4.5" />
              </button>
            </div>
          </div>

          {/* SUB-HEADER: TABS & PROGRESS BAR */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between border-b border-[#d3d5d7] bg-white px-5 py-2.5 gap-3">
            <div className="flex items-center gap-1.5">
              <button
                type="button"
                onClick={() => setActiveTab('checklist')}
                className={cn(
                  'flex h-[34px] items-center gap-2 rounded-[8px] px-3.5 text-[13px] font-medium transition-colors cursor-pointer ant-wave-btn',
                  activeTab === 'checklist'
                    ? 'bg-[#1f2327] text-white shadow-2xs'
                    : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                )}
              >
                <ShieldCheck className="size-3.5" />
                <span>Verification Checklist</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('history')}
                className={cn(
                  'flex h-[34px] items-center gap-2 rounded-[8px] px-3.5 text-[13px] font-medium transition-colors cursor-pointer ant-wave-btn',
                  activeTab === 'history'
                    ? 'bg-[#1f2327] text-white shadow-2xs'
                    : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                )}
              >
                <History className="size-3.5" />
                <span>Audit History ({caseHistory.length})</span>
              </button>
              <button
                type="button"
                onClick={() => setActiveTab('notes')}
                className={cn(
                  'flex h-[34px] items-center gap-2 rounded-[8px] px-3.5 text-[13px] font-medium transition-colors cursor-pointer ant-wave-btn',
                  activeTab === 'notes'
                    ? 'bg-[#1f2327] text-white shadow-2xs'
                    : 'border border-[#d3d5d7] bg-white text-[#6f777f] hover:bg-[#eff1f3] hover:text-[#1f2327]'
                )}
              >
                <MessageSquare className="size-3.5" />
                <span>Compliance Notes ({caseNotes.length})</span>
              </button>
            </div>

            {/* COMPLETION PROGRESS */}
            <div className="flex items-center gap-3">
              <div className="text-right">
                <div className="text-[12px] font-semibold text-[#6f777f]">
                  Verification Progress: <strong className="text-[#1f2327]">{completionPercent}%</strong>
                </div>
                <div className="h-1.5 w-32 rounded-full bg-[#eff1f3] overflow-hidden mt-0.5">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-300',
                      completionPercent === 100 ? 'bg-[#17b26a]' : 'bg-[#00c2cb]'
                    )}
                    style={{ width: `${completionPercent}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MAIN MODAL CONTENT AREA */}
          <div className="flex flex-1 overflow-y-auto p-5">
            {activeTab === 'checklist' && (
              <div className="w-full space-y-6">
                {/* ROLE-SPECIFIC IDENTITY PROOFING HEADER */}
                {caseItem.role === 'Investor' ? (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[16px] font-bold text-[#1f2327]">Investor Verification Checklist</h3>
                        <p className="text-[13px] text-[#6f777f]">
                          Tier 1 & Tier 2 KYC identity proofing for property transactions
                        </p>
                      </div>
                      <span className="rounded-full bg-[#dfefe8] px-3 py-1 text-[12px] font-semibold text-[#17b26a] flex items-center gap-1.5">
                        <Sparkles className="size-3.5" />
                        KYC Tier 2 Ready
                      </span>
                    </div>

                    {/* CONTACT VERIFICATION CARDS (PHONE & EMAIL) */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-[#1f2327] flex items-center gap-1.5">
                            <Phone className="size-3.5 text-[#00c2cb]" />
                            Phone Verification (OTP)
                          </span>
                          <span className="rounded-[4px] bg-[#dfefe8] px-2 py-0.5 text-[11px] font-bold text-[#17b26a] flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            Verified
                          </span>
                        </div>
                        <p className="text-[13px] font-mono font-semibold text-[#1f2327]">
                          {caseItem.applicantPhone}
                        </p>
                        <p className="text-[12px] text-[#6f777f]">
                          Method: SMS OTP 6-digit pin • Carrier verified • 0 risk signals
                        </p>
                      </div>

                      <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-4 space-y-2">
                        <div className="flex items-center justify-between">
                          <span className="text-[13px] font-bold text-[#1f2327] flex items-center gap-1.5">
                            <Mail className="size-3.5 text-[#00c2cb]" />
                            Email Verification (Magic Link / Code)
                          </span>
                          <span className="rounded-[4px] bg-[#dfefe8] px-2 py-0.5 text-[11px] font-bold text-[#17b26a] flex items-center gap-1">
                            <CheckCircle2 className="size-3" />
                            Verified
                          </span>
                        </div>
                        <p className="text-[13px] font-mono font-semibold text-[#1f2327]">
                          {caseItem.applicantEmail}
                        </p>
                        <p className="text-[12px] text-[#6f777f]">
                          Domain authenticated • Deliverability confirmed • Active mailbox
                        </p>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-[16px] font-bold text-[#1f2327]">Agent Brokerage & License Verification</h3>
                        <p className="text-[13px] text-[#6f777f]">
                          Corporate registration, RERA broker license, and identity authentication
                        </p>
                      </div>
                      <span className="rounded-full bg-[#eaf2ff] px-3 py-1 text-[12px] font-semibold text-[#3366ff] flex items-center gap-1.5">
                        <Award className="size-3.5" />
                        RERA Pro Broker Pipeline
                      </span>
                    </div>

                    {/* AGENT AGENCY STATS */}
                    {caseItem.agentDetails && (
                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                        <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 space-y-1">
                          <span className="text-[12px] text-[#6f777f] font-medium">Licensed Brokerage</span>
                          <p className="text-[13px] font-bold text-[#1f2327] truncate">
                            {caseItem.agentDetails.agencyName}
                          </p>
                        </div>
                        <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 space-y-1">
                          <span className="text-[12px] text-[#6f777f] font-medium">Trade License #</span>
                          <p className="text-[13px] font-mono font-bold text-[#1f2327]">
                            {caseItem.agentDetails.tradeLicenseNumber}
                          </p>
                        </div>
                        <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-3 space-y-1">
                          <span className="text-[12px] text-[#6f777f] font-medium">RERA BRN / ORN</span>
                          <p className="text-[13px] font-mono font-bold text-[#1f2327]">
                            {caseItem.agentDetails.reraBrokerNumber} / {caseItem.agentDetails.reraOfficeNumber}
                          </p>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* DOCUMENTS TABLE / CARDS */}
                <div className="space-y-3">
                  <h4 className="text-[12px] font-bold uppercase tracking-wider text-[#6f777f]">
                    Required Document Submissions ({caseItem.documents.length})
                  </h4>

                  <div className="grid grid-cols-1 gap-3">
                    {caseItem.documents.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-[8px] border border-[#d3d5d7] bg-white p-4 transition-all hover:border-[#00c2cb]"
                      >
                        <div className="flex items-start sm:items-center gap-3">
                          <div className="flex size-10 items-center justify-center rounded-[8px] bg-[#eff1f3] text-[#1f2327] shrink-0">
                            <FileText className="size-5 text-[#00c2cb]" />
                          </div>
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="text-[14px] font-bold text-[#1f2327]">{doc.name}</span>
                              <StatusTag value={doc.status} size="xs" />
                            </div>
                            <div className="flex flex-wrap items-center gap-2.5 text-[12px] text-[#6f777f] mt-0.5">
                              <span>Type: <strong className="text-[#1f2327]">{doc.type}</strong></span>
                              {doc.expiryDate && (
                                <>
                                  <span>•</span>
                                  <span>Expires: <strong className={doc.status === 'Expired' ? 'text-[#d92d20]' : 'text-[#1f2327]'}>{doc.expiryDate}</strong></span>
                                </>
                              )}
                              {doc.documentNumber && (
                                <>
                                  <span>•</span>
                                  <span>Doc No: <strong className="font-mono text-[#1f2327]">{doc.documentNumber}</strong></span>
                                </>
                              )}
                              <span>•</span>
                              <span>Uploaded: {doc.uploadedAt}</span>
                            </div>
                            {doc.rejectionReason && (
                              <p className="text-[12px] text-[#d92d20] mt-1 flex items-center gap-1 font-medium">
                                <AlertTriangle className="size-3.5 shrink-0" />
                                Rejection feedback: {doc.rejectionReason}
                              </p>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                          <button
                            type="button"
                            onClick={() => setInspectDocId(doc.id)}
                            className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                          >
                            <Eye className="size-3.5 text-[#00c2cb]" />
                            <span>Inspect & Zoom</span>
                          </button>
                          {doc.status !== 'Verified' && (
                            <button
                              type="button"
                              onClick={() =>
                                onUpdateDocStatus(
                                  doc.id,
                                  'Verified',
                                  'Quick approved from case checklist'
                                )
                              }
                              className="flex h-[32px] items-center gap-1 rounded-[6px] bg-[#17b26a] px-3 text-[13px] font-bold text-white hover:bg-[#139757] transition-colors shadow-2xs cursor-pointer"
                            >
                              <CheckCircle2 className="size-3.5" />
                              <span>Approve</span>
                            </button>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* DECISION ACTION BAR & REJECTION FORM */}
                <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-4 space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h4 className="text-[14px] font-bold text-[#1f2327]">Overall Case Adjudication</h4>
                      <p className="text-[12px] text-[#6f777f]">
                        Issue verified platform badge or communicate feedback to applicant
                      </p>
                    </div>

                    <button
                      type="button"
                      onClick={() => setIsAddNoteOpen(true)}
                      className="flex h-[32px] items-center gap-1.5 rounded-[6px] border border-[#d3d5d7] bg-white px-3 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer self-start sm:self-center"
                    >
                      <Plus className="size-3.5" />
                      <span>Add Compliance Note</span>
                    </button>
                  </div>

                  {showRejectForm ? (
                    <div className="rounded-[8px] border border-[#d92d20]/30 bg-[#f3e1e0]/40 p-4 space-y-3 ant-fade-in">
                      <div className="flex items-center justify-between">
                        <span className="text-[13px] font-bold text-[#d92d20] flex items-center gap-1.5">
                          <AlertTriangle className="size-4" />
                          Specify reason for Case Rejection or Resubmission:
                        </span>
                        <button
                          type="button"
                          onClick={() => setShowRejectForm(false)}
                          className="text-[12px] text-[#6f777f] hover:text-[#1f2327] cursor-pointer"
                        >
                          Cancel
                        </button>
                      </div>
                      <textarea
                        rows={2}
                        value={rejectionReason}
                        onChange={(e) => setRejectionReason(e.target.value)}
                        placeholder="Provide details about why the case cannot be approved yet..."
                        className="w-full rounded-[8px] border border-[#d3d5d7] bg-white p-2.5 text-[13px] text-[#1f2327] placeholder:text-[#9da4ae] focus:border-[#00c2cb] focus:outline-none"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={handleRejectCase}
                          className="h-[34px] rounded-[8px] bg-[#d92d20] px-3.5 text-[13px] font-bold text-white hover:bg-[#b92518] shadow-2xs cursor-pointer"
                        >
                          Reject Full Case
                        </button>
                        <button
                          type="button"
                          onClick={handleRequestResubmit}
                          className="h-[34px] rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] cursor-pointer"
                        >
                          Request Resubmission
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex flex-wrap items-center gap-2 pt-1">
                      <button
                        type="button"
                        onClick={handleApproveCase}
                        disabled={caseItem.status === 'Approved'}
                        className="flex h-[36px] items-center gap-2 rounded-[8px] bg-[#17b26a] px-4 text-[13px] font-bold text-white shadow-2xs hover:bg-[#139757] disabled:opacity-50 transition-colors cursor-pointer"
                      >
                        <ShieldCheck className="size-4" />
                        <span>Approve Case & Issue {caseItem.role === 'Agent' ? 'RERA Pro Badge' : 'Verified Investor Badge'}</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => setShowRejectForm(true)}
                        className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d92d20]/30 bg-[#f3e1e0] px-3.5 text-[13px] font-bold text-[#d92d20] hover:bg-[#f3e1e0]/80 transition-colors cursor-pointer"
                      >
                        <XCircle className="size-4" />
                        <span>Reject Case</span>
                      </button>
                      <button
                        type="button"
                        onClick={() => {
                          setShowRejectForm(true)
                          setRejectionReason('Please re-upload expired or uncertified documents.')
                        }}
                        className="flex h-[36px] items-center gap-1.5 rounded-[8px] border border-[#d3d5d7] bg-white px-3.5 text-[13px] font-semibold text-[#1f2327] hover:bg-[#eff1f3] transition-colors cursor-pointer"
                      >
                        <RefreshCw className="size-3.5" />
                        <span>Request Resubmission</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* AUDIT HISTORY TAB */}
            {activeTab === 'history' && (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1f2327]">Verification Case Audit Trail</h3>
                    <p className="text-[13px] text-[#6f777f]">
                      Immutable record of all OCR extractions, document uploads, and compliance decisions
                    </p>
                  </div>
                </div>

                {caseHistory.length === 0 ? (
                  <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-8 text-center text-[13px] text-[#6f777f]">
                    No historical events recorded for this case yet.
                  </div>
                ) : (
                  <div className="relative pl-6 space-y-3.5 before:absolute before:left-2.5 before:top-2 before:bottom-2 before:w-0.5 before:bg-[#d3d5d7]">
                    {caseHistory.map((evt) => (
                      <div key={evt.id} className="relative group">
                        <span className="absolute -left-6 top-1.5 flex size-3 rounded-full bg-[#00c2cb] border-2 border-white ring-2 ring-[#00c2cb]/20" />
                        <div className="rounded-[8px] border border-[#d3d5d7] bg-white p-3.5 space-y-1 shadow-[0px_1px_2px_rgba(16,24,40,0.05)]">
                          <div className="flex items-center justify-between text-[13px]">
                            <span className="font-bold text-[#1f2327]">{evt.action}</span>
                            <span className="text-[12px] text-[#6f777f] flex items-center gap-1">
                              <Clock className="size-3" />
                              {evt.timestamp}
                            </span>
                          </div>
                          <p className="text-[13px] text-[#6f777f]">{evt.details}</p>
                          <div className="flex items-center gap-2 pt-1 text-[12px] text-[#6f777f]">
                            <span>Actor / Reviewer: <strong className="text-[#1f2327]">{evt.reviewer}</strong></span>
                            {evt.statusTo && (
                              <span>• Status: <strong className="text-[#00c2cb]">{evt.statusTo}</strong></span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* COMPLIANCE NOTES TAB */}
            {activeTab === 'notes' && (
              <div className="w-full space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-[16px] font-bold text-[#1f2327]">Internal Compliance & KYC Notes</h3>
                    <p className="text-[13px] text-[#6f777f]">
                      Confidential observations and review logs visible to administrators only
                    </p>
                  </div>
                  <button
                    type="button"
                    onClick={() => setIsAddNoteOpen(true)}
                    className="flex h-[32px] items-center gap-1.5 rounded-[6px] bg-[#1f2327] px-3 text-[13px] font-medium text-white hover:bg-[#2e3338] shadow-2xs cursor-pointer"
                  >
                    <Plus className="size-3.5" />
                    <span>New Note</span>
                  </button>
                </div>

                {caseNotes.length === 0 ? (
                  <div className="rounded-[8px] border border-[#d3d5d7] bg-[#fcfcfc] p-8 text-center text-[13px] text-[#6f777f]">
                    No compliance notes recorded for this case yet.
                  </div>
                ) : (
                  <div className="space-y-3">
                    {caseNotes.map((note) => (
                      <div
                        key={note.id}
                        className={cn(
                          'rounded-[8px] border p-4 space-y-2 shadow-[0px_1px_2px_rgba(16,24,40,0.05)] transition-all',
                          note.isPinned
                            ? 'border-[#f79009]/40 bg-[#fffaf0]'
                            : 'border-[#d3d5d7] bg-white'
                        )}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            {note.isPinned && <Pin className="size-3.5 text-[#f79009]" />}
                            <span className="text-[14px] font-bold text-[#1f2327]">{note.author}</span>
                            <span className="text-[12px] text-[#6f777f]">({note.authorRole})</span>
                            <span className="rounded-[4px] bg-[#eff1f3] px-2 py-0.5 text-[11px] font-semibold text-[#6f777f]">
                              {note.tag}
                            </span>
                          </div>
                          <span className="text-[12px] text-[#6f777f]">{note.createdAt}</span>
                        </div>
                        <p className="text-[13px] text-[#1f2327] leading-relaxed">{note.content}</p>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* DOCUMENT INSPECTOR MODAL */}
      {inspectDocId && (
        <VerificationDocInspectorModal
          documents={caseItem.documents}
          initialDocId={inspectDocId}
          applicantName={caseItem.applicantName}
          applicantRole={caseItem.role}
          applicantCountry={caseItem.country}
          onClose={() => setInspectDocId(null)}
          onUpdateDocumentStatus={(docId, status, reviewNotes, reason) => {
            onUpdateDocStatus(docId, status, reviewNotes, reason)
            setInspectDocId(null)
          }}
        />
      )}

      {/* ADD NOTE MODAL */}
      {isAddNoteOpen && (
        <AddVerificationNoteModal
          caseItem={caseItem}
          onClose={() => setIsAddNoteOpen(false)}
          onSaveNote={(note) => {
            onAddNote(note)
            setIsAddNoteOpen(false)
          }}
        />
      )}
    </>
  )
}
